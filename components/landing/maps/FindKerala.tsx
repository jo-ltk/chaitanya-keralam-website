'use client';

import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { projectWorld, type Point } from '@/lib/geo/projection';
import { DESTINATIONS, DESTINATION_KINDS, KERALA_PIN, mapsSearchUrl, type Destination } from '@/lib/geo/destinations';
import type { Atlas, ViewBox } from '@/lib/geo/types';

type Level = 'world' | 'india' | 'kerala';
type Phase = 'idle' | 'armed' | 'in';

const LEVELS: { id: Level; tab: string }[] = [
  { id: 'world', tab: 'World' },
  { id: 'india', tab: 'India' },
  { id: 'kerala', tab: 'Kerala' },
];

const COPY: Record<Exclude<Level, 'kerala'>, { kicker: string; title: string; text: string; cta: string; next: Level }> = {
  world: { kicker: '01 / World', title: 'India, on the world map', text: 'Kerala lies on the south-western coast of India, between the Western Ghats and the Arabian Sea.', cta: 'Zoom into India', next: 'india' },
  india: { kicker: '02 / India', title: 'Kerala, on the south-western coast', text: 'A narrow green strip about 580 km long, with hills on one side and the sea on the other.', cta: 'Explore Kerala', next: 'kerala' },
};

const PLACE_NAMES = [
  { name: 'Arabian Sea', lat: 9.0, lon: 74.9 },
  { name: 'Karnataka', lat: 12.7, lon: 76.6 },
  { name: 'Tamil Nadu', lat: 10.2, lon: 78.0 },
];

const AUTO_STEP_MS = 3200;
const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const ease = (t: number) => 1 - Math.pow(1 - t, 4); // easeOutQuart, close to the site's --ease

/** The boundary layers never change once drawn, so React must not re-render them. */
const Layers = memo(function Layers({ atlas, onIndia, onKerala }: { atlas: Atlas; onIndia: () => void; onKerala: () => void }) {
  const india = atlas.world.find((r) => r.id === 'IN')!;
  const kl = atlas.states.find((r) => r.id === 'IN-KL')!;
  return (
    <>
      <defs>
        <filter id="geo-glow-w" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.6" /></filter>
        <filter id="geo-glow-i" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="0.7" /></filter>
      </defs>
      <g className="geo-land geo-world-land">
        {atlas.world.map((r) => r.id !== 'IN' && <path key={r.id} d={r.d} vectorEffect="non-scaling-stroke" />)}
      </g>
      <g className="geo-world-in">
        <path className="geo-glow" d={india.d} filter="url(#geo-glow-w)" />
        <path className="geo-hl geo-hit" d={india.d} vectorEffect="non-scaling-stroke" onClick={onIndia}><title>India</title></path>
      </g>
      <g className="geo-states">
        <g className="geo-land">
          {atlas.states.map((r) => r.id !== 'IN-KL' && <path key={r.id} d={r.d} vectorEffect="non-scaling-stroke" />)}
        </g>
        <g className="geo-kl">
          <path className="geo-glow" d={kl.d} filter="url(#geo-glow-i)" />
          <path className="geo-hl geo-hit" d={kl.d} vectorEffect="non-scaling-stroke" onClick={onKerala}><title>Kerala</title></path>
        </g>
      </g>
      <g className="geo-districts geo-land">
        {atlas.districts.map((r) => <path key={r.id} data-id={r.id} d={r.d} vectorEffect="non-scaling-stroke" />)}
      </g>
    </>
  );
});

