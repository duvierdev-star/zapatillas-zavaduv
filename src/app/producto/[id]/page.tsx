import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { isAdmin } from "@/lib/auth";
import { getProduct, readProducts } from "@/lib/store";
import { CONDITION_LABEL, GENDER_LABEL, formatPrice, slugifyBrand } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductOrderSection } from "@/components/ProductOrderSection";

const phone = process.env.NEXT_PUBLIC_WHATSAPP || "";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, admin, all] = await Promise.all([getProduct(id), isAdmin(), readProducts()]);
  if (!product) notFound();

  const brandSlug = slugifyBrand(product.brand);
  const related = all.filter((item) => item.id !== product.id && item.brand === product.brand).slice(0, 3);

  return (
    <>
      <Header admin={admin} />
      <main className="mx-auto max-w-6xl px-4 sm:px-5 py-6 sm:py-10">
        {/* Breadcrumb navigation */}
        <nav className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#6b675f]">
          <Link
            href="/"
            className="rounded-md bg-white border border-[#e4dfd0] px-2.5 py-1 font-semibold text-[#141414] transition-colors duration-200 hover:bg-[#141414] hover:text-white hover:border-[#141414]"
          >
            ← Inicio
          </Link>
          <span className="text-[#c9c4b5]">/</span>
          <Link
            href={`/marca/${brandSlug}`}
            className="rounded-md bg-white border border-[#e4dfd0] px-2.5 py-1 font-bold text-[#141414] transition-colors duration-200 hover:bg-[#141414] hover:text-white hover:border-[#141414]"
          >
            {product.brand}
          </Link>
          <span className="text-[#c9c4b5]">/</span>
          <span className="truncate max-w-[180px] sm:max-w-none font-medium text-[#141414]">
            {product.name}
          </span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-start">
          <div className="space-y-3">
            {product.images.length ? (
              product.images.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt={`${product.brand} ${product.name}`}
                  className="w-full rounded-3xl border border-[#e4dfd0] bg-white object-cover shadow-sm"
                />
              ))
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-3xl bg-[#eeeae0] text-[#6b675f]">
                Sin foto
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-[#e4dfd0] bg-white p-5 sm:p-8 shadow-xs">
            <Link
              href={`/marca/${brandSlug}`}
              className="inline-block text-[11px] sm:text-xs font-black uppercase tracking-[0.24em] text-[#2754F5] hover:underline"
            >
              Colección {product.brand} →
            </Link>
            <h1 className="mt-1.5 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#141414]">
              {product.name}
            </h1>

            <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
              <span className="rounded-full bg-[#141414] px-3 py-1 text-xs font-bold text-white shadow-2xs">
                {GENDER_LABEL[product.gender]}
              </span>
              {product.color ? (
                <span className="rounded-full bg-[#f4f1ea] border border-[#dcd6c5] px-3 py-1 text-xs font-bold text-[#141414] shadow-2xs">
                  Color: {product.color}
                </span>
              ) : null}
              <span className="rounded-full bg-[#f4f1ea] border border-[#dcd6c5] px-3 py-1 text-xs font-bold text-[#141414] shadow-2xs">
                {CONDITION_LABEL[product.condition]}
              </span>
              <span className="rounded-full bg-[#25D366]/15 border border-[#25D366]/30 px-3 py-1 text-xs font-extrabold text-[#1a8e45]">
                {product.available ? "✓ Disponible para entrega" : "Agotado"}
              </span>
            </div>

            <div className="mt-6 flex items-baseline gap-3 border-y border-[#f0ede4] py-4">
              <span className="text-3xl sm:text-4xl font-black text-[#141414]">{formatPrice(product.price)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price ? (
                <span className="text-lg sm:text-xl text-[#6b675f] line-through font-semibold">
                  {formatPrice(product.compareAtPrice)}
                </span>
              ) : null}
            </div>

            {product.description ? (
              <p className="mt-6 text-sm sm:text-base leading-relaxed text-[#3d3a34] font-medium">{product.description}</p>
            ) : null}

            <ProductOrderSection product={product} phone={phone} admin={admin} />
          </div>
        </div>

        {related.length ? (
          <section className="mt-16 sm:mt-20 border-t border-[#e4dfd0] pt-10 sm:pt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-[#2754F5]">Más modelos de {product.brand}</h2>
              <Link href={`/marca/${brandSlug}`} className="rounded-lg bg-[#f4f1ea] px-2 py-1 text-[10px] sm:text-xs font-bold text-[#141414] group-hover:bg-[#141414] group-hover:text-white transition shadow-2xs">
                Ver todos los {product.brand} →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </>
  );
}
