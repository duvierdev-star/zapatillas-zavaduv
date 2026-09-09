"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";
import { GENDER_LABEL, Product } from "@/lib/types";

const BATCH_SIZE = 24;

interface BrandCatalogProps {
  products: Product[];
  brandName: string;
}

export function BrandCatalog({ products, brandName }: BrandCatalogProps) {
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState("todas");
  const [size, setSize] = useState("todas");
  const [color, setColor] = useState("todas");
  const [sortBy, setSortBy] = useState<"recientes" | "precio-asc" | "precio-desc">("recientes");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Available filter options for this brand
  const sizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((item) => item.sizes?.forEach((value) => set.add(value)));
    return Array.from(set).sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
  }, [products]);

  const colors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((item) => {
      if (item.color) set.add(item.color);
    });
    return Array.from(set).sort();
  }, [products]);

  const gendersAvailable = useMemo(() => {
    const set = new Set<string>();
    products.forEach((item) => set.add(item.gender));
    return Array.from(set);
  }, [products]);

  // Filter products
  const filtered = useMemo(() => {
    return products
      .filter((item) => {
        const haystack = `${item.name} ${item.color || ""} ${item.description || ""}`.toLowerCase();
        const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
        const matchesGender = gender === "todas" || item.gender === gender;
        const matchesSize = size === "todas" || item.sizes.includes(size);
        const matchesColor = color === "todas" || item.color === color;
        return matchesQuery && matchesGender && matchesSize && matchesColor;
      })
      .sort((a, b) => {
        if (sortBy === "precio-asc") return a.price - b.price;
        if (sortBy === "precio-desc") return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, query, gender, size, color, sortBy]);

  // Reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [query, gender, size, color, sortBy]);

  // Observer for automatic infinite scroll
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length));
        }
      },
      { rootMargin: "350px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filtered.length]);

  const displayedProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const hasActiveFilters = query || gender !== "todas" || size !== "todas" || color !== "todas" || sortBy !== "recientes";

  const clearFilters = () => {
    setQuery("");
    setGender("todas");
    setSize("todas");
    setColor("todas");
    setSortBy("recientes");
  };

  return (
    <div className="space-y-6">
      {/* Filters Toolbar */}
      <div className="rounded-2xl border border-[#e4dfd0] bg-white p-4 shadow-sm sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {/* Search */}
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Buscar en ${brandName}...`}
              className="w-full rounded-xl border-2 border-[#e4dfd0] bg-[#fdfcf9] px-3.5 py-2.5 text-sm font-semibold text-[#141414] placeholder-[#8c887d] outline-none transition focus:border-[#141414] focus:bg-white"
            />
          </div>

          {/* Gender */}
          <div>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full rounded-xl border-2 border-[#e4dfd0] bg-[#fdfcf9] px-3 py-2.5 text-sm font-semibold text-[#141414] outline-none transition focus:border-[#141414] focus:bg-white"
            >
              <option value="todas">Género: Todos</option>
              {gendersAvailable.map((g) => (
                <option key={g} value={g}>
                  {GENDER_LABEL[g as keyof typeof GENDER_LABEL] || g}
                </option>
              ))}
            </select>
          </div>

          {/* Sizes */}
          <div>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="w-full rounded-xl border-2 border-[#e4dfd0] bg-[#fdfcf9] px-3 py-2.5 text-sm font-semibold text-[#141414] outline-none transition focus:border-[#141414] focus:bg-white"
            >
              <option value="todas">Talla: Todas (EUR)</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  Talla {s} EUR
                </option>
              ))}
            </select>
          </div>

          {/* Colors */}
          {colors.length > 0 ? (
            <div>
              <select
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full rounded-xl border-2 border-[#e4dfd0] bg-[#fdfcf9] px-3 py-2.5 text-sm font-semibold text-[#141414] outline-none transition focus:border-[#141414] focus:bg-white"
              >
                <option value="todas">Color: Todos</option>
                {colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="hidden lg:block" />
          )}

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full rounded-xl border-2 border-[#e4dfd0] bg-[#fdfcf9] px-3 py-2.5 text-sm font-semibold text-[#141414] outline-none transition focus:border-[#141414] focus:bg-white"
            >
              <option value="recientes">Más recientes</option>
              <option value="precio-asc">Precio: Menor a mayor</option>
              <option value="precio-desc">Precio: Mayor a menor</option>
            </select>
          </div>
        </div>

        {/* Status & clear filters bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0ede4] pt-3 text-xs text-[#6b675f]">
          <div>
            Mostrando <span className="font-bold text-[#141414]">{displayedProducts.length}</span> de{" "}
            <span className="font-bold text-[#141414]">{filtered.length}</span> modelos
            {filtered.length !== products.length && (
              <span className="text-[#8c887d] ml-1">({products.length} en total)</span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="rounded-full bg-[#2754F5] px-3.5 py-1 text-xs font-bold text-white shadow-xs hover:bg-[#a94a1b] transition"
            >
              Limpiar filtros ✕
            </button>
          )}
        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d9d3c2] bg-white p-8 sm:p-12 text-center">
          <p className="text-lg font-bold text-[#141414]">No hay zapatillas con esos filtros</p>
          <p className="mt-1 text-sm text-[#6b675f]">
            Prueba cambiando la talla, el género o limpiando los filtros de búsqueda.
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 rounded-full bg-[#141414] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-black transition"
          >
            Ver todos los modelos de {brandName}
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {hasMore && (
            <div
              ref={loadMoreRef}
              className="mt-10 flex flex-col items-center justify-center gap-3"
            >
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length))}
                className="rounded-full border border-[#141414] bg-white px-7 py-3 text-xs sm:text-sm font-bold text-[#141414] shadow-xs hover:bg-[#141414] hover:text-white transition cursor-pointer flex items-center gap-2"
              >
                <span>Cargar más zapatillas</span>
                <span className="rounded-full bg-[#f0ede4] px-2 py-0.5 text-[10px] font-extrabold text-[#141414]">
                  {displayedProducts.length} / {filtered.length}
                </span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
