import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { isAdmin } from "@/lib/auth";
import { getProduct, readProducts } from "@/lib/store";
import { CONDITION_LABEL, GENDER_LABEL, formatPrice, slugifyBrand } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";
import { ProductOrderSection } from "@/components/ProductOrderSection";
import { LazyImage } from "@/components/LazyImage";

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

      <main className="min-h-screen bg-[#faf9f7]">
        <section className="px-4 pb-12 pt-6 sm:px-5 sm:pb-16 sm:pt-8">
          <div className="mx-auto max-w-6xl">

            {/* Breadcrumb navigation */}
            <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs sm:mb-8 sm:text-sm">
              <Link
                href="/"
                className="rounded-full border border-black/5 bg-white px-3 py-1.5 font-bold text-[#141414] shadow-sm transition hover:bg-[#141414] hover:text-white"
              >
                ← Inicio
              </Link>

              <span className="text-[#b8b3a9]">/</span>

              <Link
                href={`/marca/${brandSlug}`}
                className="rounded-full border border-black/5 bg-white px-3 py-1.5 font-bold text-[#141414] shadow-sm transition hover:bg-[#141414] hover:text-white"
              >
                {product.brand}
              </Link>

              <span className="text-[#b8b3a9]">/</span>

              <span className="max-w-[180px] truncate font-medium text-[#777] sm:max-w-none">
                {product.name}
              </span>
            </nav>

            {/* Product */}
            <div className="grid items-start gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8">

              {/* Images */}
              <div className="space-y-4">
                {product.images.length ? (
                  product.images.map((src, index) => (
                    <div
                      key={src}
                      className="group relative aspect-square w-full overflow-hidden rounded-3xl border border-black/5 bg-white shadow-sm"
                    >
                      <LazyImage
                        src={src}
                        alt={`${product.brand} ${product.name}`}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]"
                        priority={index === 0}
                      />

                      {product.images.length > 1 ? (
                        <div className="absolute left-4 top-4 rounded-full border border-white/50 bg-white/85 px-3 py-1 text-[10px] font-bold text-[#141414] shadow-sm backdrop-blur">
                          {index + 1} / {product.images.length}
                        </div>
                      ) : null}
                    </div>
                  ))
                ) : (
                  <div className="flex aspect-square items-center justify-center rounded-3xl border border-black/5 bg-white text-sm font-medium text-[#777] shadow-sm">
                    Sin foto disponible
                  </div>
                )}
              </div>

              {/* Product information */}
              <div className="lg:sticky lg:top-24">
                <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-white p-5 shadow-sm sm:p-7 lg:p-8">

                  {/* Decorative circles */}
                  <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#2754F5]/5" />
                  <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-[#2754F5]/5" />

                  <div className="relative">

                    {/* Brand */}
                    <Link
                      href={`/marca/${brandSlug}`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#2754F5]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#2754F5] transition hover:bg-[#2754F5] hover:text-white"
                    >
                      Colección {product.brand}
                      <span>→</span>
                    </Link>

                    {/* Product name */}
                    <h1 className="mt-4 text-3xl font-black tracking-tight text-[#141414] sm:text-4xl lg:text-5xl">
                      {product.name}
                    </h1>

                    {/* Product tags */}
                    <div className="mt-5 flex flex-wrap gap-2">

                      <span className="rounded-full bg-[#141414] px-3 py-1.5 text-[11px] font-bold text-white">
                        {GENDER_LABEL[product.gender]}
                      </span>

                      {product.color ? (
                        <span className="rounded-full border border-black/5 bg-[#f4f1ea] px-3 py-1.5 text-[11px] font-bold text-[#141414]">
                          {product.color}
                        </span>
                      ) : null}

                      <span className="rounded-full border border-black/5 bg-[#f4f1ea] px-3 py-1.5 text-[11px] font-bold text-[#141414]">
                        {CONDITION_LABEL[product.condition]}
                      </span>

                      {product.available ? (
                        <span className="rounded-full border border-[#25D366]/20 bg-[#25D366]/10 px-3 py-1.5 text-[11px] font-extrabold text-[#1a8e45]">
                          ✓ Disponible
                        </span>
                      ) : (
                        <span className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] font-extrabold text-red-600">
                          Agotado
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="my-7 border-y border-black/5 py-5">
                      <div className="flex flex-wrap items-end gap-3">
                        <span className="text-4xl font-black tracking-tight text-[#141414] sm:text-5xl">
                          {formatPrice(product.price)}
                        </span>

                        {product.compareAtPrice &&
                          product.compareAtPrice > product.price ? (
                          <span className="pb-1 text-base font-semibold text-[#999] line-through sm:text-lg">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        ) : null}
                      </div>

                      {product.compareAtPrice &&
                        product.compareAtPrice > product.price ? (
                        <div className="mt-2 inline-flex rounded-full bg-[#2754F5]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2754F5]">
                          Precio especial
                        </div>
                      ) : null}
                    </div>

                    {/* Description */}
                    {product.description ? (
                      <div className="mb-7">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#2754F5]">
                          Detalles del producto
                        </span>

                        <p className="mt-3 text-sm font-medium leading-7 text-[#5f5b54] sm:text-base">
                          {product.description}
                        </p>
                      </div>
                    ) : null}

                    {/* Order section */}
                    <ProductOrderSection
                      product={product}
                      phone={phone}
                      admin={admin}
                    />

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related products */}
        {related.length ? (
          <section className="border-t border-black/5 bg-white px-4 py-12 sm:px-5 sm:py-16">
            <div className="mx-auto max-w-6xl">

              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#2754F5]">
                    También te puede interesar
                  </span>

                  <h2 className="mt-2 text-2xl font-black tracking-tight text-[#141414] sm:text-3xl">
                    Más modelos de {product.brand}
                  </h2>

                  <p className="mt-2 text-sm text-[#777]">
                    Descubre otras zapatillas disponibles de esta marca.
                  </p>
                </div>

                <Link
                  href={`/marca/${brandSlug}`}
                  className="group inline-flex w-fit items-center gap-2 rounded-full bg-[#f4f1ea] px-4 py-2 text-xs font-bold text-[#141414] transition hover:bg-[#141414] hover:text-white"
                >
                  Ver todos
                  <span className="transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                {related.map((item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                  />
                ))}
              </div>

            </div>
          </section>
        ) : null}
      </main>    </>
  );
}
