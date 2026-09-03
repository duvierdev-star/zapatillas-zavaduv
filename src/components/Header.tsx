import Link from "next/link";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "ZaVaDuv";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "";

export function Header({ admin }: { admin?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#e4dfd0] bg-[#f4f1ea]/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/favicon.png"
            alt="Logo Zapatillas ZaVaDuv"
            className="h-18 w-18 sm:h-20 sm:w-20 rounded-full border border-[#e4dfd0] shadow-xs group-hover:scale-105 transition"
          />
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-[#141414] group-hover:text-[#2754F5] transition">
              {storeName}
            </span>
            <span className="hidden sm:inline-block rounded-md bg-[#141414] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              Zapatillas
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-1.5 sm:gap-3 text-xs sm:text-sm font-semibold">
          <Link
            href="/#novedades"
            className="rounded-lg px-2.5 py-1.5 text-[#141414] hover:bg-[#e4dfd0]/60 transition"
          >
            Nuevos
          </Link>
          <Link
            href="/#marcas"
            className="rounded-lg px-2.5 py-1.5 text-[#141414] hover:bg-[#e4dfd0]/60 transition"
          >
            Marcas
          </Link>
          <Link
            href="/marca/promociones"
            className="rounded-full bg-[#2754F5] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#5676E8] transition"
          >
            🔥Promos🔥
          </Link>
          <Link
            href="/#catalogo"
            className="hidden sm:inline-block rounded-lg px-2.5 py-1.5 text-[#141414] hover:bg-[#e4dfd0]/60 transition"
          >
            Catálogo
          </Link>
          {whatsapp ? (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full bg-[#25D366] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1ebe5d] transition"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
              </svg>
              <span className="hidden sm:inline">WhatsApp</span>
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
      </div>
    </header>
  );
}
