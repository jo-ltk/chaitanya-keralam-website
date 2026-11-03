/*
 * Mercator projection used by the world SVG (worldHigh.svg), shared by the data build
 * script (scripts/build-map-data.ts) and the map component, so markers placed from real
 * latitude/longitude land exactly where the boundary paths were drawn.
 */

export type Point = [x: number, y: number];

const RAD = Math.PI / 180;

/** Mercator northing in degrees, so x (longitude) and y share a unit. */
export const mercY = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * RAD) / 2)) / RAD;

/** Linear fit from (longitude, mercY) to SVG user units. */
export type LinearFit = { sx: number; tx: number; sy: number; ty: number };

export function projectWorld(fit: LinearFit, lon: number, lat: number): Point {
  return [fit.sx * lon + fit.tx, fit.sy * mercY(lat) + fit.ty];
}
