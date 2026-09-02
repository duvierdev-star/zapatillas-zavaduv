import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const srcImagesDir = path.join(rootDir, "Zapatillas");
const destImagesDir = path.join(rootDir, "public", "zapatillas");
const productsJsonPath = path.join(rootDir, "data", "products.json");

if (!fs.existsSync(destImagesDir)) {
  fs.mkdirSync(destImagesDir, { recursive: true });
}

const COLOR_EXPANSIONS = {
  "GRIS": "Gris",
  "VERDE": "Verde",
  "AZUL": "Azul",
  "NEGRO": "Negro",
  "NEGRA": "Negro",
  "BLANCO": "Blanco",
  "BLANCA": "Blanco",
  "ROJO": "Rojo",
  "ROJA": "Rojo",
  "ROSA": "Rosa",
  "CELESTE": "Celeste",
  "CAFE": "Café",
  "PANDA": "Panda (Blanco y Negro)",
  "G": "Gris",
  "B": "Blanco",
  "N": "Negro",
  "AZ": "Azul",
  "V": "Verde",
  "R": "Rojo",
  "BA": "Blanco con Azul",
  "BG": "Blanco con Gris",
  "BN": "Blanco con Negro",
  "BV": "Blanco con Verde",
  "BVE": "Blanco con Verde",
  "BVK": "Blanco / Verde / Negro",
  "BVZ": "Blanco / Verde / Azul",
  "AZB": "Azul con Blanco",
  "GB": "Gris con Blanco",
  "GD": "Gris con Dorado",
  "GN": "Gris con Negro",
  "GNAZ": "Gris / Negro / Azul",
  "GROSA": "Gris con Rosa",
  "GR": "Gris con Rojo",
  "NA": "Negro con Azul",
  "NB": "Negro con Blanco",
  "ND": "Negro con Dorado",
  "NAM": "Negro con Amarillo",
  "NR": "Negro con Rojo",
  "NG": "Negro con Gris",
  "NGR": "Negro / Gris / Rojo",
  "NN": "Total Black (Todo Negro)",
  "BR": "Blanco con Rojo",
  "GH": "Gris Humo"
};

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseProduct(filename, index) {
  let clean = filename.replace(/\.jpe?g$/i, "").trim();

  // Match Colombian price pattern: e.g. $100.000, $90.000, 80.000, $75.000
  const priceMatch = clean.match(/\$\s*(\d{1,3}(?:\.\d{3})+|\d{5,6})|(?:\b|\s)(\d{1,3}\.000)\b/);
  let costPrice = 75000;
  if (priceMatch) {
    const rawDigits = (priceMatch[1] || priceMatch[2]).replace(/\./g, "");
    costPrice = parseInt(rawDigits, 10);
  }

  // Sale price = Cost + 45.000 COP
  const salePrice = costPrice + 45000;

  // Clean string without price and without duplicate numbering (2), (3)
  let raw = clean
    .replace(/\$\s*(\d{1,3}(?:\.\d{3})+|\d{5,6})|(?:\b|\s)(\d{1,3}\.000)\b/g, "")
    .replace(/\(\d+\)/g, "")
    .trim();

  // Detect Brand
  let brand = "Otras";
  let brandPrefix = "";
  const BRANDS = [
    "HUGO BOSS", "LOUIS VUITTON", "LECOQ SPORTIF", "LE COQ SPORTIF",
    "NEW BALANCE", "ADIDAS", "NIKE", "JORDAN", "PUMA", "CONVERSE",
    "ASICS", "SKECHERS", "PROMO GUAYOS", "PROMO DAMA", "PROMO"
  ];

  for (const b of BRANDS) {
    if (raw.toUpperCase().startsWith(b)) {
      brandPrefix = b;
      if (b.startsWith("PROMO")) brand = "Promociones";
      else if (b === "LECOQ SPORTIF" || b === "LE COQ SPORTIF") brand = "Le Coq Sportif";
      else if (b === "HUGO BOSS") brand = "Hugo Boss";
      else if (b === "LOUIS VUITTON") brand = "Louis Vuitton";
      else if (b === "NEW BALANCE") brand = "New Balance";
      else brand = b.charAt(0) + b.slice(1).toLowerCase();
      break;
    }
  }

  if (raw.toUpperCase().startsWith("CHANCLA NIKE")) { brand = "Nike"; brandPrefix = "CHANCLA NIKE"; }
  else if (raw.toUpperCase().startsWith("CHANCLA PUMA")) { brand = "Puma"; brandPrefix = "CHANCLA PUMA"; }
  else if (raw.toUpperCase().startsWith("GUAYO ADIDAS")) { brand = "Adidas"; brandPrefix = "GUAYO ADIDAS"; }
  else if (raw.toUpperCase().startsWith("GUAYO JORDAN")) { brand = "Jordan"; brandPrefix = "GUAYO JORDAN"; }
  else if (raw.toUpperCase().startsWith("GUAYO NIKE")) { brand = "Nike"; brandPrefix = "GUAYO NIKE"; }

  // Detect Gender
  let gender = "unisex";
  const upper = raw.toUpperCase();
  if (upper.includes("DAMA Y CABALLERO") || upper.includes("DAMA/CABALLERO") || upper.includes("DAMA Y CAB")) {
    gender = "unisex";
  } else if (upper.includes("DAMA")) {
    gender = "mujer";
  } else if (upper.includes("CABALLERO") || upper.includes("HOMBRE")) {
    gender = "hombre";
  }

  // Detect Model and Colors
  let remainder = raw;
  if (brandPrefix) {
    remainder = remainder.slice(brandPrefix.length).trim();
  }

  // Extract custom size range if present (e.g. 36 AL 40)
  let customSizes = null;
  const sizeRangeMatch = remainder.match(/(\d{2})\s*(?:AL|A|-)\s*(\d{2})/i);
  if (sizeRangeMatch) {
    const start = parseInt(sizeRangeMatch[1], 10);
    const end = parseInt(sizeRangeMatch[2], 10);
    customSizes = [];
    for (let s = start; s <= end; s++) {
      customSizes.push(s.toString());
    }
    remainder = remainder.replace(sizeRangeMatch[0], "").trim();
  }

  // Find color abbreviations and words
  let colorFound = null;
  const words = remainder.split(/\s+/);
  const cleanWords = [];
  for (const w of words) {
    const uw = w.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (
      uw === "DAMA" ||
      uw === "CABALLERO" ||
      uw === "Y" ||
      uw === "TALLAS" ||
      uw === "DISPONIBLE" ||
      uw === "DISPONIBLES" ||
      uw === "EN" ||
      uw === "LA" ||
      uw === "IMAGEN"
    ) {
      continue;
    }
    if (COLOR_EXPANSIONS[uw]) {
      colorFound = COLOR_EXPANSIONS[uw];
    } else if (w.trim()) {
      cleanWords.push(w.trim());
    }
  }

  let modelName = cleanWords.join(" ").trim();
  if (!modelName) {
    if (brandPrefix.includes("CHANCLA")) modelName = "Slide Chancla";
    else if (brandPrefix.includes("GUAYO")) modelName = "Guayo Soccer";
    else if (brand === "Promociones") modelName = "Promo Selección";
    else if (brand === "Hugo Boss") modelName = "Urban Leather";
    else modelName = "Classic";
  } else {
    if (brandPrefix.includes("GUAYO") && !modelName.toLowerCase().includes("guayo")) {
      modelName = `Guayo ${modelName}`;
    } else if (brandPrefix.includes("CHANCLA") && !modelName.toLowerCase().includes("chancla")) {
      modelName = `Chancla ${modelName}`;
    }
  }

  // Format model name capitalization
  modelName = modelName
    .split(" ")
    .map((w) => {
      const uw = w.toUpperCase();
      if (["AF1", "SB", "OG", "TN", "V2K", "P6000", "F50", "R1", "R3", "R4", "II"].includes(uw)) {
        return uw;
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");

  // Default Sizes
  let sizes = customSizes;
  if (!sizes || sizes.length === 0) {
    if (gender === "mujer") {
      sizes = ["36", "37", "38", "39", "40"];
    } else if (gender === "hombre") {
      sizes = ["38", "39", "40", "41", "42", "43"];
    } else {
      sizes = ["36", "37", "38", "39", "40", "41", "42"];
    }
  }

  // Generate safe filename for public/zapatillas
  const ext = path.extname(filename).toLowerCase() || ".jpeg";
  const safeFilename = `${slugify(`${brand}-${modelName}-${colorFound || ""}-${index + 1}`)}${ext}`;

  // Copy image file
  const srcPath = path.join(srcImagesDir, filename);
  const destPath = path.join(destImagesDir, safeFilename);
  fs.copyFileSync(srcPath, destPath);

  // Description
  const genderText = gender === "mujer" ? "Dama" : gender === "hombre" ? "Caballero" : "Unisex";
  const colorText = colorFound ? ` en color ${colorFound}` : "";
  const description = `Zapatilla ${brand} ${modelName} para ${genderText}${colorText}. Diseño exclusivo, acabados de alta calidad y máxima comodidad para uso diario o deportivo.`;

  const id = `${slugify(`${brand}-${modelName}`)}-${index + 1}`;

  return {
    id,
    name: modelName,
    brand,
    gender,
    color: colorFound || undefined,
    sizes,
    price: salePrice,
    costPrice,
    compareAtPrice: brand === "Promociones" ? salePrice + 30000 : undefined,
    condition: "nuevo",
    description,
    images: [`/zapatillas/${safeFilename}`],
    available: true,
    createdAt: new Date(Date.now() - index * 60000).toISOString()
  };
}

async function run() {
  console.log("Reading images from:", srcImagesDir);
  const files = fs.readdirSync(srcImagesDir);
  const renamedFiles = files.filter((f) => !f.startsWith("WhatsApp") && /\.(jpe?g|png|webp)$/i.test(f));
  const whatsappFiles = files.filter((f) => f.startsWith("WhatsApp") && /\.(jpe?g|png|webp)$/i.test(f));

  console.log(`Found ${renamedFiles.length} renamed images and ${whatsappFiles.length} WhatsApp images.`);

  const products = renamedFiles.map((filename, index) => parseProduct(filename, index));

  // Also copy whatsapp files to public for later use
  whatsappFiles.forEach((f, idx) => {
    const ext = path.extname(f).toLowerCase() || ".jpeg";
    const destName = `pending-zap-${idx + 1}${ext}`;
    fs.copyFileSync(path.join(srcImagesDir, f), path.join(destImagesDir, destName));
  });

  fs.writeFileSync(productsJsonPath, JSON.stringify(products, null, 2), "utf8");

  console.log(`\nSuccessfully processed and created ${products.length} products in data/products.json!`);
  
  // Brand statistics
  const brandStats = {};
  products.forEach((p) => {
    brandStats[p.brand] = (brandStats[p.brand] || 0) + 1;
  });
  console.log("Brand Distribution:", brandStats);

  // Price checks
  console.log("\nSample Price Calculations (Cost -> Sale Price):");
  products.slice(0, 8).forEach((p) => {
    console.log(`- [${p.brand}] ${p.name} (${p.color || "Estándar"}): Compra $${p.costPrice?.toLocaleString("es-CO")} -> Venta $${p.price.toLocaleString("es-CO")}`);
  });
}

run().catch((err) => {
  console.error("Error syncing products:", err);
  process.exit(1);
});
