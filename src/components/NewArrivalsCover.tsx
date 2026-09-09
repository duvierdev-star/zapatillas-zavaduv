"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { formatPrice, GENDER_LABEL, Product, slugifyBrand, whatsappLink } from "@/lib/types";
import { Footprints } from "lucide-react";

const phone = process.env.NEXT_PUBLIC_WHATSAPP || "";

export function NewArrivalsCover({ products }: { products: Product[] }) {
  // Take top 8 most recent products with images
  const items = useMemo(() => {
    return products.filter((p) => p.images && p.images.length > 0).slice(0, 8);
  }, [products]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const current = items[currentIndex];

  // Auto-play timer
  useEffect(() => {
    if (items.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [items.length, isPaused]);

  if (!items.length || !current) return null;

  const currentImage = current.images[0];
  const brandSlug = slugifyBrand(current.brand);
  const selectedSize = selectedSizes[current.id] || (current.sizes && current.sizes[0]) || "";
  const wa = phone ? whatsappLink(phone, current.name, current.brand, current.price, selectedSize) : "";

  const discount =
    current.compareAtPrice && current.compareAtPrice > current.price
      ? Math.round((1 - current.price / current.compareAtPrice) * 100)
      : 0;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      nextSlide();
    } else if (diff < -40) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  return (
    <section
      id="novedades"
      className="mx-auto max-w-6xl px-4 sm:px-5 py-8 sm:py-12"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header with Title and Slide Counter */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#141414] px-3 py-1 text-[10px] sm:text-xs font-black uppercase tracking-[0.22em] text-white shadow-xs">
            <span className="inline-block h-2 w-2 rounded-full bg-[#2754F5] animate-pulse" />
            Nuevos Ingresos en Catálogo
          </div>
          <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#141414]">
            Últimas Zapatillas Agregadas
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#6b675f] font-medium">
            Modelos recién salidos y disponibles para entrega inmediata
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="text-xs font-black tracking-widest text-[#141414] bg-white border border-[#e4dfd0] px-3 py-1.5 rounded-full shadow-2xs">
            <span className="text-[#2754F5]">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>{" "}
            / {String(items.length).padStart(2, "0")}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={prevSlide}
              aria-label="Zapatilla anterior"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4dfd0] bg-white text-[#141414] shadow-xs hover:border-[#141414] hover:bg-[#141414] hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              aria-label="Siguiente zapatilla"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e4dfd0] bg-white text-[#141414] shadow-xs hover:border-[#141414] hover:bg-[#141414] hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Cover Card */}
      <div className="relative overflow-hidden rounded-3xl border border-[#e4dfd0] bg-white shadow-md transition-all">
        {/* Glow decoration */}
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-[#2754F5]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-[#141414]/5 blur-3xl pointer-events-none" />

        <div className="grid lg:grid-cols-[1.1fr_1fr] items-stretch">
          {/* Left / Info Section */}
          <div className="relative z-10 flex flex-col justify-between p-6 sm:p-8 lg:p-10 order-2 lg:order-1">
            <div>
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/marca/${brandSlug}`}
                  className="rounded-md bg-[#2754F5]/10 border border-[#2754F5]/25 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider text-[#2754F5] hover:bg-[#2754F5] hover:text-white transition"
                >
                  {current.brand}
                </Link>
                <span className="rounded-md bg-[#141414] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  {GENDER_LABEL[current.gender]}
                </span>
                {discount > 0 && (
                  <span className="rounded-md bg-[#25D366] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-2xs">
                    {discount}% OFF
                  </span>
                )}
                {current.color && (
                  <span className="rounded-md bg-[#f4f1ea] border border-[#dcd6c5] px-2.5 py-1 text-[10px] font-bold text-[#141414]">
                    {current.color}
                  </span>
                )}
              </div>

              {/* Title & Brand heading */}
              <h3 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#141414] leading-tight">
                {current.name}
              </h3>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#141414]">
                  {formatPrice(current.price)}
                </span>
                {current.compareAtPrice && current.compareAtPrice > current.price ? (
                  <span className="text-base sm:text-lg text-[#6b675f] line-through font-semibold">
                    {formatPrice(current.compareAtPrice)}
                  </span>
                ) : null}
              </div>

              {/* Available Sizes */}
              {current.sizes && current.sizes.length > 0 && (
                <div className="mt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#6b675f]">
                      Tallas Disponibles (EUR)
                    </p>
                    {selectedSize && (
                      <span className="text-[11px] font-bold text-[#2754F5]">
                        Talla {selectedSize} EUR
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                    {current.sizes.map((s) => {
                      const isSelected = selectedSize === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() =>
                            setSelectedSizes((prev) => ({
                              ...prev,
                              [current.id]: s,
                            }))
                          }
                          className={`rounded-lg border px-3 py-1.5 text-xs font-black transition-all cursor-pointer ${isSelected
                            ? "border-[#141414] bg-[#141414] text-white shadow-xs scale-105"
                            : "border-[#e4dfd0] bg-[#fdfcf9] text-[#141414] hover:border-[#141414] hover:bg-white"
                            }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description excerpt */}
              {current.description && (
                <p className="mt-4 text-xs sm:text-sm text-[#4a473f] line-clamp-2 leading-relaxed">
                  {current.description}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-6 sm:mt-8 pt-5 border-t border-[#f0ede4] flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={`/producto/${current.id}`}
                className="flex items-center justify-center gap-2 rounded-full bg-[#141414] px-6 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-[#2754F5] transition"
              >
                <span>Ver Detalles del Modelo</span>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>

              {wa && current.available ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-xs sm:text-sm font-extrabold text-white shadow-md hover:bg-[#1ebe5d] transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  <span>
                    {selectedSize
                      ? `Pedir en Talla ${selectedSize} EUR por WhatsApp`
                      : "Pedir por WhatsApp"}
                  </span>
                </a>
              ) : null}
            </div>
          </div>

          {/* Right / Cover Photo */}
          <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-auto lg:h-full overflow-hidden bg-[#eeeae0] order-1 lg:order-2">
            {currentImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={current.id}
                src={currentImage}
                alt={`${current.brand} ${current.name}`}
                className="h-full w-full object-cover transition-all duration-700 hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-bold text-[#6b675f]">
                Sin imagen
              </div>
            )}
            {/* Subtle Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:hidden" />
            <div className="absolute top-4 right-4 z-10 animate-[fadeIn_0.4s_ease-out]">
              <span className="flex items-center gap-1 rounded-full bg-white/95 backdrop-blur-md px-3 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#141414] shadow-sm border border-black/10">
                <Footprints className="h-3 w-3 text-[#2754F5]" />
                Portada
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-[#f0ede4]">
          <div
            className="h-full bg-[#2754F5] transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Interactive Cover Deck / Thumbnails Strip */}
      <div className="mt-4 flex gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
        {items.map((item, idx) => {
          const isActive = idx === currentIndex;
          const img = item.images[0];

          return (
            <button
              key={item.id}
              onClick={() => setCurrentIndex(idx)}
              className={`group flex shrink-0 items-center gap-2.5 rounded-2xl border p-2 text-left transition-all duration-300 cursor-pointer ${isActive
                ? "border-[#141414] bg-white shadow-md ring-2 ring-[#141414]"
                : "border-[#e4dfd0] bg-white/70 hover:bg-white hover:border-[#141414] opacity-75 hover:opacity-100"
                }`}
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#eeeae0]">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={img}
                    alt={item.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[9px] text-[#6b675f]">
                    -
                  </div>
                )}
              </div>
              <div className="pr-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-[#2754F5]">
                  {item.brand}
                </p>
                <p className="text-xs font-bold text-[#141414] max-w-[120px] truncate">
                  {item.name}
                </p>
                <p className="text-[11px] font-black text-[#141414]">
                  {formatPrice(item.price)}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
