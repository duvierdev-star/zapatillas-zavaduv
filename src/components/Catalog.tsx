"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import { GENDER_LABEL, Product } from "@/lib/types";

export function Catalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("todas");
  const [gender, setGender] = useState("todas");
  const [size, setSize] = useState("todas");
  const [color, setColor] = useState("todas");

  const [sortBy, setSortBy] = useState<"recientes" | "precio-asc" | "precio-desc">("recientes");

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

  return (
    <section id="catalogo" className="mx-auto max-w-6xl px-4 sm:px-5 pb-20">
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#2754F5]">
            Catálogo Completo
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-[#141414]">
            Todos los Modelos Disponibles
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#6b675f]">
          Filtra por tu marca favorita, talla o combina opciones
        </p>
      </div>

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
            Mostrando <span className="font-bold text-[#141414]">{filtered.length}</span> de{" "}
            <span className="font-bold text-[#141414]">{products.length}</span> zapatillas
          </div>
          {(query || brand !== "todas" || gender !== "todas" || size !== "todas" || color !== "todas" || sortBy !== "recientes") && (
            <button
              onClick={() => {
                setQuery("");
                setBrand("todas");
                setGender("todas");
                setSize("todas");
                setColor("todas");
                setSortBy("recientes");
              }}
              className="rounded-full bg-[#2754F5] px-3.5 py-1 text-xs font-bold text-white shadow-xs hover:bg-[#a94a1b] transition"
            >
              Limpiar filtros ✕
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#d9d3c2] bg-white p-8 sm:p-12 text-center">
          <p className="text-lg font-bold text-[#141414]">No hay zapatillas con esos filtros</p>
          <p className="mt-1 text-sm text-[#6b675f]">Prueba otra combinación de marca o talla.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
