import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteProduct, upsertProduct } from "@/lib/store";
import { ProductInput } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json()) as ProductInput;
  const product = await upsertProduct({ ...body, id });
  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
