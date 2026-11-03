import type { LinearFit } from './projection';

/** One independently styleable boundary (country, state or district). */
export type GeoRegion = { id: string; name: string; d: string };

export type ViewBox = [x: number, y: number, w: number, h: number];

/**
 * Every layer shares the world map's Equal Earth coordinate space, so a single SVG
 * can zoom from the world to India to Kerala. `bounds` are the frames to zoom to.
 */
export type Atlas = {
  fit: LinearFit;
  bounds: { world: ViewBox; india: ViewBox; kerala: ViewBox };
  world: GeoRegion[];
  states: GeoRegion[];
  districts: GeoRegion[];
};
