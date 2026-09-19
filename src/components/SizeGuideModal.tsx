"use client";

import { useEffect } from "react";
import { SizeGuide, SizeGuideProps } from "./SizeGuide";

interface SizeGuideModalProps extends SizeGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SizeGuideModal({
  isOpen,
  onClose,
  selectedEurSize,
  defaultGender,
}: SizeGuideModalProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-5 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl no-scrollbar animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar guía de tallas"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-[#141414] text-white shadow-md transition hover:scale-105 hover:bg-black cursor-pointer"
        >
          ✕
        </button>

        <div className="p-2 sm:p-4">
          <SizeGuide
            selectedEurSize={selectedEurSize}
            defaultGender={defaultGender}
          />
        </div>
      </div>
    </div>
  );
}
