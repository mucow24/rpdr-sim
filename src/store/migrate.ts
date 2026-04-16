/** Migration for the zustand persist middleware.
 *
 *  v1 → v2 is deliberately destructive: the v1 payload held a single `realSeason`
 *  (hardcoded to S5) plus per-tab editor scratch state, and had fallen out of
 *  sync with the source .ts files (zero-stat queens). Since the canonical data
 *  lives in the .ts files and the Data tab's "Reload queens / Reload seasons"
 *  flow can re-seed at any time, the cleanest migration is to drop the v1
 *  payload and let the store fall back to its initial state (seeded from
 *  SEASON_PRESETS).
 *
 *  Future (v2 → v3+) migrations should be additive — preserving user edits
 *  stored under the v2 shape rather than wiping. Returning `null` here tells
 *  zustand to use the initial state as-is.
 */
export function migrateToV2(persisted: unknown, version: number): unknown {
  if (!persisted || version < 2) {
    return null;
  }
  return persisted;
}
