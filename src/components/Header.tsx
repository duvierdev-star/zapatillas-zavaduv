"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Footprints } from "lucide-react";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "ZaVaDuv";
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "";

export function Header({ admin }: { admin?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-[#e4dfd0] bg-[#f4f1ea]/90 backdrop-blur-lg shadow-[0_2px_20px_-8px_rgba(20,20,20,0.08)]">
      <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-3.5 sm:px-5">
        {/* Logo & Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
          onClick={() => setMenuOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/favicon.png"
            alt="Logo Zapatillas ZaVaDuv"
            className="h-11 w-11 sm:h-14 sm:w-14 rounded-full border border-[#e4dfd0] shadow-xs group-hover:scale-105 transition object-cover"
          />
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-black tracking-tight text-[#141414] group-hover:text-[#2754F5] transition">
              {storeName}
            </span>
            <span className="hidden sm:flex items-center gap-1 rounded-md bg-[#141414] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#25D366] animate-pulse" />
              Zapatillas
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3 text-xs sm:text-sm font-semibold">
          <Link
            href="/#novedades"
            className="relative px-1.5 lg:px-2.5 py-1.5 text-[#141414] transition after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-0.5 after:scale-x-0 after:bg-[#2754F5] after:transition-transform hover:after:scale-x-100"
          >
            Novedades
          </Link>
          <Link
            href="/#marcas"
            className="relative px-1.5 lg:px-2.5 py-1.5 text-[#141414] transition after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-0.5 after:scale-x-0 after:bg-[#2754F5] after:transition-transform hover:after:scale-x-100"
          >
            Marcas
          </Link>
          <Link
            href="/#catalogo"
            className="relative px-1.5 lg:px-2.5 py-1.5 text-[#141414] transition after:absolute after:bottom-0 after:left-1.5 after:right-1.5 after:h-0.5 after:scale-x-0 after:bg-[#2754F5] after:transition-transform hover:after:scale-x-100"
          >
            Catálogo
          </Link>
          <Link
            href="/marca/promociones"
            className="group inline-flex items-center gap-2 rounded-full border border-[#2754F5]/15 bg-[#f4f1ea] px-4 py-2 text-xs font-black text-[#141414] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2754F5] hover:text-white hover:shadow-md"
          >
            <span className="transition-transform duration-300 group-hover:scale-110">
              🔥
            </span>
            <span>Promos</span>
            <span className="text-[#2754F5] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white">
              →
            </span>
          </Link>
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1ebe5d] transition"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
              <span>WhatsApp</span>
            </a>
          ) : null}
          {admin ? (
            <Link
              href="/admin"
              className="rounded-full bg-[#141414] px-3 py-1.5 text-xs font-bold text-white hover:bg-black transition"
            >
              Panel
            </Link>
          ) : null}
        </nav>

        {/* Mobile Actions: Promos + WhatsApp + Hamburger Menu */}
        <div className="flex md:hidden items-center gap-1.5">
          <Link
            href="/marca/promociones"
            className="rounded-full bg-[#2754F5] px-2.5 py-1 text-[11px] font-bold text-white shadow-xs hover:bg-[#1f44c9] transition flex items-center gap-0.5"
            onClick={() => setMenuOpen(false)}
          >
            <span>🔥</span>
            <span>Promos</span>
          </Link>

          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Contactar por WhatsApp"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs hover:bg-[#1ebe5d] transition"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
              </svg>
            </a>
          ) : null}

          {/* Hamburger / Close Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e4dfd0] bg-white text-[#141414] hover:bg-[#e4dfd0]/60 transition shadow-2xs"
          >
            {menuOpen ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation Menu */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 top-14 sm:top-16 z-50 bg-[#141414]/35 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="mx-3 mt-3 overflow-hidden rounded-2xl border border-[#e4dfd0] bg-[#fdfcf9] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del menú */}
            <div className="flex items-center justify-between border-b border-[#e4dfd0] px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#6f8cff]">
                  ZaVaDuv
                </p>
                <h2 className="text-base font-black text-[#141414]">
                  Explora nuestra tienda
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f1ea] text-[#141414] transition-all duration-300 hover:bg-[#6f8cff] hover:text-white"
                aria-label="Cerrar menú"
              >
                ×
              </button>
            </div>

            {/* Opciones principales */}
            <nav className="p-3">
              <div className="flex flex-col gap-1.5">

                {/* Inicio */}
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#6f8cff] hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f4f1ea] text-base transition-all duration-300 group-hover:bg-white/20">
                    🏠
                  </span>

                  <span className="flex-1 font-bold">
                    Inicio
                  </span>

                  <span className="text-lg opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </Link>

                {/* Nuevos Modelos */}
                <Link
                  href="/#novedades"
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#6f8cff] hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f4f1ea] transition-all duration-300 group-hover:bg-white/20">
                    <Footprints className="h-4 w-4" />
                  </span>

                  <span className="flex-1 font-bold">
                    Nuevos Modelos
                  </span>

                  <span className="text-lg opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </Link>

                {/* Explorar por Marca */}
                <Link
                  href="/#marcas"
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#6f8cff] hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f4f1ea] text-base transition-all duration-300 group-hover:bg-white/20">
                    🏷️
                  </span>

                  <span className="flex-1 font-bold">
                    Explorar por Marca
                  </span>

                  <span className="text-lg opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </Link>

                {/* Catálogo */}
                <Link
                  href="/#catalogo"
                  onClick={() => setMenuOpen(false)}
                  className="group flex items-center gap-3 rounded-xl px-3.5 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#6f8cff] hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#f4f1ea] text-base transition-all duration-300 group-hover:bg-white/20">
                    👟
                  </span>

                  <span className="flex-1 font-bold">
                    Catálogo Completo
                  </span>

                  <span className="text-lg opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                    →
                  </span>
                </Link>

                {/* Promociones */}
                <Link
                  href="/marca/promociones"
                  onClick={() => setMenuOpen(false)}
                  className="group mt-1 flex items-center gap-3 rounded-xl border border-[#6f8cff]/25 bg-[#6f8cff]/10 px-3.5 py-3 text-[#2754F5] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#6f8cff] hover:bg-[#6f8cff] hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#6f8cff]/15 text-base transition-all duration-300 group-hover:bg-white/20">
                    🔥
                  </span>

                  <div className="flex-1">
                    <span className="block font-extrabold">
                      Promociones y Ofertas
                    </span>

                    <span className="text-[10px] font-medium opacity-70">
                      Aprovecha nuestros precios especiales
                    </span>
                  </div>

                  <span className="rounded-full bg-[#6f8cff] px-2.5 py-1 text-[9px] font-black text-white transition-all duration-300 group-hover:bg-white group-hover:text-[#6f8cff]">
                    OFERTAS
                  </span>
                </Link>
              </div>
            </nav>

            {/* Contacto */}
            <div className="border-t border-[#e4dfd0] bg-[#faf9f5] p-3">
              {whatsapp ? (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                    "Hola ZaVaDuv, me interesa ver modelos de zapatillas disponibles."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1ebe5d] hover:shadow-xl"
                >
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"
                    />
                  </svg>

                  <span>Pedir asesoría por WhatsApp</span>

                  <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </a>
              ) : null}
              {admin ? (
                <Link
                  href="/admin"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#141414] px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-black transition w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  <span>⚙️</span>
                  <span>Panel de Administración</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
