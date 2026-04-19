import { useEffect, useState } from 'react';

/** Number input that only commits on Enter or blur — avoids re-running the
 *  simulation on every keystroke. Clamps the committed value to [min, max].
 *
 *  Pass `colorScale="skill"` (for 0–10 queen stats) to color-code the text by
 *  value so strengths/weaknesses pop at a glance. Set `gold` (alias for
 *  `medal="gold"`) to force the special gold treatment (used for a queen's top
 *  stat + maxed-out lip sync). `medal="silver"` / `medal="bronze"` apply the
 *  same effect in silver/bronze hues for 2nd/3rd-place stats. `dim` knocks the
 *  text two brightness notches darker (used for zero-weight stats). */
export default function StatInput({
  value,
  onCommit,
  min = 0,
  max = 100,
  colorScale,
  gold = false,
  medal,
  dim = false,
  disabled = false,
}: {
  value: number;
  onCommit: (v: number) => void;
  min?: number;
  max?: number;
  colorScale?: 'skill';
  gold?: boolean;
  medal?: 'gold' | 'silver' | 'copper' | 'pewter';
  dim?: boolean;
  disabled?: boolean;
}) {
  const [local, setLocal] = useState(String(value));

  // Sync local when the external value changes (e.g. an adjacent input's
  // commit re-renders us, or the owning object is swapped out).
  useEffect(() => setLocal(String(value)), [value]);

  const commit = () => {
    const v = parseInt(local, 10);
    const clean = Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : min;
    setLocal(String(clean));
    onCommit(clean);
  };

  // Color the displayed value based on its effective (clamped) magnitude.
  const parsed = parseInt(local, 10);
  const effective = Number.isFinite(parsed)
    ? Math.min(max, Math.max(min, parsed))
    : value;

  const effectiveMedal: 'gold' | 'silver' | 'copper' | 'pewter' | undefined =
    medal ?? (gold ? 'gold' : undefined);

  const isSkill = colorScale === 'skill';
  const textCls =
    effectiveMedal === 'gold'
      ? 'text-amber-300 font-semibold'
      : effectiveMedal === 'silver'
      ? 'text-slate-200 font-semibold'
      : effectiveMedal === 'copper'
      ? 'text-amber-600'
      : effectiveMedal === 'pewter'
      ? 'text-[#ddd]'
      : isSkill
      ? effective >= 9
        ? 'text-sky-300'
        : effective >= 7
        ? 'text-green-400'
        : effective >= 5
        ? 'text-[#ddd]'
        : effective >= 3
        ? 'text-orange-400'
        : 'text-red-400'
      : dim
      ? 'text-[#555]'
      : 'text-[#ddd]';

  const borderCls =
    effectiveMedal === 'gold'
      ? 'border border-amber-400/60 shadow-[0_0_6px_rgba(251,191,36,0.45)]'
      : effectiveMedal === 'silver'
      ? 'border border-slate-300/60 shadow-[0_0_6px_rgba(203,213,225,0.40)]'
      : effectiveMedal === 'copper'
      ? 'border border-amber-700/40 shadow-[0_0_4px_rgba(180,83,9,0.30)]'
      : effectiveMedal === 'pewter'
      ? 'border border-slate-500/40 shadow-[0_0_4px_rgba(148,163,184,0.28)]'
      : 'border border-[#2a2a3a] focus:border-amber-500/50';

  if (disabled) {
    return (
      <input
        type="text"
        value="--"
        disabled
        className="w-full px-1 py-0.5 bg-[#121218] border border-[#2a2a3a] rounded text-xs text-[#444] text-center focus:outline-none cursor-not-allowed"
      />
    );
  }

  return (
    <input
      type="number"
      min={min}
      max={max}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
      }}
      // Prevent the scroll wheel from silently mutating values when the
      // input happens to be focused while the page is scrolled.
      onWheel={(e) => (e.target as HTMLInputElement).blur()}
      className={`w-full px-1 py-0.5 bg-[#121218] ${borderCls} rounded text-xs ${textCls} text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0`}
    />
  );
}
