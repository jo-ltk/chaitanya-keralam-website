/*
 * Builds lib/geo/kerala-atlas.ts from the raw boundary sources.
 *
 *   npx tsx scripts/build-map-data.ts <worldHigh.svg> <worldHigh.json> <india2020High.json> <kerala-district.geojson>
 *
 * Sources
 *   worldHigh.svg  amCharts SVG map (Mercator), https://www.amcharts.com/svg-maps/
 *   worldHigh.json           @amcharts/amcharts5-geodata (used only to calibrate the SVG's projection)
 *   india2020High.json       @amcharts/amcharts5-geodata, 36 states and union territories
 *   district.geojson         https://github.com/geohacker/kerala (DataMeet / Census 2011 districts)
 *
 * The world SVG paths are reused as-is. India's states and Kerala's districts are projected
 * into the same Mercator coordinate space, so one SVG can zoom from world to Kerala.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { mercY, projectWorld, type LinearFit, type Point } from '../lib/geo/projection';
import type { GeoRegion, ViewBox } from '../lib/geo/types';

const [worldSvgPath, worldJsonPath, indiaPath, keralaPath] = process.argv.slice(2);
if (!keralaPath) { console.error('usage: tsx scripts/build-map-data.ts <world.svg> <world.json> <india.json> <kerala.geojson>'); process.exit(1); }

const OUT = join(__dirname, '..', 'lib', 'geo', 'kerala-atlas.ts');

type BBox = [number, number, number, number];
const emptyBox = (): BBox => [Infinity, Infinity, -Infinity, -Infinity];
const grow = (b: BBox, [x, y]: Point) => { b[0] = Math.min(b[0], x); b[1] = Math.min(b[1], y); b[2] = Math.max(b[2], x); b[3] = Math.max(b[3], y); };
const round = (n: number, dp: number) => { const m = 10 ** dp; return Math.round(n * m) / m; };
const toView = (b: BBox): ViewBox => [round(b[0], 2), round(b[1], 2), round(b[2] - b[0], 2), round(b[3] - b[1], 2)];

/** Thin a ring (drop vertices closer than `min` to the previous) and write it as a path. */
function ringsToPath(rings: Point[][], min: number, dp: number): string {
  let d = '';
  for (const ring of rings) {
    const pts: Point[] = [];
    for (const p of ring) {
      const last = pts[pts.length - 1];
      if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) >= min) pts.push(p);
    }
    if (pts.length >= 3) d += 'M' + pts.map(([x, y]) => `${round(x, dp)},${round(y, dp)}`).join('L') + 'Z';
  }
  return d;
}

/* ---------- world: reuse the SVG paths ---------- */

const svg = readFileSync(worldSvgPath, 'utf8');
const world: (GeoRegion & { box: BBox })[] = [];
for (const m of svg.matchAll(/<path id="([^"]+)" data-name="([^"]+)"[^>]*\sd="([^"]+)"/g)) {
  const [, id, name, d] = m;
  if (id === 'AQ') continue; // Antarctica only adds a band of grey under the map
  const box = emptyBox();
  const rings = d.split('M').filter(Boolean).map((ring) => {
    const pts: Point[] = [];
    for (const [, x, y] of ring.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)) { const p: Point = [+x, +y]; grow(box, p); pts.push(p); }
    return pts;
  });
  const path = ringsToPath(rings, 0.35, 1);
  // Keep tiny islands visible as a dot rather than losing them.
  world.push({ id, name, d: path || d.replace(/(-?\d+\.\d+)/g, (n) => String(round(+n, 1))), box });
}

/* ---------- calibrate the SVG's Mercator scale/offset against real lon/lat ---------- */

function walk(c: any, fn: (c: number[]) => void) { typeof c[0] === 'number' ? fn(c) : c.forEach((x: any) => walk(x, fn)); }
function sum<T>(a: T[], f: (t: T) => number) { return a.reduce((s, t) => s + f(t), 0); }

