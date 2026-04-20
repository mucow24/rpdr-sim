/** Deterministic PRNG facade used by the engine.
 *
 *  Production callers leave `seed` unset and the engine falls back to
 *  `Math.random` — identical behavior to before this module existed.
 *  Tests pass a `seed` to get reproducible runs (mulberry32 — fast, small
 *  state, adequate statistical quality for a non-crypto Monte Carlo). */
export type Rng = () => number;

export function createSeededRng(seed: number): Rng {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function resolveRng(seed?: number): Rng {
  return seed === undefined ? Math.random : createSeededRng(seed);
}
