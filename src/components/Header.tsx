"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <header className="sticky top-0 z-40 border-b border-[#e4dfd0] bg-[#f4f1ea]/95 backdrop-blur-md shadow-xs">
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
            className="h-9 w-9 sm:h-11 sm:w-11 rounded-full border border-[#e4dfd0] shadow-xs group-hover:scale-105 transition object-cover"
          />
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg sm:text-xl font-black tracking-tight text-[#141414] group-hover:text-[#2754F5] transition">
              {storeName}
            </span>
            <span className="hidden sm:inline-block rounded-md bg-[#141414] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Zapatillas
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2 lg:gap-3 text-xs sm:text-sm font-semibold">
          <Link
            href="/#novedades"
            className="rounded-lg px-2.5 py-1.5 text-[#141414] hover:bg-[#e4dfd0]/70 transition"
          >
            Novedades
          </Link>
          <Link
            href="/#marcas"
            className="rounded-lg px-2.5 py-1.5 text-[#141414] hover:bg-[#e4dfd0]/70 transition"
          >
            Marcas
          </Link>
          <Link
            href="/#catalogo"
            className="rounded-lg px-2.5 py-1.5 text-[#141414] hover:bg-[#e4dfd0]/70 transition"
          >
            Catálogo
          </Link>
          <Link
            href="/marca/promociones"
            className="rounded-full bg-[#2754F5] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1f44c9] transition flex items-center gap-1"
          >
            <span>🔥</span>
            <span>Promos</span>
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
          className="md:hidden fixed inset-x-0 top-14 sm:top-16 z-50 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-black/40 backdrop-blur-xs"
          onClick={() => setMenuOpen(false)}
        >
          <div
            className="border-b border-[#e4dfd0] bg-[#fdfcf9] px-4 py-5 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col space-y-1.5 text-sm font-bold text-[#141414]">
              <Link
                href="/"
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 hover:bg-[#ece8dc] transition"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-base">🏠</span>
                <span>Inicio</span>
              </Link>
              <Link
                href="/#novedades"
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 hover:bg-[#ece8dc] transition"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-base">✨</span>
                <span>Nuevos Modelos</span>
              </Link>
              <Link
                href="/#marcas"
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 hover:bg-[#ece8dc] transition"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-base">🏷️</span>
                <span>Explorar por Marca</span>
              </Link>
              <Link
                href="/#catalogo"
                className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 hover:bg-[#ece8dc] transition"
                onClick={() => setMenuOpen(false)}
              >
                <span className="text-base">👟</span>
                <span>Catálogo Completo</span>
              </Link>
              <Link
                href="/marca/promociones"
                className="flex items-center justify-between rounded-xl bg-[#2754F5]/10 border border-[#2754F5]/30 px-3.5 py-2.5 text-[#2754F5] transition"
                onClick={() => setMenuOpen(false)}
              >
                <div className="flex items-center gap-3 font-extrabold">
                  <span className="text-base">🔥</span>
                  <span>Promociones y Ofertas</span>
                </div>
                <span className="rounded-full bg-[#2754F5] px-2 py-0.5 text-[10px] font-black text-white">
                  OFERTAS
                </span>
              </Link>
            </div>

            {/* Direct Contact Buttons in Mobile Menu */}
            <div className="pt-3 border-t border-[#e4dfd0] flex flex-col gap-2">
              {whatsapp ? (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                    "Hola ZaVaDuv, me interesa ver modelos de zapatillas disponibles."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#1ebe5d] transition w-full"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  <span>Pedir asesoría por WhatsApp</span>
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
