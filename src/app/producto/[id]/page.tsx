import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { isAdmin } from "@/lib/auth";
import { getProduct, readProducts } from "@/lib/store";
import { CONDITION_LABEL, GENDER_LABEL, formatPrice, slugifyBrand, whatsappLink } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

const phone = process.env.NEXT_PUBLIC_WHATSAPP || "";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, admin, all] = await Promise.all([getProduct(id), isAdmin(), readProducts()]);
  if (!product) notFound();

  const brandSlug = slugifyBrand(product.brand);
  const related = all.filter((item) => item.id !== product.id && item.brand === product.brand).slice(0, 3);
  const wa = phone ? whatsappLink(phone, product.name, product.brand, product.price) : "";

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

            <div className="mt-6">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#6b675f]">Tallas disponibles</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className="min-w-12 rounded-xl border-2 border-[#e4dfd0] bg-[#fdfcf9] px-3.5 py-2 text-center text-sm font-black text-[#141414] shadow-2xs hover:border-[#141414] transition"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>

            {product.description ? (
              <p className="mt-6 text-sm sm:text-base leading-relaxed text-[#3d3a34] font-medium">{product.description}</p>
            ) : null}

            <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-3">
              {wa && product.available ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 text-center text-sm sm:text-base font-extrabold text-white shadow-lg hover:bg-[#1ebe5d] transition w-full"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                  </svg>
                  <span>Pedir por WhatsApp ({formatPrice(product.price)})</span>
                </a>
              ) : null}
              {admin ? (
                <Link href={`/admin?editar=${product.id}`} className="rounded-full border-2 border-[#141414] px-6 py-3 text-center text-xs font-bold text-[#141414] hover:bg-[#141414] hover:text-white transition">
                  Editar en el panel
                </Link>
              ) : null}
            </div>
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
