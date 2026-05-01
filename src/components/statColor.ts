// Shared stat-value color palette used by the Cast Editor and Calibrate
// tooltips. Bands are inclusive on the lower bound, so e.g. 5.99 is still
// neutral and only a true 6 reads as green. Glow on 10.
export function statColorClass(value: number): string {
  if (value >= 10) return 'text-amber-300 font-semibold drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]';
  if (value >= 8) return 'text-sky-300';
  if (value >= 6) return 'text-green-400';
  if (value >= 5) return 'text-[#ddd]';
  if (value >= 3) return 'text-orange-400';
  return 'text-red-400';
}
