"use client";

import React, { useEffect, useRef } from "react";

// Stack so that Escape only closes the top-most modal
const modalStack: number[] = [];
let modalCounter = 0;

interface ModalShellProps {
  onClose: () => void;
  children: React.ReactNode;
  maxWidthClass?: string;
  maxHeightClass?: string;
  panelClassName?: string;
  zIndexClass?: string;
  ariaLabel?: string;
}

export const ModalShell: React.FC<ModalShellProps> = ({
  onClose,
  children,
  maxWidthClass = "max-w-2xl",
  maxHeightClass = "max-h-[90vh]",
  panelClassName = "bg-[#FAF9F6]",
  zIndexClass = "z-50",
  ariaLabel,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const id = ++modalCounter;
    modalStack.push(id);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const prevFocus = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && modalStack[modalStack.length - 1] === id) {
        onCloseRef.current();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      const idx = modalStack.indexOf(id);
      if (idx !== -1) modalStack.splice(idx, 1);
      if (modalStack.length === 0) document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, []);

  return (
    <div
      className={`cs-backdrop fixed inset-0 ${zIndexClass} flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs`}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={`cs-modal-panel relative w-full ${maxWidthClass} ${maxHeightClass} ${panelClassName} border border-[#DDD6C8] rounded-md shadow-2xl overflow-hidden flex flex-col outline-none`}
      >
        {children}
      </div>
    </div>
  );
};

/** Reusable animated close (X) button for modal headers */
export const ModalCloseButton: React.FC<{
  onClick: () => void;
  className?: string;
}> = ({ onClick, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Close dialog"
    className={`p-1.5 rounded-full text-[#6B655B] hover:text-black hover:bg-[#F2EFE9] hover:rotate-90 active:scale-90 transition-all duration-200 cursor-pointer ${className}`}
  >
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  </button>
);