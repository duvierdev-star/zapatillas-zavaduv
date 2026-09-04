"use client";

import Link from "next/link";
import { slugifyBrand } from "@/lib/types";

interface BrandHeaderNavProps {
  currentBrand: string;
  brands: { name: string; count: number }[];
}

export function BrandHeaderNav({ currentBrand, brands }: { currentBrand: string; brands: { name: string; count: number }[] }) {
  const currentSlug = slugifyBrand(currentBrand);

  return (
    <div className="sticky top-14 sm:top-16 z-30 border-b border-[#e4dfd0] bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-4 py-2.5 sm:px-5 no-scrollbar">
        <Link
          href="/"
          className="shrink-0 rounded-full border border-[#141414] bg-white px-3.5 py-1.5 text-xs font-bold text-[#141414] hover:bg-[#141414] hover:text-white transition shadow-2xs"
        >
          ← Inicio
        </Link>
        <span className="text-[#d0cab9] shrink-0">|</span>
        {brands.map(({ name, count }) => {
          const slug = slugifyBrand(name);
          const isActive = slug === currentSlug;
          const isPromo = name.toLowerCase().includes("promo");

          return (
            <Link
              key={name}
              href={`/marca/${slug}`}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition shadow-2xs ${
                isActive
                  ? "bg-[#141414] text-white ring-2 ring-black"
                  : isPromo
                  ? "bg-[#2754F5] text-white hover:bg-[#a94a1b]"
                  : "bg-[#ece8dc] text-[#141414] border border-[#dcd6c5] hover:bg-[#141414] hover:text-white"
              }`}
            >
              {name} ({count})
            </Link>
          );
        })}
      </div>
    </div>
  );
}
