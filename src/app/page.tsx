import { Header } from "@/components/Header";
import { NewArrivalsCover } from "@/components/NewArrivalsCover";
import { BrandGrid } from "@/components/BrandGrid";
import { Catalog } from "@/components/Catalog";
import { isAdmin } from "@/lib/auth";
import { readProducts } from "@/lib/store";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Zapatillas ZaVaDuv";
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "";

export default async function HomePage() {
  const [products, admin] = await Promise.all([readProducts(), isAdmin()]);
  const available = products.filter((item) => item.available).length;

  return (
    <>
      <Header admin={admin} />
      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[#141414]" />
          <div
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage: `url(/zapatillas/131.jpeg)`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="relative mx-auto flex min-h-[65vh] max-w-6xl flex-col justify-end px-5 py-16 text-white">
            <p className="text-[12px] uppercase tracking-[0.28em] text-[#2754F5] font-bold">
              Catálogo Oficial
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
              Zapatillas de marca listas para entrega inmediata.
            </h1>
            <p className="mt-4 max-w-xl text-base text-white/80 sm:text-lg">
              {available} modelos disponibles clasificados por marca (Adidas, Nike, Jordan, Hugo Boss y más), género, color y talla con precios claros.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              <a
                href="#novedades"
                className="rounded-full bg-[#2754F5] px-7 py-3.5 text-center text-sm font-bold text-white shadow-lg hover:bg-[#1a40cf] transition"
              >
                ✨ Ver Nuevos Ingresos
              </a>
              <a
                href="#catalogo"
                className="rounded-full bg-black/40 border-2 border-white/70 px-7 py-3.5 text-center text-sm font-bold text-white shadow-lg backdrop-blur-sm hover:bg-white hover:text-[#141414] transition"
              >
                Ver todo el catálogo
              </a>
              {whatsapp ? (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                    "Hola, quiero consultar por las zapatillas disponibles."
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-center text-sm font-bold text-white shadow-lg hover:bg-[#1ebe5d] transition"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                  <span>Pedir por WhatsApp</span>
                </a>
              ) : null}
            </div>
          </div>
        </section>

        {/* Quick Highlights */}
        <div className="mx-auto grid max-w-6xl gap-4 px-5 py-8 sm:grid-cols-3">
          {[
            ["Novedades Continuas", "Zapatillas recién agregadas al instante"],
            ["Tallas y Colores", "Dama, Caballero y combinaciones exactas"],
            ["Precios de Venta", "Precios finales listos para tus clientes"],
          ].map(([title, copy]) => (
            <div key={title} className="rounded-2xl border border-[#e4dfd0] bg-white px-5 py-4 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2754F5]">{title}</p>
              <p className="mt-1 text-base font-medium text-[#141414]">{copy}</p>
            </div>
          ))}
        </div>

        {/* Cover-style New Arrivals Section */}
        <div className="border-t border-[#e4dfd0] bg-gradient-to-b from-[#eeeae0]/40 to-transparent">
          <NewArrivalsCover products={products} />
        </div>

        {/* Brand Showcase Section */}
        <div className="border-t border-[#e4dfd0]">
          <BrandGrid products={products} />
        </div>

        {/* Global Catalog */}
        <div className="border-t border-[#e4dfd0] pt-10">
          <Catalog products={products} />
        </div>
      </main>
      <footer className="border-t border-[#e4dfd0] px-5 py-8 text-center text-sm text-[#6b675f]">
        {storeName} · Catálogo privado para clientes
      </footer>
    </>
  );
}
