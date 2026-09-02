import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const dir = path.join(process.cwd(), "public", "zapatillas");
    const files = await fs.readdir(dir);
    
    // Filter valid image extensions and sort naturally (001, 002, etc.)
    const images = files
      .filter((file) => /\.(jpe?g|png|webp|gif|avif)$/i.test(file))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
      .map((file) => `/zapatillas/${file}`);

    return NextResponse.json({ images });
  } catch (error) {
    console.error("Error reading zapatillas directory:", error);
    return NextResponse.json({ images: [] });
  }
}
