"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { GENDER_LABEL, Product } from "@/lib/types";

const BATCH_SIZE = 12;

export function Catalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("todas");
  const [gender, setGender] = useState("todas");
  const [size, setSize] = useState("todas");
  const [color, setColor] = useState("todas");

  const [sortBy, setSortBy] = useState<"recientes" | "precio-asc" | "precio-desc">("recientes");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);

  const brands = useMemo(
    () => Array.from(new Set(products.map((item) => item.brand))).sort(),
    [products]
  );
  const sizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((item) => item.sizes.forEach((value) => set.add(value)));
    return Array.from(set).sort((a, b) => Number(a) - Number(b) || a.localeCompare(b));
  }, [products]);
  const colors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((item) => {
      if (item.color) set.add(item.color);
    });
    return Array.from(set).sort();
  }, [products]);

  const filtered = products
    .filter((item) => {
      const haystack = `${item.brand} ${item.name} ${item.color || ""}`.toLowerCase();
      const matchesQuery = !query.trim() || haystack.includes(query.trim().toLowerCase());
      const matchesBrand = brand === "todas" || item.brand === brand;
      const matchesGender = gender === "todas" || item.gender === gender;
      const matchesSize = size === "todas" || item.sizes.includes(size);
      const matchesColor = color === "todas" || item.color === color;
      return matchesQuery && matchesBrand && matchesGender && matchesSize && matchesColor;
    })
    .sort((a, b) => {
      if (sortBy === "precio-asc") return a.price - b.price;
      if (sortBy === "precio-desc") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // Reset pagination when filters or sort change
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [query, brand, gender, size, color, sortBy]);

  const displayedProducts = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const remainingCount = filtered.length - displayedProducts.length;

  return (
    <div className="w-full">
      {/* Filters Toolbar */}
      <div className="rounded-2xl border border-[#e4dfd0] bg-white p-4 shadow-sm sm:p-5 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar modelo o color..."
            className="w-full rounded-xl border-2 border-[#e4dfd0] bg-[#fdfcf9] px-3.5 py-2.5 text-sm font-semibold text-[#141414] placeholder-[#8c887d] outline-none transition focus:border-[#141414] focus:bg-white"
          />
          <select
            value={brand}
            onChange={(event) => setBrand(event.target.value)}
            className="w-full rounded-xl border-2 border-[#e4dfd0] bg-[#fdfcf9] px-3 py-2.5 text-sm font-semibold text-[#141414] outline-none transition focus:border-[#141414] focus:bg-white"
          >
            <option value="todas">Todas las marcas ({brands.length})</option>
            {brands.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <select
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            className="w-full rounded-xl border-2 border-[#e4dfd0] bg-[#fdfcf9] px-3 py-2.5 text-sm font-semibold text-[#141414] outline-none transition focus:border-[#141414] focus:bg-white"
          >
            <option value="todas">Dama y Caballero</option>
            {Object.entries(GENDER_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            value={size}
            onChange={(event) => setSize(event.target.value)}
            className="w-full rounded-xl border-2 border-[#e4dfd0] bg-[#fdfcf9] px-3 py-2.5 text-sm font-semibold text-[#141414] outline-none transition focus:border-[#141414] focus:bg-white"
          >
            <option value="todas">Todas las tallas (EUR)</option>
            {sizes.map((value) => (
              <option key={value} value={value}>Talla {value} EUR</option>
            ))}
          </select>
          <select
            value={color}
            onChange={(event) => setColor(event.target.value)}
            className="w-full rounded-xl border-2 border-[#e4dfd0] bg-[#fdfcf9] px-3 py-2.5 text-sm font-semibold text-[#141414] outline-none transition focus:border-[#141414] focus:bg-white"
          >
            <option value="todas">Todos los colores ({colors.length})</option>
            {colors.map((value) => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as any)}
            className="w-full rounded-xl border-2 border-[#e4dfd0] bg-[#fdfcf9] px-3 py-2.5 text-sm font-semibold text-[#141414] outline-none transition focus:border-[#141414] focus:bg-white"
          >
            <option value="recientes">Más recientes</option>
            <option value="precio-asc">Precio: Menor a mayor</option>
            <option value="precio-desc">Precio: Mayor a menor</option>
          </select>
        </div>

        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0ede4] pt-3 text-xs text-[#6b675f]">
          <div>
            Mostrando <span className="font-bold text-[#141414]">{displayedProducts.length}</span> de{" "}
            <span className="font-bold text-[#141414]">{filtered.length}</span> zapatillas
            {filtered.length !== products.length && (
              <span className="text-[#8c887d] ml-1">({products.length} en total)</span>
            )}
          </div>
          {(query || brand !== "todas" || gender !== "todas" || size !== "todas" || color !== "todas" || sortBy !== "recientes") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setBrand("todas");
                setGender("todas");
                setSize("todas");
                setColor("todas");
                setSortBy("recientes");
              }}
              className="rounded-full bg-[#2754F5] px-3.5 py-1 text-xs font-bold text-white shadow-xs hover:bg-[#1f44c9] transition cursor-pointer"
            >
              Limpiar filtros ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of Products */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d9d3c2] bg-white p-8 sm:p-12 text-center">
          <p className="text-lg font-bold text-[#141414]">No hay zapatillas con esos filtros</p>
          <p className="mt-1 text-sm text-[#6b675f]">Prueba otra combinación de marca o talla.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Botón Mostrar Más (sólo por clic explícito) */}
          {hasMore && (
            <div className="mt-12 flex flex-col items-center justify-center gap-3">
              {/* Indicador de progreso */}
              <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-[#6b675f]">
                <span>
                  Mostrando <strong className="text-[#141414]">{displayedProducts.length}</strong> de{" "}
                  <strong className="text-[#141414]">{filtered.length}</strong> zapatillas
                </span>
                <span className="h-1 w-1 rounded-full bg-[#8c887d]" />
                <span className="text-[#2754F5]">
                  Quedan {remainingCount} por ver
                </span>
              </div>

              {/* Barra de progreso */}
              <div className="h-1.5 w-52 overflow-hidden rounded-full bg-[#e4dfd0]">
                <div
                  className="h-full bg-[#2754F5] rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.round(
                      (displayedProducts.length / filtered.length) * 100
                    )}%`,
                  }}
                />
              </div>

              {/* Botones de acción */}
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((prev) =>
                      Math.min(prev + BATCH_SIZE, filtered.length)
                    )
                  }
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#141414] px-8 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2754F5] hover:shadow-xl cursor-pointer"
                >
                  <span>Mostrar más zapatillas</span>
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs transition-transform duration-200 group-hover:translate-y-0.5">
                    ↓
                  </span>
                </button>

                {filtered.length > visibleCount + BATCH_SIZE && (
                  <button
                    type="button"
                    onClick={() => setVisibleCount(filtered.length)}
                    className="rounded-full border border-[#e4dfd0] bg-white px-5 py-3 text-xs font-bold text-[#6b675f] shadow-xs hover:border-[#141414] hover:text-[#141414] transition cursor-pointer"
                  >
                    Ver todas ({filtered.length})
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Indicador cuando ya se mostraron todas */}
          {!hasMore && filtered.length > BATCH_SIZE && (
            <div className="mt-12 flex flex-col items-center justify-center gap-2 text-center text-xs text-[#6b675f]">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e4dfd0]/60 px-4 py-1.5 font-bold text-[#141414]">
                ✓ Has visto todos los modelos disponibles ({filtered.length} zapatillas)
              </span>
              <button
                type="button"
                onClick={() => {
                  setVisibleCount(BATCH_SIZE);
                  const elem = document.getElementById("catalogo");
                  if (elem) {
                    elem.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="mt-1 inline-flex items-center gap-1 font-bold text-[#2754F5] hover:underline cursor-pointer"
              >
                <span>↑</span>
                <span>Mostrar menos (volver a {BATCH_SIZE})</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
