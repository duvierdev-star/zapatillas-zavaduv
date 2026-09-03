import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowed.includes(file.type) && !file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Solo se permiten imágenes" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = Buffer.from(arrayBuffer);

  // 1. Si está configurado ImgBB (Gratuito, solo requiere IMGBB_API_KEY)
  const imgbbKey = process.env.IMGBB_API_KEY;
  if (imgbbKey) {
    try {
      const imgbbForm = new FormData();
      imgbbForm.append("image", bytes.toString("base64"));
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: "POST",
        body: imgbbForm,
      });
      const data = await res.json();
      if (data?.data?.url) {
        return NextResponse.json({ url: data.data.url });
      }
    } catch (err) {
      console.error("Error subiendo a ImgBB:", err);
    }
  }

  // 2. Si está configurado Cloudinary (CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET)
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (cloudName && uploadPreset) {
    try {
      const cloudForm = new FormData();
      const blob = new Blob([bytes], { type: file.type });
      cloudForm.append("file", blob, file.name);
      cloudForm.append("upload_preset", uploadPreset);
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: cloudForm,
      });
      const data = await res.json();
      if (data?.secure_url) {
        return NextResponse.json({ url: data.secure_url });
      }
    } catch (err) {
      console.error("Error subiendo a Cloudinary:", err);
    }
  }

  // 3. Fallback Local (Desarrollo en PC)
  try {
    const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const dir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, name), bytes);
    return NextResponse.json({ url: `/uploads/${name}` });
  } catch (err) {
    console.error("Error al guardar imagen local:", err);
    return NextResponse.json({ error: "Error al guardar la imagen en el servidor" }, { status: 500 });
  }
}

