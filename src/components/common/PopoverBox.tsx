import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';

/** Shared popover-anchor component used by the timeline and queens list.
 *
 *  Owns its own open/close state. Renders a trigger (from `renderTrigger`)
 *  plus a popover (from `children`) anchored below the trigger. Click outside
 *  the wrapper closes the popover; clicking the trigger again toggles.
 *
 *  Only one popover stays open at a time because the document-level mousedown
 *  handler on the open box fires *before* the click on another box's trigger. */
export default function PopoverBox({
  renderTrigger,
  children,
  width = 320,
}: {
  renderTrigger: (args: { isOpen: boolean; toggle: () => void }) => ReactNode;
  children: ReactNode | ((args: { close: () => void }) => ReactNode);
  width?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close on click outside the wrapper (button + popover). Using a wrapper-
  // level ref means re-clicking the trigger button goes through the button's
  // onClick (toggle), not through the click-outside handler.
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const toggle = () => setIsOpen((v) => !v);
  const close = () => setIsOpen(false);

  return (
    <div ref={wrapperRef} className="relative">
      {renderTrigger({ isOpen, toggle })}
      {isOpen && (
        <Popover width={width} onClose={close}>
          {typeof children === 'function' ? children({ close }) : children}
        </Popover>
      )}
    </div>
  );
}

/** Absolutely-positioned popover rendered below its anchor. Uses a layout
 *  effect to horizontally clamp its position so it never overflows the
 *  viewport for edge anchors. */
function Popover({
  width,
  onClose,
  children,
}: {
  width: number;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Clamp horizontally so the popover never overflows the viewport. We apply
  // the shift directly via the ref instead of round-tripping through state —
  // the measurement happens once per open, so an extra render is pure waste.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const margin = 8;
    const rect = el.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    let shift = 0;
    if (rect.right > vw - margin) shift = vw - margin - rect.right;
    else if (rect.left < margin) shift = margin - rect.left;
    el.style.transform = `translateX(calc(-50% + ${shift}px))`;
  }, []);

  return (
    <div
      ref={ref}
      className="absolute left-1/2 top-full mt-2 z-50 bg-[#121218] border border-[#2a2a3a] rounded-lg shadow-xl p-4"
      style={{ width, transform: 'translateX(-50%)' }}
    >
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded text-[#666] hover:text-[#ddd] hover:bg-[#1a1a24] transition-colors"
        title="Close"
      >
        ×
      </button>
      {children}
    </div>
  );
}
