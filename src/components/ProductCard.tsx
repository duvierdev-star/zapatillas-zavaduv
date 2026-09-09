import Link from "next/link";
import { CONDITION_LABEL, GENDER_LABEL, formatPrice, Product } from "@/lib/types";
import { LazyImage } from "./LazyImage";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

  return (
    <Link
      href={`/producto/${product.id}`}
      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#e4dfd0] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#141414] hover:shadow-md"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-[#eeeae0]">
        {image ? (
          <LazyImage
            src={image}
            alt={`${product.brand} ${product.name}`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#6b675f]">
            Sin foto
          </div>
        )}
        <div className="absolute left-2.5 top-2.5 right-2.5 flex flex-wrap gap-1">
          <span className="rounded-full bg-[#141414] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
            {GENDER_LABEL[product.gender]}
          </span>
          {product.color ? (
            <span className="rounded-full bg-white/95 border border-black/15 px-2 py-0.5 text-[10px] font-bold text-[#141414] shadow-xs backdrop-blur-xs">
              {product.color}
            </span>
          ) : null}
          {discount > 0 ? (
            <span className="rounded-full bg-[#2754F5] px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
              OFERTA
            </span>
          ) : null}
          {!product.available ? (
            <span className="rounded-full bg-red-700 px-2 py-0.5 text-[10px] font-extrabold text-white shadow-xs">
              Agotado
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between space-y-2 p-3 sm:p-4">
        <div>
          <p className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#2754F5]">
            {product.brand}
          </p>
          <h3 className="mt-0.5 text-sm sm:text-base font-bold leading-snug text-[#141414] group-hover:text-black line-clamp-2">
            {product.name}
          </h3>
          <p className="mt-1 text-[11px] sm:text-xs text-[#6b675f] font-medium">
            Tallas EUR: {product.sizes.join(", ")}
          </p>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-[#f0ede4]">
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black text-[#141414]">
              {formatPrice(product.price)}
            </span>
            {discount > 0 ? (
              <span className="text-[11px] text-[#6b675f] line-through">
                {formatPrice(product.compareAtPrice!)}
              </span>
            ) : null}
          </div>
          <span className="rounded-lg bg-[#f4f1ea] px-2 py-1 text-[10px] sm:text-xs font-bold text-[#141414] group-hover:bg-[#141414] group-hover:text-white transition shadow-2xs">
            Ver →
          </span>
        </div>
      </div>
    </Link>
  );
}
