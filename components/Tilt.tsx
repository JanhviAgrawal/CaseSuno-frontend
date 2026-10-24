"use client";

import React, { useEffect, useRef } from "react";

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  /** Max tilt in degrees */
  max?: number;
  /** Scale while hovered */
  scale?: number;
  glare?: boolean;
}

/**
 * Smooth 3D tilt that follows the mouse. No re-renders (CSS variables + rAF).
 * Automatically disabled on touch devices and for reduced-motion users.
 */
export const Tilt: React.FC<TiltProps> = ({ children, className = "", max = 8, scale = 1.02, glare = true }) => {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => cancelAnimationFrame(frame.current);
  }, []);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!enabled.current || !el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${(0.5 - y) * max * 2}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * max * 2}deg`);
      el.style.setProperty("--gx", `${x * 100}%`);
      el.style.setProperty("--gy", `${y * 100}%`);
      el.style.setProperty("--ts", String(scale));
      el.dataset.active = "true";
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--ts", "1");
    el.dataset.active = "false";
  };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`cs-tilt ${className}`}>
      {children}
      {glare && <span aria-hidden="true" className="cs-tilt-glare" />}
    </div>
  );
};