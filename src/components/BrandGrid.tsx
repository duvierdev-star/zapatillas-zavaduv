import Link from "next/link";
import { Product, slugifyBrand } from "@/lib/types";

// Logos/Styles accent data for brands
const BRAND_METADATA: Record<
  string,
  { label: string; tag: string; bg: string; text: string; border: string }
> = {
  Nike: {
    label: "Nike",
    tag: "Just Do It",
    bg: "bg-black",
    text: "text-white",
    border: "border-black",
  },
  Adidas: {
    label: "Adidas",
    tag: "Originals & Performance",
    bg: "bg-[#141414]",
    text: "text-white",
    border: "border-[#141414]",
  },
  Jordan: {
    label: "Jordan",
    tag: "Air & Retro Series",
    bg: "bg-[#8b181b]",
    text: "text-white",
    border: "border-[#8b181b]",
  },
  "Hugo Boss": {
    label: "Hugo Boss",
    tag: "Elegancia Urbana",
    bg: "bg-[#1c1d22]",
    text: "text-white",
    border: "border-[#1c1d22]",
  },
  "New Balance": {
    label: "New Balance",
    tag: "Estilo & Confort",
    bg: "bg-[#1d3557]",
    text: "text-white",
    border: "border-[#1d3557]",
  },
  Skechers: {
    label: "Skechers",
    tag: "Máxima Comodidad",
    bg: "bg-[#0b2545]",
    text: "text-white",
    border: "border-[#0b2545]",
  },
  Converse: {
    label: "Converse",
    tag: "Plataformas Clásicas",
    bg: "bg-[#2b2b2b]",
    text: "text-white",
    border: "border-[#2b2b2b]",
  },
  "Louis Vuitton": {
    label: "Louis Vuitton",
    tag: "Luxury Skate",
    bg: "bg-[#4a3525]",
    text: "text-white",
    border: "border-[#4a3525]",
  },
  "Le Coq Sportif": {
    label: "Le Coq Sportif",
    tag: "Heritage Francés",
    bg: "bg-[#1a2e40]",
    text: "text-white",
    border: "border-[#1a2e40]",
  },
  Puma: {
    label: "Puma",
    tag: "Forever Faster",
    bg: "bg-[#1e1e1e]",
    text: "text-white",
    border: "border-[#1e1e1e]",
  },
  Asics: {
    label: "Asics",
    tag: "Sound Mind, Sound Body",
    bg: "bg-[#102a43]",
    text: "text-white",
    border: "border-[#102a43]",
  },
  Promociones: {
    label: "Promociones y Ofertas",
    tag: "Precios Especiales",
    bg: "bg-[#2754F5]",
    text: "text-white",
    border: "border-[#2754F5]",
  },
};

export function BrandGrid({ products }: { products: Product[] }) {
  // Aggregate products by brand
  const brandsMap = new Map<string, { count: number; sampleImage: string }>();

  products.forEach((p) => {
    const existing = brandsMap.get(p.brand);
    if (!existing) {
      brandsMap.set(p.brand, { count: 1, sampleImage: p.images[0] || "" });
    } else {
      existing.count += 1;
    }
  });

  // Sort: Promociones first or top brands (Nike, Adidas, Jordan, Hugo Boss, New Balance...)
  const priority = [
    "Promociones",
    "Adidas",
    "Nike",
    "Jordan",
    "Hugo Boss",
    "New Balance",
    "Skechers",
    "Converse",
    "Louis Vuitton",
    "Le Coq Sportif",
    "Puma",
    "Asics",
  ];

  const brandEntries = Array.from(brandsMap.entries()).sort((a, b) => {
    const idxA = priority.indexOf(a[0]);
    const idxB = priority.indexOf(b[0]);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return b[1].count - a[1].count;
  });

  return (
    <section id="marcas" className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#2754F5]">
            Navega por Colección
          </p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-[#141414] sm:text-4xl">
            Explora por Marca
          </h2>
        </div>
        <p className="text-sm text-[#6b675f]">
          Haz clic en cualquier marca para ver todos sus modelos disponibles
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {brandEntries.map(([brand, data]) => {
          const meta = BRAND_METADATA[brand] || {
            label: brand,
            tag: "Colección",
            bg: "bg-[#222]",
            text: "text-white",
            border: "border-[#222]",
          };
          const isPromo = brand === "Promociones";
          const slug = slugifyBrand(brand);

          return (
            <Link
              key={brand}
              href={`/marca/${slug}`}
              className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                isPromo
                  ? "border-[#2754F5] bg-[#2754F5]/5 ring-1 ring-[#2754F5]/20"
                  : "border-[#e4dfd0] bg-white hover:border-[#141414]"
              }`}
            >
              {/* Image Banner */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eeeae0]">
                {data.sampleImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.sampleImage}
                    alt={`Zapatillas ${brand}`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#6b675f]">
                    Ver modelos
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                  <span className="rounded-full bg-black/75 px-2.5 py-1 text-[10px] sm:text-xs font-bold tracking-wide uppercase text-white shadow-xs backdrop-blur-xs">
                    {data.count} {data.count === 1 ? "par" : "pares"}
                  </span>
                  <span className="hidden sm:inline-block rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#141414] shadow-xs">
                    Ver →
                  </span>
                </div>
              </div>

              {/* Brand info */}
              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-base sm:text-lg font-black text-[#141414] group-hover:text-[#2754F5] transition truncate">
                    {brand}
                  </h3>
                  {isPromo && (
                    <span className="shrink-0 rounded-full bg-[#2754F5] px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold text-white uppercase tracking-wider">
                      OFERTA
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-[11px] sm:text-xs text-[#6b675f] line-clamp-1">{meta.tag}</p>
                <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#f0ede4] text-xs font-bold text-[#141414] group-hover:text-[#2754F5]">
                  <span>Ver colección</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
