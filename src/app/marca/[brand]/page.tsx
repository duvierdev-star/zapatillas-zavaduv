import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { BrandHeaderNav } from "@/components/BrandHeaderNav";
import { BrandCatalog } from "@/components/BrandCatalog";
import { isAdmin } from "@/lib/auth";
import { readProducts } from "@/lib/store";
import { slugifyBrand } from "@/lib/types";

const storeName =
  process.env.NEXT_PUBLIC_STORE_NAME || "Zapatillas ZaVaDuv";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "";

export async function generateStaticParams() {
  const products = await readProducts();

  const brands = Array.from(
    new Set(products.map((p) => slugifyBrand(p.brand)))
  );

  return brands.map((brand) => ({ brand }));
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: rawSlug } = await params;

  const slug = decodeURIComponent(rawSlug).toLowerCase();

  const [products, admin] = await Promise.all([
    readProducts(),
    isAdmin(),
  ]);

  // Find all products belonging to this brand
  const brandProducts = products.filter(
    (p) => slugifyBrand(p.brand) === slug
  );

  if (brandProducts.length === 0) {
    notFound();
  }

  // Real brand display name
  const brandName = brandProducts[0]?.brand || slug;

  // Build brand switcher
  const brandsMap = new Map<string, number>();

  products.forEach((p) => {
    brandsMap.set(
      p.brand,
      (brandsMap.get(p.brand) || 0) + 1
    );
  });

  const allBrands = Array.from(brandsMap.entries()).map(
    ([name, count]) => ({
      name,
      count,
    })
  );

  const isPromo = brandName.toLowerCase().includes("promo");

  return (
    <>
      {/* =========================================================
          HEADER
      ========================================================= */}
      <Header admin={admin} />

      {/* Brand Navigation */}
      <BrandHeaderNav
        currentBrand={brandName}
        brands={allBrands}
      />

      <main className="bg-[#faf9f7]">
        {/* =======================================================
            BRAND HERO / HEADER
        ======================================================= */}
        <section className="px-5 pb-4 pt-6 sm:pb-6 sm:pt-8">
          <div className="mx-auto max-w-6xl">
            <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8 lg:p-10">

              {/* Decorative background */}
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#2754F5]/5" />

              <div className="absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-[#2754F5]/5" />

              {/* Content */}
              <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

                {/* Left */}
                <div className="max-w-3xl">

                  {/* Breadcrumb */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href="/#marcas"
                      className="rounded-full bg-[#f4f1ea] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#141414] transition hover:bg-[#141414] hover:text-white"
                    >
                      ← Todas las marcas
                    </Link>

                    <span className="text-xs text-[#b0aca4]">
                      /
                    </span>

                    <span className="rounded-full bg-[#2754F5]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#2754F5]">
                      {brandName}
                    </span>
                  </div>

                  {/* Label */}
                  <div className="mt-6">
                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#2754F5]">
                      {isPromo
                        ? "Ofertas especiales"
                        : "Colección destacada"}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="mt-2 text-3xl font-black tracking-tight text-[#141414] sm:text-5xl lg:text-6xl">
                    {isPromo
                      ? "🔥 Promociones y ofertas"
                      : `Colección ${brandName}`}
                  </h1>

                  {/* Description */}
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-[#6b675f] sm:text-base">
                    Descubre nuestra selección de{" "}
                    <strong className="font-bold text-[#141414]">
                      {brandName}
                    </strong>
                    . Encuentra modelos disponibles en
                    diferentes tallas y colores con precios
                    actualizados.
                  </p>

                  {/* Stats */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {/* Models */}
                    <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-[#faf9f7] px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2754F5] text-sm font-black text-white">
                        {brandProducts.length}
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#999]">
                          Disponibles
                        </p>

                        <p className="text-sm font-bold text-[#141414]">
                          {brandProducts.length === 1
                            ? "Modelo"
                            : "Modelos"}
                        </p>
                      </div>
                    </div>

                    {/* Brand */}
                    <div className="flex items-center gap-3 rounded-2xl border border-black/5 bg-[#faf9f7] px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-black text-[#2754F5] shadow-sm">
                        ✦
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#999]">
                          Marca
                        </p>

                        <p className="text-sm font-bold text-[#141414]">
                          {brandName}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right */}
                {whatsapp ? (
                  <div className="shrink-0 lg:pl-8">
                    <a
                      href={`https://wa.me/${whatsapp.replace(
                        /\D/g,
                        ""
                      )}?text=${encodeURIComponent(
                        `Hola, estoy interesado en ver los modelos de ${brandName}.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#25D366]/20 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1ebe5d] hover:shadow-xl sm:w-auto"
                    >
                      <svg
                        className="h-5 w-5 fill-current"
                        viewBox="0 0 24 24"
                      >
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                      </svg>

                      <span>
                        Pedir {brandName} por WhatsApp
                      </span>

                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </section>

        {/* =======================================================
            CATALOG
        ======================================================= */}
        <section className="px-5 py-10 sm:py-14">
          <div className="mx-auto max-w-6xl">

            {/* Catalog heading */}
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#2754F5]">
                  Explora la colección
                </span>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#141414] sm:text-3xl">
                  Modelos {brandName}
                </h2>

                <p className="mt-2 text-sm text-[#777]">
                  Filtra y encuentra exactamente lo que buscas.
                </p>
              </div>

              {/* Desktop count */}
              <div className="hidden rounded-full border border-black/5 bg-white px-4 py-2 text-xs font-bold text-[#141414] shadow-sm sm:block">
                {brandProducts.length}{" "}
                {brandProducts.length === 1
                  ? "modelo"
                  : "modelos"}
              </div>
            </div>

            <BrandCatalog
              products={brandProducts}
              brandName={brandName}
            />
          </div>
        </section>
      </main>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-white/10 bg-[#141414] px-5 py-10">
        <div className="mx-auto max-w-6xl">

          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">

            {/* Brand */}
            <div className="text-center sm:text-left">
              <p className="text-lg font-black tracking-tight text-white">
                {storeName}
              </p>

              <p className="mt-1 text-xs text-white/40">
                Colección {brandName}
              </p>
            </div>

            {/* Back */}
            <Link
              href="/#marcas"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-white/60 transition hover:bg-white hover:text-[#141414]"
            >
              ← Ver todas las marcas
            </Link>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-white/10" />

          {/* Bottom */}
          <div className="flex flex-col items-center justify-between gap-2 text-xs text-white/30 sm:flex-row">
            <p>
              {storeName} · Catálogo de {brandName}
            </p>

            <p>
              © {new Date().getFullYear()} Todos los derechos
              reservados
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}