import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { readProducts, upsertProduct } from "@/lib/store";
import { ProductInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await readProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = (await request.json()) as ProductInput;
  if (!body.name?.trim() || !body.brand?.trim() || !body.sizes?.length || !body.price) {
    return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
  }
  const product = await upsertProduct({
    ...body,
    name: body.name.trim(),
    brand: body.brand.trim(),
    description: body.description?.trim() || "",
    images: body.images?.length ? body.images : [],
    available: body.available !== false,
  });
  return NextResponse.json(product);
}
