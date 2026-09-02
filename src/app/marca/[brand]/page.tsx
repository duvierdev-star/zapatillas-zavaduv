import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { BrandHeaderNav } from "@/components/BrandHeaderNav";
import { BrandCatalog } from "@/components/BrandCatalog";
import { isAdmin } from "@/lib/auth";
import { readProducts } from "@/lib/store";
import { slugifyBrand } from "@/lib/types";

const storeName = process.env.NEXT_PUBLIC_STORE_NAME || "Zapatillas ZaVaDuv";
const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP || "";

export async function generateStaticParams() {
  const products = await readProducts();
  const brands = Array.from(new Set(products.map((p) => slugifyBrand(p.brand))));
  return brands.map((brand) => ({ brand }));
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brand: string }>;
}) {
  const { brand: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug).toLowerCase();

  const [products, admin] = await Promise.all([readProducts(), isAdmin()]);

  // Find all products that match this brand slug
  const brandProducts = products.filter((p) => slugifyBrand(p.brand) === slug);

  if (brandProducts.length === 0) {
    notFound();
  }

  // Get actual brand display name
  const brandName = brandProducts[0]?.brand || slug;

  // Build brand list for switcher nav
  const brandsMap = new Map<string, number>();
  products.forEach((p) => {
    brandsMap.set(p.brand, (brandsMap.get(p.brand) || 0) + 1);
  });

  const allBrands = Array.from(brandsMap.entries()).map(([name, count]) => ({
    name,
    count,
  }));

  const isPromo = brandName.toLowerCase().includes("promo");

  return (
    <>
      <Header admin={admin} />
      <BrandHeaderNav currentBrand={brandName} brands={allBrands} />

      <main className="mx-auto max-w-6xl px-5 py-8">
        {/* Brand Banner */}
        <div className="mb-6 sm:mb-8 rounded-3xl border border-[#e4dfd0] bg-white p-5 sm:p-8 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Link
                  href="/#marcas"
                  className="rounded-md bg-[#f4f1ea] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#141414] hover:bg-[#e4dfd0] transition"
                >
                  ← Todas las Marcas
                </Link>
                <span className="text-xs text-[#6b675f]">/</span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#2754F5]">
                  {brandName}
                </span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#141414]">
                {isPromo ? "🔥 Promociones y Ofertas Especiales" : `Colección ${brandName}`}
              </h1>
              <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-[#6b675f] font-medium">
                <strong className="text-[#141414]">{brandProducts.length}</strong> {brandProducts.length === 1 ? "modelo disponible" : "modelos disponibles"} en catálogo listos para envío inmediato con precios actualizados.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {whatsapp ? (
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hola, estoy interesado en ver los modelos de ${brandName}.`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-[#1ebe5d] transition w-full sm:w-auto"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/>
                  </svg>
                  <span>Pedir {brandName} por WhatsApp</span>
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Brand Catalog with Filters */}
        <BrandCatalog products={brandProducts} brandName={brandName} />
      </main>

      <footer className="mt-16 border-t border-[#e4dfd0] bg-white px-5 py-8 text-center text-sm text-[#6b675f]">
        {storeName} · Catálogo de {brandName}
      </footer>
    </>
  );
}