export default function FindKerala() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const viewRef = useRef<ViewBox | null>(null);
  const rafRef = useRef(0);
  const autoRef = useRef<number[]>([]);

  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [level, setLevel] = useState<Level>('world');
  const [active, setActive] = useState<Destination | null>(null);
  const [phase, setPhase] = useState<Phase>('idle');
  const [seen, setSeen] = useState(false);
  const [reduced, setReduced] = useState(false);

  /* ---- load the boundary data (code-split) when the section nears the viewport ---- */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let off = false;
    const load = () => import('@/lib/geo/kerala-atlas').then((m) => { if (!off) setAtlas(m.ATLAS); });
    if (!('IntersectionObserver' in window)) { load(); return () => { off = true; }; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); load(); } }, { rootMargin: '900px 0px' });
    io.observe(el);
    return () => { off = true; io.disconnect(); };
  }, []);

  /* ---- scroll-triggered entrance (content stays visible if JS or IO is unavailable) ---- */
  useEffect(() => {
    const el = stageRef.current;
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(rm);
    if (!el || rm || !('IntersectionObserver' in window)) { setSeen(true); return; }
    setPhase('armed');
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => { if (atlas && seen) setPhase('in'); }, [atlas, seen]);

  /* ---- camera: tween the viewBox, and keep the HTML markers pinned to their coordinates ---- */
  const frame = useCallback((level: Level): ViewBox => {
    const st = stageRef.current!;
    const aspect = st.clientWidth / Math.max(1, st.clientHeight);
    const [bx, by, bw, bh] = atlas!.bounds[level];
    const cx = bx + bw / 2, cy = by + bh / 2;
    let w: number;
    if (level === 'world') {
      // Narrow stages crop to Eurasia, Africa and Australasia around India instead of shrinking the whole world.
      const ind = atlas!.bounds.india;
      if (aspect >= 1.5) return [bx, cy - bw / aspect / 2, bw, bw / aspect];
      w = bw * 0.62;
      return [ind[0] + ind[2] / 2 - w / 2, cy - w / aspect / 2, w, w / aspect];
    }
    const margin = level === 'india' ? 1.28 : 1.22;
    w = Math.max(bw * margin, bh * margin * aspect);
    return [cx - w / 2, cy - w / aspect / 2, w, w / aspect];
  }, [atlas]);

  const apply = useCallback((vb: ViewBox) => {
    viewRef.current = vb;
    svgRef.current?.setAttribute('viewBox', vb.join(' '));
    stageRef.current?.querySelectorAll<HTMLElement>('[data-x]').forEach((el) => {
      el.style.left = `${((+el.dataset.x! - vb[0]) / vb[2]) * 100}%`;
      el.style.top = `${((+el.dataset.y! - vb[1]) / vb[3]) * 100}%`;
    });
  }, []);

  const flyTo = useCallback((target: ViewBox, instant: boolean) => {
    cancelAnimationFrame(rafRef.current);
    const from = viewRef.current ?? target;
    if (instant) { apply(target); return; }
    const t0 = performance.now(), dur = 1700;
    // Interpolate the centre linearly and the width geometrically, so the zoom feels even.
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const [fcx, fcy] = [from[0] + from[2] / 2, from[1] + from[3] / 2];
    const [tcx, tcy] = [target[0] + target[2] / 2, target[1] + target[3] / 2];
    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / dur), e = ease(t);
      const w = from[2] * Math.pow(target[2] / from[2], e), h = from[3] * Math.pow(target[3] / from[3], e);
      apply([lerp(fcx, tcx, e) - w / 2, lerp(fcy, tcy, e) - h / 2, w, h]);
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, [apply]);

  const first = useRef(true);
  useLayoutEffect(() => {
    if (!atlas) return;
    flyTo(frame(level), first.current || reduced);
    first.current = false;
  }, [atlas, level, frame, flyTo, reduced]);

  // Re-frame (without animating) when the stage changes size, e.g. rotating a phone.
  useEffect(() => {
    const st = stageRef.current;
    if (!st || !atlas) return;
    const ro = new ResizeObserver(() => flyTo(frame(level), true));
    ro.observe(st);
    return () => { ro.disconnect(); cancelAnimationFrame(rafRef.current); };
  }, [atlas, level, frame, flyTo]);

  /* ---- intro: world -> India -> Kerala once, until the visitor takes over ---- */
  const stopAuto = useCallback(() => { autoRef.current.forEach(clearTimeout); autoRef.current = []; }, []);
  useEffect(() => {
    if (phase !== 'in' || reduced) return;
    autoRef.current = [
      window.setTimeout(() => setLevel('india'), AUTO_STEP_MS + 1800),
      window.setTimeout(() => setLevel('kerala'), AUTO_STEP_MS * 2 + 1800),
    ];
    return stopAuto;
  }, [phase, reduced, stopAuto]);

  const go = useCallback((l: Level) => { stopAuto(); setLevel(l); if (l !== 'kerala') setActive(null); }, [stopAuto]);
  const select = (d: Destination) => { stopAuto(); setLevel('kerala'); setActive(d); };
  const hover = (d: Destination) => (e: React.PointerEvent) => { if (e.pointerType === 'mouse') setActive(d); };

  /* ---- tabs: arrow keys move between the three levels ---- */
  const onTabKey = (e: React.KeyboardEvent) => {
    const i = LEVELS.findIndex((l) => l.id === level);
    const n = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? LEVELS.length - 1 : -1;
    if (n < 0) return;
    e.preventDefault();
    const next = LEVELS[(n + LEVELS.length) % LEVELS.length].id;
    go(next);
    document.getElementById(`geo-t-${next}`)?.focus();
  };

  const at = (p: Point): CSSProperties & Record<string, number> => ({ '--x': p[0], '--y': p[1] }) as never;
  const pt = (lon: number, lat: number): Point => projectWorld(atlas!.fit, lon, lat);
  const pin = atlas ? pt(KERALA_PIN.lon, KERALA_PIN.lat) : null;
  const copy = level === 'kerala' ? null : COPY[level];

  return (
    <div className="geo" ref={rootRef} data-level={level} data-phase={phase}>
      <div className="geo-info">
        <div className="tabs geo-tabs" role="tablist" aria-label="Map zoom level" onKeyDown={onTabKey}>
          {LEVELS.map((l) => (
            <button key={l.id} id={`geo-t-${l.id}`} className="tab" type="button" role="tab" aria-selected={level === l.id} aria-controls="geo-panel" tabIndex={level === l.id ? 0 : -1} onClick={() => go(l.id)}>{l.tab}</button>
          ))}
        </div>
        <div className="geo-detail" id="geo-panel" role="tabpanel" aria-labelledby={`geo-t-${level}`} aria-live="polite">
          {copy ? (
            <>
              <span className="kicker">{copy.kicker}</span>
              <b>{copy.title}</b>
              <p>{copy.text}</p>
              <button className="tlink geo-cta" type="button" onClick={() => go(copy.next)}><span>{copy.cta}</span><span className="arrow" aria-hidden="true">→</span></button>
            </>
          ) : active ? (
            <>
              <span className="kicker">03 / Kerala</span>
              <b>{active.name}</b>
              <span className="geo-detail-meta">{titleCase(active.district)} district · {DESTINATION_KINDS[active.kind]}</span>
              <p>{active.description}</p>
              <a className="tlink" href={mapsSearchUrl(active.name)} target="_blank" rel="noopener noreferrer"><span>Open in Google Maps</span><span className="arrow" aria-hidden="true">→</span></a>
            </>
          ) : (
            <>
              <span className="kicker">03 / Kerala</span>
              <b>Where our journeys take you</b>
              <p>Select a place on the map or in the list to learn more.</p>
            </>
          )}
        </div>
        <ul className="geo-legend" aria-hidden="true">
          {Object.entries(DESTINATION_KINDS).map(([k, name]) => <li key={k}><i className={`geo-mk-dot k-${k}`} />{name}</li>)}
        </ul>
      </div>

      <div className="geo-frame">
        <div className="geo-stage" ref={stageRef}>
          {atlas && (
            <svg ref={svgRef} className="geo-svg" role="img" aria-label="Interactive map: the world, India and Kerala" preserveAspectRatio="xMidYMid slice">
              <Layers atlas={atlas} onIndia={() => go('india')} onKerala={() => go('kerala')} />
              {active && <path key={active.district} className="geo-tint" d={atlas.districts.find((d) => d.id === active.district)?.d} vectorEffect="non-scaling-stroke" />}
            </svg>
          )}
          <div className="geo-overlay">
            {atlas && pin && (
              <span className="geo-pin" data-x={pin[0]} data-y={pin[1]} aria-hidden="true">
                <i className="geo-pin-pulse" /><i className="geo-pin-dot" />
                <span className="geo-callout"><i className="geo-callout-line" /><span className="geo-callout-t">Kerala</span></span>
              </span>
            )}
            {atlas && PLACE_NAMES.map((p) => { const q = pt(p.lon, p.lat); return <span key={p.name} className="geo-place" data-p={p.name.replace(/ /g, "-").toLowerCase()} data-x={q[0]} data-y={q[1]} aria-hidden="true">{p.name}</span>; })}
            {atlas && DESTINATIONS.map((d, i) => {
              const q = pt(d.lon, d.lat);
              return (
                <button
                  key={d.name}
                  type="button"
                  className={`geo-mk to-${d.label}`}
                  data-x={q[0]} data-y={q[1]}
                  style={{ '--i': i } as CSSProperties}
                  tabIndex={level === 'kerala' ? 0 : -1}
                  aria-pressed={active?.name === d.name}
                  aria-label={`${d.name}, ${d.tag}`}
                  onPointerEnter={hover(d)}
                  onFocus={() => setActive(d)}
                  onClick={() => select(d)}
                >
                  <i className={`geo-mk-dot k-${d.kind}`} aria-hidden="true" />
                  <span className="geo-mk-t" aria-hidden="true">{d.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <ul className="map-places">
        {DESTINATIONS.map((d) => (
          <li key={d.name}>
            <button type="button" aria-pressed={active?.name === d.name} onPointerEnter={hover(d)} onClick={() => select(d)}>
              <i className={`geo-mk-dot k-${d.kind}`} aria-hidden="true" />{d.name}<span>{d.tag}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
