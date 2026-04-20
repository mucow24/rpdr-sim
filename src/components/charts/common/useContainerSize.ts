import { useEffect, useRef, useState, type RefObject } from 'react';

/** Track a container's width via ResizeObserver. Below `minWidth` updates are
 *  ignored to avoid d3 thrash during initial mount / hidden layouts. */
export function useContainerWidth(
  initialWidth: number,
  minWidth: number = 100,
): { containerRef: RefObject<HTMLDivElement | null>; width: number } {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w && w > minWidth) setWidth(Math.floor(w));
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [minWidth]);

  return { containerRef, width };
}

/** Track a container's width AND height via ResizeObserver. Both axes have
 *  independent minimum thresholds. */
export function useContainerSize(
  initial: { width: number; height: number },
  min: { width: number; height: number } = { width: 100, height: 50 },
): { containerRef: RefObject<HTMLDivElement | null>; width: number; height: number } {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(initial);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect && rect.width > min.width && rect.height > min.height) {
        setSize({ width: Math.floor(rect.width), height: Math.floor(rect.height) });
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [min.width, min.height]);

  return { containerRef, width: size.width, height: size.height };
}
