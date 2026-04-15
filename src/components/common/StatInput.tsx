import { useEffect, useState } from 'react';

/** Number input that only commits on Enter or blur — avoids re-running the
 *  simulation on every keystroke. Clamps the committed value to [min, max].
 *
 *  Pass `colorScale="skill"` (for 0–10 queen stats) to color-code the text by
 *  value so strengths/weaknesses pop at a glance. Set `gold` to force the
 *  special gold treatment (used for a queen's top stat + maxed-out lip sync). */
export default function StatInput({
  value,
  onCommit,
  min = 0,
  max = 100,
  colorScale,
  gold = false,
  disabled = false,
}: {
  value: number;
  onCommit: (v: number) => void;
  min?: number;
  max?: number;
  colorScale?: 'skill';
  gold?: boolean;
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

  const isSkill = colorScale === 'skill';
  const textCls = gold
    ? 'text-amber-300 font-semibold'
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
    : 'text-[#ddd]';

  const borderCls = gold
    ? 'border border-amber-400/60 shadow-[0_0_6px_rgba(251,191,36,0.45)]'
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
      className={`w-full px-1 py-0.5 bg-[#121218] ${borderCls} rounded text-xs ${textCls} text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0`}
    />
  );
}
