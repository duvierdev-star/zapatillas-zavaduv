import { promises as fs } from "fs";
import path from "path";
import { Product, ProductInput } from "./types";

const filePath = path.join(process.cwd(), "data", "products.json");

export async function readProducts(): Promise<Product[]> {
  const raw = await fs.readFile(filePath, "utf8");
  const products = JSON.parse(raw) as Product[];
  return products.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function writeProducts(products: Product[]) {
  await fs.writeFile(filePath, JSON.stringify(products, null, 2), "utf8");
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

export async function upsertProduct(input: ProductInput): Promise<Product> {
  const products = await readProducts();
  const now = new Date().toISOString();

  if (input.id) {
    const index = products.findIndex((item) => item.id === input.id);
    if (index === -1) {
      throw new Error("Producto no encontrado");
    }
    const updated: Product = {
      ...products[index],
      ...input,
      id: input.id,
      createdAt: products[index].createdAt,
    };
    products[index] = updated;
    await writeProducts(products);
    return updated;
  }

  let id = slugify(`${input.brand}-${input.name}`) || `zap-${Date.now()}`;
  if (products.some((item) => item.id === id)) {
    id = `${id}-${Date.now()}`;
  }

  const created: Product = {
    id,
    name: input.name,
    brand: input.brand,
    gender: input.gender,
    color: input.color,
    sizes: input.sizes,
    price: input.price,
    costPrice: input.costPrice,
    compareAtPrice: input.compareAtPrice,
    condition: input.condition,
    description: input.description,
    images: input.images,
    available: input.available,
    createdAt: now,
  };
  products.unshift(created);
  await writeProducts(products);
  return created;
}

export async function deleteProduct(id: string) {
  const products = await readProducts();
  await writeProducts(products.filter((item) => item.id !== id));
}

export async function getProduct(id: string) {
  const products = await readProducts();
  return products.find((item) => item.id === id) ?? null;
}
