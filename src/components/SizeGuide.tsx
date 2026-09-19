"use client";

import { useState } from "react";

export interface SizeGuideProps {
  selectedEurSize?: string;
  defaultGender?: "hombre" | "mujer" | "unisex";
  compact?: boolean;
}

const MEN_SIZES = [
  { co: "37", us: "7", eur: "40", cm: "25" },
  { co: "38", us: "8", eur: "41", cm: "26" },
  { co: "39/40", us: "8.5/9", eur: "42", cm: "26.5" },
  { co: "41", us: "9.5", eur: "43", cm: "27" },
  { co: "42", us: "10", eur: "44", cm: "28" },
];

const WOMEN_SIZES = [
  { co: "35", us: "5/5.5", eur: "36", cm: "22.5" },
  { co: "36", us: "6", eur: "37", cm: "23.5" },
  { co: "37", us: "6.5/7", eur: "38", cm: "24" },
  { co: "38", us: "7.5/8", eur: "39", cm: "25" },
  { co: "39", us: "8.5", eur: "40", cm: "25.5" },
];

export function SizeGuide({
  selectedEurSize,
  defaultGender = "unisex",
  compact = false,
}: SizeGuideProps) {
  const [activeTab, setActiveTab] = useState<"todos" | "caballeros" | "damas">(
    defaultGender === "mujer"
      ? "damas"
      : defaultGender === "hombre"
      ? "caballeros"
      : "todos"
  );

  const showMen = activeTab === "todos" || activeTab === "caballeros";
  const showWomen = activeTab === "todos" || activeTab === "damas";

  return (
    <div className="w-full rounded-2xl sm:rounded-3xl border border-[#e4dfd0] bg-[#fcfbfa] p-4 sm:p-7 shadow-sm text-[#141414]">
      {/* =========================================================
          HEADER IDENTICAL TO USER REFERENCE
      ========================================================= */}
      <div className="flex flex-col items-center text-center">
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-[#141414] uppercase">
          Guía de Tallas
        </h3>

        {/* Red Badge Pill */}
        <div className="mt-2.5 inline-flex items-center gap-2 rounded-full bg-[#d92534] px-4 py-1 text-white shadow-xs">
          {/* Sneaker Icon */}
          <svg
            className="h-3.5 w-3.5 fill-current"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M21.7 15.3l-2.4-4.8c-.4-.8-1.2-1.3-2.1-1.3H14V7c0-.6-.4-1-1-1H7c-.6 0-1 .4-1 1v2.2L2.5 13.8c-.3.4-.5.9-.5 1.4V19c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-2.3c0-.5-.1-.9-.3-1.4zM4 19v-3.5l3.2-4.3c.2-.3.5-.4.8-.4h4v3.5c0 .8.7 1.5 1.5 1.5h4.7l1.8 3.2H4z" />
          </svg>
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
            Tallas Clientes · ZaVaDuv
          </span>
        </div>

        {/* Red accent line */}
        <div className="mt-3 flex w-full items-center justify-center gap-2">
          <span className="h-[2px] w-12 bg-[#d92534]/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-[#d92534]" />
          <span className="h-[2px] w-12 bg-[#d92534]/30" />
        </div>

        <p className="mt-2.5 max-w-lg text-xs sm:text-sm text-[#6b675f] leading-relaxed">
          En Colombia solemos usar la talla nacional (<strong>CO 🇨🇴</strong>).
          En nuestro catálogo el calzado se despacha en{" "}
          <strong className="text-[#2754F5]">Talla EUR 🇪🇸</strong>. Usa esta
          tabla para identificar tu número exacto.
        </p>
      </div>

      {/* =========================================================
          GENDER TABS
      ========================================================= */}
      <div className="mt-5 flex items-center justify-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("todos")}
          className={`rounded-full px-3 sm:px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
            activeTab === "todos"
              ? "bg-[#141414] text-white shadow-xs"
              : "bg-[#f4f1ea] text-[#6b675f] hover:bg-[#e4dfd0] hover:text-[#141414]"
          }`}
        >
          Ver Todas
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("caballeros")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
            activeTab === "caballeros"
              ? "bg-[#141414] text-white shadow-xs"
              : "bg-[#f4f1ea] text-[#6b675f] hover:bg-[#e4dfd0] hover:text-[#141414]"
          }`}
        >
          <span>👟</span>
          <span>Caballeros</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("damas")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
            activeTab === "damas"
              ? "bg-[#141414] text-white shadow-xs"
              : "bg-[#f4f1ea] text-[#6b675f] hover:bg-[#e4dfd0] hover:text-[#141414]"
          }`}
        >
          <span>👟</span>
          <span>Damas</span>
        </button>
      </div>

      {/* =========================================================
          TABLES CONTAINER
      ========================================================= */}
      <div
        className={`mt-6 grid gap-6 ${
          activeTab === "todos" && !compact
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-1"
        }`}
      >
        {/* ================= CABALLEROS ================= */}
        {showMen && (
          <div className="overflow-hidden rounded-2xl border border-[#e4dfd0] bg-white shadow-xs">
            {/* Section Subheader with Shoe Icon */}
            <div className="flex items-center justify-between border-b border-[#ece7dc] bg-[#faf8f4] px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">👟</span>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#141414]">
                  Tallas para Caballeros
                </span>
              </div>
              <span className="rounded-md bg-[#141414] px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                Hombre
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-[#18181b] text-white font-extrabold">
                    <th className="py-2.5 px-3 tracking-wide">
                      <span className="inline-flex items-center gap-1">
                        CO <span className="text-sm">🇨🇴</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-3 border-l border-white/10 tracking-wide">
                      <span className="inline-flex items-center gap-1">
                        US <span className="text-sm">🇺🇸</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-3 border-l border-white/10 tracking-wide bg-[#2754F5] text-white font-black">
                      <span className="inline-flex items-center gap-1">
                        EUR <span className="text-sm">🇪🇸</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-3 border-l border-white/10 tracking-wide">
                      CM
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ece7dc] font-semibold text-[#141414]">
                  {MEN_SIZES.map((row) => {
                    const isSelected = selectedEurSize === row.eur;
                    return (
                      <tr
                        key={`men-${row.eur}`}
                        className={`transition-colors ${
                          isSelected
                            ? "bg-[#2754F5]/10 font-black ring-2 ring-[#2754F5] ring-inset"
                            : "hover:bg-[#fbf9f5] odd:bg-white even:bg-[#faf8f5]/60"
                        }`}
                      >
                        <td className="py-2.5 px-3 font-bold text-[#141414]">
                          {row.co}
                        </td>
                        <td className="py-2.5 px-3 text-[#4b4843] border-l border-[#ece7dc]">
                          {row.us}
                        </td>
                        <td className="py-2.5 px-3 border-l border-[#ece7dc] font-black text-[#2754F5] bg-[#2754F5]/5">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 ${
                              isSelected
                                ? "bg-[#2754F5] text-white font-black shadow-xs"
                                : ""
                            }`}
                          >
                            {row.eur}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[#141414] border-l border-[#ece7dc] font-bold">
                          {row.cm}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= DAMAS ================= */}
        {showWomen && (
          <div className="overflow-hidden rounded-2xl border border-[#e4dfd0] bg-white shadow-xs">
            {/* Section Subheader with Shoe Icon */}
            <div className="flex items-center justify-between border-b border-[#ece7dc] bg-[#faf8f4] px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg">👟</span>
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#141414]">
                  Tallas para Damas
                </span>
              </div>
              <span className="rounded-md bg-[#d92534] px-2 py-0.5 text-[10px] font-extrabold uppercase text-white">
                Mujer
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-black/10 bg-[#18181b] text-white font-extrabold">
                    <th className="py-2.5 px-3 tracking-wide">
                      <span className="inline-flex items-center gap-1">
                        CO <span className="text-sm">🇨🇴</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-3 border-l border-white/10 tracking-wide">
                      <span className="inline-flex items-center gap-1">
                        US <span className="text-sm">🇺🇸</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-3 border-l border-white/10 tracking-wide bg-[#2754F5] text-white font-black">
                      <span className="inline-flex items-center gap-1">
                        EUR <span className="text-sm">🇪🇸</span>
                      </span>
                    </th>
                    <th className="py-2.5 px-3 border-l border-white/10 tracking-wide">
                      CM
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ece7dc] font-semibold text-[#141414]">
                  {WOMEN_SIZES.map((row) => {
                    const isSelected = selectedEurSize === row.eur;
                    return (
                      <tr
                        key={`women-${row.eur}`}
                        className={`transition-colors ${
                          isSelected
                            ? "bg-[#2754F5]/10 font-black ring-2 ring-[#2754F5] ring-inset"
                            : "hover:bg-[#fbf9f5] odd:bg-white even:bg-[#faf8f5]/60"
                        }`}
                      >
                        <td className="py-2.5 px-3 font-bold text-[#141414]">
                          {row.co}
                        </td>
                        <td className="py-2.5 px-3 text-[#4b4843] border-l border-[#ece7dc]">
                          {row.us}
                        </td>
                        <td className="py-2.5 px-3 border-l border-[#ece7dc] font-black text-[#2754F5] bg-[#2754F5]/5">
                          <span
                            className={`inline-block rounded-md px-2 py-0.5 ${
                              isSelected
                                ? "bg-[#2754F5] text-white font-black shadow-xs"
                                : ""
                            }`}
                          >
                            {row.eur}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[#141414] border-l border-[#ece7dc] font-bold">
                          {row.cm}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
          HELPFUL MEASUREMENT TIP
      ========================================================= */}
      <div className="mt-5 rounded-xl border border-[#e4dfd0] bg-[#faf8f4] p-3.5 sm:p-4 text-xs text-[#524e47] flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#141414] text-base text-white">
          📐
        </div>
        <div className="flex-1 space-y-0.5">
          <p className="font-extrabold text-[#141414]">
            ¿Cómo medir tu pie para no fallar en la talla?
          </p>
          <p className="leading-relaxed">
            Coloca tu pie sobre una hoja pegada a la pared, marca el talón y el
            dedo más largo, y mide la distancia con una regla en centímetros (
            <strong>CM</strong>). Compara los centímetros en la tabla superior.
          </p>
        </div>
      </div>
    </div>
  );
}
