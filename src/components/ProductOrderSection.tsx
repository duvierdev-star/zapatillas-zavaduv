"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice, Product, whatsappLink } from "@/lib/types";
import { SizeGuide } from "./SizeGuide";
import { SizeGuideModal } from "./SizeGuideModal";

interface ProductOrderSectionProps {
  product: Product;
  phone: string;
  admin?: boolean;
}

export function ProductOrderSection({
  product,
  phone,
  admin,
}: ProductOrderSectionProps) {
  // Default to first size if available
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ""
  );
  const [showInlineGuide, setShowInlineGuide] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const waUrl =
    phone && product.available
      ? whatsappLink(
          phone,
          product.name,
          product.brand,
          product.price,
          selectedSize
        )
      : "";

  return (
    <div className="mt-6 space-y-6">
      {/* Modal Guía de Tallas */}
      <SizeGuideModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedEurSize={selectedSize}
        defaultGender={product.gender}
      />

      {/* Size Selector Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#6b675f]">
              Tallas disponibles (EUR)
            </p>
            {selectedSize && (
              <span className="rounded-full bg-[#2754F5]/10 px-2.5 py-0.5 text-xs font-black text-[#2754F5]">
                Talla {selectedSize} EUR
              </span>
            )}
          </div>

          {/* Guía de Tallas Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#141414] bg-white px-3 py-1 text-xs font-black text-[#141414] shadow-xs hover:bg-[#141414] hover:text-white transition cursor-pointer"
          >
            <span>📏</span>
            <span>Guía de Tallas</span>
          </button>
        </div>

        {/* Size Pills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`relative min-w-14 rounded-xl border-2 px-4 py-2.5 text-center text-sm font-black transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-[#141414] bg-[#141414] text-white shadow-md scale-105"
                    : "border-[#e4dfd0] bg-[#fdfcf9] text-[#141414] hover:border-[#141414] hover:bg-white"
                }`}
              >
                {size}
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#2754F5] text-[9px] font-black text-white shadow-xs">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* EUR Size Notice & Toggleable Guide */}
      <div className="rounded-2xl border border-[#e4dfd0] bg-white p-4 sm:p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2754F5]/10 text-lg">
            📐
          </div>
          <div className="flex-1 space-y-1.5 text-xs sm:text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-extrabold text-[#141414]">
                ¿No sabes cuál es tu talla exacta?
              </p>
              <button
                type="button"
                onClick={() => setShowInlineGuide(!showInlineGuide)}
                className="inline-flex items-center gap-1 font-bold text-[#2754F5] hover:underline cursor-pointer"
              >
                <span>{showInlineGuide ? "Ocultar tabla" : "Ver tabla de equivalencias"}</span>
                <span>{showInlineGuide ? "▲" : "▼"}</span>
              </button>
            </div>
            <p className="text-[#6b675f] leading-relaxed">
              El calzado se maneja en <strong>Talla EUR</strong>. Si conoces tu número en <strong>Colombia (CO 🇨🇴)</strong> o en centímetros (CM), consulta la guía oficial para pedir con total seguridad.
            </p>
          </div>
        </div>

        {/* Collapsible Inline Guide */}
        {showInlineGuide && (
          <div className="mt-5 border-t border-[#f0ede4] pt-5">
            <SizeGuide
              selectedEurSize={selectedSize}
              defaultGender={product.gender}
              compact
            />
          </div>
        )}
      </div>

      {/* WhatsApp CTA and Actions */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 pt-2">
        {product.available ? (
          <a
            href={waUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 text-center text-sm sm:text-base font-extrabold text-white shadow-lg hover:bg-[#1ebe5d] transition-all w-full transform active:scale-[0.99]"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
            </svg>
            <span>
              {selectedSize
                ? `Pedir en Talla ${selectedSize} EUR por WhatsApp (${formatPrice(product.price)})`
                : `Pedir por WhatsApp (${formatPrice(product.price)})`}
            </span>
          </a>
        ) : (
          <div className="w-full rounded-2xl bg-[#f4f1ea] p-4 text-center text-sm font-bold text-[#6b675f]">
            Este modelo se encuentra agotado actualmente.
          </div>
        )}

        {admin ? (
          <Link
            href={`/admin?editar=${product.id}`}
            className="rounded-full border-2 border-[#141414] px-6 py-3 text-center text-xs font-bold text-[#141414] hover:bg-[#141414] hover:text-white transition w-full sm:w-auto"
          >
            Editar en el panel
          </Link>
        ) : null}
      </div>
    </div>
  );
}
