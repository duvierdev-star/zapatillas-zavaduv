export type Gender = "hombre" | "mujer" | "unisex";
export type Condition = "nuevo" | "usado";

export type Product = {
  id: string;
  name: string;
  brand: string;
  gender: Gender;
  color?: string;
  sizes: string[];
  price: number;
  costPrice?: number;
  compareAtPrice?: number;
  condition: Condition;
  description: string;
  images: string[];
  available: boolean;
  createdAt: string;
};

export type ProductInput = Omit<Product, "id" | "createdAt"> & {
  id?: string;
};

export const GENDER_LABEL: Record<Gender, string> = {
  hombre: "Hombre",
  mujer: "Mujer",
  unisex: "Unisex",
};

export const CONDITION_LABEL: Record<Condition, string> = {
  nuevo: "Nuevo",
  usado: "Usado",
};

export function slugifyBrand(brand: string): string {
  return brand
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

export function whatsappLink(
  phone: string,
  productName: string,
  brand: string,
  price?: number,
  size?: string
) {
  const digits = phone.replace(/\D/g, "");
  const priceText = price ? ` por ${formatPrice(price)}` : "";
  const sizeText = size ? ` en Talla ${size} EUR` : "";
  const eurNote = size ? " (Tengo en cuenta que la talla es en EUR)." : "";
  const text = encodeURIComponent(
    `Hola, me interesa comprar la zapatilla ${brand} ${productName}${sizeText}${priceText}.${eurNote} ¿Sigue disponible?`
  );
  return `https://wa.me/${digits}?text=${text}`;
}

