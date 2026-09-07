"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice, Product, whatsappLink } from "@/lib/types";

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
  const [showSizeGuide, setShowSizeGuide] = useState(false);

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
      {/* Size Selector Header */}
      <div>
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#6b675f]">
            Tallas disponibles (EUR)
          </p>
          {selectedSize && (
            <span className="text-xs font-black text-[#2754F5]">
              Seleccionada: Talla {selectedSize} EUR
            </span>
          )}
        </div>

        {/* Size Pills */}
        <div className="mt-2.5 flex flex-wrap gap-2">
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

      {/* EUR Size Notice & Guide Box */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 sm:p-4.5 text-[#78350f]">
        <div className="flex items-start gap-3">
          <div className="shrink-0 text-xl leading-none">⚠️</div>
          <div className="space-y-1.5 text-xs sm:text-sm">
            <p className="font-extrabold text-[#92400e]">
              Importante: Horma en Talla EUR (Europea)
            </p>
            <p className="text-[#854d0e] leading-relaxed">
              Todas las zapatillas de nuestro catálogo se manejan en{" "}
              <strong>Talla EUR</strong>. Te sugerimos revisar la etiqueta
              interior o la lengüeta de unas zapatillas que te queden cómodas y
              confirmar tu número donde dice <strong>EUR</strong> antes de pedir.
            </p>
            <div>
              <button
                type="button"
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="inline-flex items-center gap-1.5 font-black text-[#b45309] hover:text-[#78350f] hover:underline pt-1 cursor-pointer"
              >
                <span>📐 {showSizeGuide ? "Ocultar tabla de tallas" : "Ver tabla de equivalencias (EUR / CM / US)"}</span>
                <span>{showSizeGuide ? "▲" : "▼"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Size Guide Table */}
        {showSizeGuide && (
          <div className="mt-4 border-t border-amber-200/80 pt-4 space-y-4">
            <p className="text-xs text-[#854d0e]">
              💡 <em>¿Cómo saber tu talla exacta?</em> Mide la longitud de tu pie
              desde el talón hasta el dedo más largo en centímetros (CM):
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dama Table */}
              <div className="rounded-xl border border-amber-200 bg-white p-3 shadow-xs">
                <p className="text-xs font-black uppercase tracking-wider text-[#92400e] mb-2">
                  👟 Tallas Dama / Mujer
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-amber-100 text-[#92400e]">
                        <th className="py-1 font-black">EUR</th>
                        <th className="py-1 font-bold">CM</th>
                        <th className="py-1 font-bold">US</th>
                        <th className="py-1 font-bold">COL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-50 text-[#141414]">
                      <tr><td className="py-1 font-black text-[#2754F5]">35</td><td>22.0 cm</td><td>5.0</td><td>34</td></tr>
                      <tr><td className="py-1 font-black text-[#2754F5]">36</td><td>22.5 cm</td><td>5.5</td><td>35</td></tr>
                      <tr><td className="py-1 font-black text-[#2754F5]">37</td><td>23.5 cm</td><td>6.5</td><td>36</td></tr>
                      <tr><td className="py-1 font-black text-[#2754F5]">38</td><td>24.0 cm</td><td>7.0</td><td>37</td></tr>
                      <tr><td className="py-1 font-black text-[#2754F5]">39</td><td>25.0 cm</td><td>8.0</td><td>38</td></tr>
                      <tr><td className="py-1 font-black text-[#2754F5]">40</td><td>25.5 cm</td><td>8.5</td><td>39</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Caballero Table */}
              <div className="rounded-xl border border-amber-200 bg-white p-3 shadow-xs">
                <p className="text-xs font-black uppercase tracking-wider text-[#92400e] mb-2">
                  👟 Tallas Caballero / Hombre
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-amber-100 text-[#92400e]">
                        <th className="py-1 font-black">EUR</th>
                        <th className="py-1 font-bold">CM</th>
                        <th className="py-1 font-bold">US</th>
                        <th className="py-1 font-bold">COL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-50 text-[#141414]">
                      <tr><td className="py-1 font-black text-[#2754F5]">39</td><td>24.5 cm</td><td>6.5</td><td>38</td></tr>
                      <tr><td className="py-1 font-black text-[#2754F5]">40</td><td>25.0 cm</td><td>7.0</td><td>39</td></tr>
                      <tr><td className="py-1 font-black text-[#2754F5]">41</td><td>26.0 cm</td><td>8.0</td><td>40</td></tr>
                      <tr><td className="py-1 font-black text-[#2754F5]">42</td><td>26.5 cm</td><td>8.5</td><td>41</td></tr>
                      <tr><td className="py-1 font-black text-[#2754F5]">43</td><td>27.5 cm</td><td>9.5</td><td>42</td></tr>
                      <tr><td className="py-1 font-black text-[#2754F5]">44</td><td>28.0 cm</td><td>10.0</td><td>43</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
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
