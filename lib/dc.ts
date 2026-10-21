/* Helpers for components converted from the design canvas. */
import type { CSSProperties } from 'react';

/** A template value as text: null and undefined become an empty string. */
export function str(v: unknown): string {
  return v == null ? '' : String(v);
}

const cache = new Map<string, CSSProperties>();

/** Turns an inline CSS string ("gap: 8px; --cols: 1fr") into a React style object. */
export function css(text: string): CSSProperties {
  const hit = cache.get(text);
  if (hit) return hit;
  const out: Record<string, string> = {};
  let depth = 0, start = 0;
  const parts: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    else if (ch === ';' && depth === 0) { parts.push(text.slice(start, i)); start = i + 1; }
  }
  parts.push(text.slice(start));
  for (const decl of parts) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    const prop = decl.slice(0, i).trim();
    const value = decl.slice(i + 1).trim();
    if (!prop || !value) continue;
    const key = prop.startsWith('--') ? prop : prop.replace(/^-(webkit|moz|ms)-/, (_, p) => p.charAt(0).toUpperCase() + p.slice(1) + '-').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    out[key] = value;
  }
  cache.set(text, out as CSSProperties);
  return out as CSSProperties;
}