const worldGeo = JSON.parse(readFileSync(worldJsonPath, 'utf8'));
const xs: [number, number][] = [], ys: [number, number][] = [];
for (const f of worldGeo.features) {
  const r = world.find((w) => w.id === f.properties.id);
  if (!r || !f.geometry) continue;
  const raw = emptyBox();
  walk(f.geometry.coordinates, (c) => grow(raw, [c[0], mercY(c[1])] as Point));
  if (raw[2] - raw[0] > 300) continue; // crosses the antimeridian
  xs.push([raw[0], r.box[0]], [raw[2], r.box[2]]);
  ys.push([raw[3], r.box[1]], [raw[1], r.box[3]]); // SVG y grows southwards
}
function fitLine(pairs: [number, number][]) {
  let use = pairs;
  for (let pass = 0; pass < 3; pass++) {
    const n = use.length, sx = sum(use, (p) => p[0]), sy = sum(use, (p) => p[1]);
    const sxx = sum(use, (p) => p[0] * p[0]), sxy = sum(use, (p) => p[0] * p[1]);
    const a = (n * sxy - sx * sy) / (n * sxx - sx * sx), b = (sy - a * sx) / n;
    const keep = pairs.filter((p) => Math.abs(a * p[0] + b - p[1]) < 1.5);
    if (pass === 2 || keep.length === use.length) {
      return { a, b, rms: Math.sqrt(sum(use, (p) => (a * p[0] + b - p[1]) ** 2) / use.length), n: use.length };
    }
    use = keep;
  }
  throw new Error('unreachable');
}
const fx = fitLine(xs), fy = fitLine(ys);
console.log(`world fit: x rms ${fx.rms.toFixed(3)} (${fx.n}), y rms ${fy.rms.toFixed(3)} (${fy.n})`);
const fit: LinearFit = { sx: round(fx.a, 6), tx: round(fx.b, 6), sy: round(fy.a, 6), ty: round(fy.b, 6) };

/* ---------- India states and Kerala districts, in the same space ---------- */

function project(geometry: any): Point[][] {
  const polys: number[][][][] = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polys.flatMap((poly) => poly.map((ring) => ring.map(([lon, lat]) => projectWorld(fit, lon, lat))));
}
const regionBox = (rings: Point[][]) => { const b = emptyBox(); rings.flat().forEach((p) => grow(b, p)); return b; };

const india = JSON.parse(readFileSync(indiaPath, 'utf8'));
const kerala = JSON.parse(readFileSync(keralaPath, 'utf8'));

const indiaBox = emptyBox();
const states: GeoRegion[] = india.features.map((f: any) => {
  const rings = project(f.geometry);
  const b = regionBox(rings);
  // Lakshadweep and the Andamans sit far from the mainland, so they stay out of the zoom frame.
  if (!['IN-LD', 'IN-AN'].includes(f.properties.id)) { grow(indiaBox, [b[0], b[1]]); grow(indiaBox, [b[2], b[3]]); }
  return { id: f.properties.id, name: f.properties.name, d: ringsToPath(rings, 0.03, 2) };
});

const keralaBox = emptyBox();
const districts: GeoRegion[] = kerala.features.map((f: any) => {
  const rings = project(f.geometry);
  const b = regionBox(rings);
  grow(keralaBox, [b[0], b[1]]); grow(keralaBox, [b[2], b[3]]);
  return { id: f.properties.DISTRICT.toLowerCase(), name: f.properties.DISTRICT, d: ringsToPath(rings, 0.015, 2) };
});

const wb = emptyBox();
world.forEach((w) => { grow(wb, [w.box[0], w.box[1]]); grow(wb, [w.box[2], w.box[3]]); });
const pad = (b: BBox, p: number): BBox => [b[0] - p, b[1] - p, b[2] + p, b[3] + p];

const atlas = {
  fit,
  bounds: { world: toView(pad(wb, 2)), india: toView(indiaBox), kerala: toView(keralaBox) },
  world: world.map(({ id, name, d }) => ({ id, name, d })),
  states,
  districts,
};
const src = `// Generated by scripts/build-map-data.ts. Do not edit by hand.\nimport type { Atlas } from './types';\n\nexport const ATLAS: Atlas = ${JSON.stringify(atlas)};\n`;
writeFileSync(OUT, src);
console.log(`kerala-atlas.ts: ${(src.length / 1024).toFixed(0)} KB`, atlas.bounds);
