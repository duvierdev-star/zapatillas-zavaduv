import { Header } from "@/components/Header";
import { NewArrivalsCover } from "@/components/NewArrivalsCover";
import { BrandGrid } from "@/components/BrandGrid";
import { Catalog } from "@/components/Catalog";
import { isAdmin } from "@/lib/auth";
import { readProducts } from "@/lib/store";
import { Footprints } from "lucide-react";

const storeName =
  process.env.NEXT_PUBLIC_STORE_NAME || "Zapatillas ZaVaDuv";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "";

export default async function HomePage() {
  const [products, admin] = await Promise.all([
    readProducts(),
    isAdmin(),
  ]);

  const available = products.filter((item) => item.available).length;

  return (
    <>
      <Header admin={admin} />

      <main>
        {/* =========================================================
      HERO
  ========================================================= */}
        <section className="relative min-h-[72vh] overflow-hidden bg-[#141414]">

          {/* Background image */}
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center"
            style={{
              backgroundImage:
                "url(/zapatillas/adidas-ultraboost-blanco-con-negro-17.jpeg)",
            }}
          />

          {/* Image overlay */}
          <div className="absolute inset-0 bg-[#141414]/55" />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/75 to-[#141414]/25" />

          {/* Bottom gradient */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#141414] to-transparent" />

          {/* Blue glow */}
          <div className="absolute -right-32 top-1/4 h-96 w-96 rounded-full bg-[#2754F5]/20 blur-3xl" />

          {/* Hero content */}
          <div className="relative mx-auto flex min-h-[72vh] max-w-6xl items-center px-5 py-20 sm:px-6 lg:py-24">

            <div className="max-w-4xl">

              {/* Brand badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-md">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#2754F5]" />

                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/80 sm:text-xs">
                  ZaVaDuv · Catálogo Oficial
                </span>
              </div>

              {/* Main title */}
              <h1 className="max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
                Zapatillas que
                <span className="block text-[#6f8cff]">
                  hablan por ti.
                </span>
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8 lg:text-lg">
                Descubre nuestra colección de zapatillas de marca,
                seleccionadas para ofrecerte estilo, comodidad y
                precios claros. Encuentra tu próximo par en
                <strong className="ml-1 font-bold text-white">
                  ZaVaDuv.
                </strong>
              </p>

              {/* Actions */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">

                {/* New arrivals */}
                <a
                  href="#novedades"
                  className="group flex items-center justify-center gap-3 rounded-full border border-[#6f8cff]/30 bg-[#6f8cff] px-7 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#6f8cff]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#141414] hover:shadow-2xl"
                >
                  <Footprints className="h-4 w-4" />
                  <span>Ver nuevos ingresos</span>

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>

                {/* Catalog */}
                <a
                  href="#catalogo"
                  className="group flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[#141414]"
                >
                  Ver catálogo

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>

                {/* WhatsApp */}
                {whatsapp ? (
                  <a
                    href={`https://wa.me/${whatsapp.replace(
                      /\D/g,
                      ""
                    )}?text=${encodeURIComponent(
                      "Hola, quiero consultar por las zapatillas disponibles."
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-center gap-2 rounded-full border border-[#25D366]/30 bg-[#25D366]/15 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-[#25D366] hover:shadow-xl hover:shadow-[#25D366]/20"
                  >
                    <svg
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                    </svg>

                    <span>
                      WhatsApp
                    </span>

                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </a>
                ) : null}
              </div>

              {/* Stats */}
              <div className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">

                {/* Available */}
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2754F5] text-xs font-black text-white">
                    {available}
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                      Catálogo
                    </p>

                    <p className="text-xs font-bold text-white">
                      Modelos disponibles
                    </p>
                  </div>
                </div>

                {/* Brands */}
                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-black text-[#6f8cff]">
                    ✦
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                      Selección
                    </p>

                    <p className="text-xs font-bold text-white">
                      Marcas originales
                    </p>
                  </div>
                </div>

                {/* Delivery */}
                <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md sm:flex">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm font-black text-white">
                    ✓
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-wider text-white/40">
                      Servicio
                    </p>

                    <p className="text-xs font-bold text-white">
                      Entrega inmediata
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <a
            href="#novedades"
            className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 transition hover:text-white sm:flex"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.25em]">
              Explorar
            </span>

            <span className="flex h-8 w-5 items-start justify-center rounded-full border border-white/20 p-1">
              <span className="h-1.5 w-1 rounded-full bg-white/60 animate-bounce" />
            </span>
          </a>
        </section>

        {/* =========================================================
      QUICK HIGHLIGHTS
  ========================================================= */}
        <section className="bg-white py-10">
          <div className="mx-auto grid max-w-6xl gap-5 px-5 sm:grid-cols-3">
            {[
              {
                title: "Novedades continuas",
                copy: "Zapatillas recién agregadas al instante",
                icon: "✦",
              },
              {
                title: "Tallas y colores",
                copy: "Dama, caballero y combinaciones exactas",
                icon: "◈",
              },
              {
                title: "Precios de venta",
                copy: "Precios finales listos para tus clientes",
                icon: "$",
              },
            ].map(({ title, copy, icon }) => (
              <div
                key={title}
                className="group relative overflow-hidden rounded-3xl border border-black/5 bg-[#faf9f7] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#2754F5]/10 transition-transform duration-500 group-hover:scale-150" />

                <div className="relative">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[#2754F5] text-lg font-bold text-white shadow-md transition-transform duration-300 group-hover:scale-110">
                    {icon}
                  </div>

                  <h3 className="text-base font-bold text-[#141414]">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#666]">
                    {copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
      NEW ARRIVALS
  ========================================================= */}
        <section
          id="novedades"
          className="border-t border-black/5 bg-[#faf9f7] py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-5">

            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2754F5]">
                  Recién llegados
                </span>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#141414] sm:text-4xl">
                  Novedades
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                  Descubre los últimos modelos disponibles en
                  ZaVaDuv.
                </p>
              </div>

              <div className="hidden rounded-full border border-black/5 bg-white px-4 py-2 text-xs font-bold text-[#141414] shadow-sm sm:block">
                {available} modelos
              </div>
            </div>

            <NewArrivalsCover products={products} />
          </div>
        </section>

        {/* =========================================================
      BRAND SHOWCASE
  ========================================================= */}
        <section className="border-t border-black/5 bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-5">

            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2754F5]">
                  Explora por marca
                </span>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#141414] sm:text-4xl">
                  Tus marcas favoritas
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                  Encuentra tus zapatillas favoritas organizadas
                  por marca.
                </p>
              </div>

              <div className="hidden h-11 w-11 items-center justify-center rounded-xl bg-[#faf9f7] text-sm font-black text-[#2754F5] sm:flex">
                ✦
              </div>
            </div>

            <BrandGrid products={products} />
          </div>
        </section>

        {/* =========================================================
      GLOBAL CATALOG
  ========================================================= */}
        <section
          id="catalogo"
          className="border-t border-black/5 bg-[#faf9f7] py-16 sm:py-20"
        >
          <div className="mx-auto max-w-6xl px-5">

            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2754F5]">
                  Colección completa
                </span>

                <h2 className="mt-2 text-3xl font-black tracking-tight text-[#141414] sm:text-4xl">
                  Todos los modelos
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                  Explora todo nuestro catálogo y encuentra el
                  modelo perfecto para ti.
                </p>
              </div>

              <div className="hidden rounded-full border border-black/5 bg-white px-4 py-2 text-xs font-bold text-[#141414] shadow-sm sm:block">
                {available} productos
              </div>
            </div>

            <Catalog products={products} />
          </div>
        </section>
      </main>

      {/* =========================================================
    FOOTER
========================================================= */}
      <footer className="border-t border-white/10 bg-[#141414] px-5 py-12">
        <div className="mx-auto max-w-6xl">

          {/* ─────────────── PARTE SUPERIOR ─────────────── */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">

            {/* Marca */}
            <div className="text-center sm:text-left">
              <p className="text-2xl font-black tracking-tight text-white">
                {storeName}
              </p>

              <p className="mt-1 text-sm font-medium text-white/40">
                Variedades de Zapatillas
              </p>

              <p className="mt-3 text-xs leading-relaxed text-white/30">
                Encuentra tu próximo par.
                <span className="ml-1">👟</span>
              </p>
            </div>

            {/* Estado del catálogo */}
            <div className="flex justify-center sm:justify-end">
              <div className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm transition-all duration-300 hover:border-[#6f8cff]/30 hover:bg-[#6f8cff]/10">

                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6f8cff] opacity-50" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#6f8cff]" />
                </span>

                <span className="text-xs font-semibold text-white/60 transition-colors duration-300 group-hover:text-white">
                  Catálogo actualizado
                </span>
              </div>
            </div>
          </div>


          {/* ─────────────── SEPARADOR ─────────────── */}
          <div className="my-9 h-px bg-white/10" />


          {/* ─────────────── ACCESOS RÁPIDOS ─────────────── */}
          <div>
            <p className="mb-4 text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/30 sm:text-left">
              Explora ZaVaDuv
            </p>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

              {/* Nuevos modelos */}
              <a
                href="#novedades"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6f8cff]/40 hover:bg-[#6f8cff] hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">👟</span>

                  <span className="text-xs font-bold text-white/60 transition-colors duration-300 group-hover:text-white">
                    Nuevos modelos
                  </span>
                </div>

                <span className="text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </a>


              {/* Marcas */}
              <a
                href="#marcas"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6f8cff]/40 hover:bg-[#6f8cff] hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🏷️</span>

                  <span className="text-xs font-bold text-white/60 transition-colors duration-300 group-hover:text-white">
                    Marcas
                  </span>
                </div>

                <span className="text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </a>


              {/* Catálogo */}
              <a
                href="#catalogo"
                className="group flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6f8cff]/40 hover:bg-[#6f8cff] hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🛍️</span>

                  <span className="text-xs font-bold text-white/60 transition-colors duration-300 group-hover:text-white">
                    Catálogo
                  </span>
                </div>

                <span className="text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </a>


              {/* Promociones */}
              <a
                href="/marca/promociones"
                className="group flex items-center justify-between rounded-xl border border-[#6f8cff]/20 bg-[#6f8cff]/10 px-4 py-3 text-[#6f8cff] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6f8cff] hover:bg-[#6f8cff] hover:text-white"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-sm">🔥</span>

                  <span className="text-xs font-extrabold">
                    Ofertas
                  </span>
                </div>

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </a>

            </div>
          </div>


          {/* ─────────────── WHATSAPP ─────────────── */}
          {whatsapp ? (
            <div className="mt-5 grid gap-2 sm:grid-cols-2">

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                  "Hola ZaVaDuv, me interesa ver modelos de zapatillas disponibles."
                )}`}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-[#25D366]/20 bg-[#25D366]/10 px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366] hover:bg-[#25D366]"
              >
                <div className="flex items-center gap-3">

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#25D366] text-white transition-transform duration-300 group-hover:scale-105">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"
                      />
                    </svg>
                  </span>

                  <div>
                    <span className="block text-xs font-black text-white">
                      ¿Buscas un modelo?
                    </span>

                    <span className="text-[10px] text-white/40 transition-colors duration-300 group-hover:text-white/80">
                      Escríbenos por WhatsApp
                    </span>
                  </div>
                </div>

                <span className="text-lg text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </a>


              {/* Canal de WhatsApp */}
              <a
                href="https://whatsapp.com/channel/0029VbDmqrc0VycKJydJvb3q"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-[#6f8cff]/20 bg-[#6f8cff]/10 px-4 py-3.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6f8cff] hover:bg-[#6f8cff]"
              >
                <div className="flex items-center gap-3">

                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6f8cff] text-white transition-transform duration-300 group-hover:scale-105">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2z"
                      />
                    </svg>
                  </span>

                  <div>
                    <span className="block text-xs font-black text-white">
                      Sigue nuestro canal
                    </span>

                    <span className="text-[10px] text-white/40 transition-colors duration-300 group-hover:text-white/80">
                      Novedades, modelos y ofertas
                    </span>
                  </div>
                </div>

                <span className="text-lg text-white/40 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </a>

            </div>
          ) : null}

          {/* ─────────────── PARTE INFERIOR ─────────────── */}
          <div className="my-8 h-px bg-white/10" />

          <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">

            <p className="text-[11px] text-white/30">
              {storeName} · Catálogo privado para clientes
            </p>

            <p className="text-[11px] text-white/30">
              © {new Date().getFullYear()} {storeName} · Todos los derechos reservados
            </p>

          </div>

        </div>
      </footer>
    </>
  );
}