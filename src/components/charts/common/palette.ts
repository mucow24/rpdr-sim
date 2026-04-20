import * as d3 from 'd3';

/** Canonical placement → color map shared by every chart that draws
 *  per-placement state (timeline, flow ribbons, calibrate, trajectories).
 *  ELIM is included even though `PLACEMENTS` itself stays 5-valued — charts
 *  still need to draw "eliminated this episode" as its own visual cue. */
export const PLACEMENT_PALETTE: Record<string, string> = {
  WIN: '#ffd700',
  HIGH: '#a8d8ea',
  SAFE: '#888888',
  LOW: '#e8a87c',
  BTM2: '#e74c3c',
  ELIM: '#8b0000',
};

/** Brightness-lifted variant for flow chart ribbons + nodes. The lift floor
 *  (L = 0.75) keeps dark placements like ELIM readable on the dark panel
 *  background where unlifted #8b0000 would disappear. */
export const PLACEMENT_PALETTE_BRIGHT: Record<string, string> = Object.fromEntries(
  Object.entries(PLACEMENT_PALETTE).map(([k, c]) => {
    const hsl = d3.hsl(c);
    hsl.l = Math.max(hsl.l, 0.75);
    return [k, hsl.formatRgb()];
  }),
);
