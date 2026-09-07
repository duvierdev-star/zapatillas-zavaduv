import fs from "fs";
import path from "path";
import crypto from "crypto";
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
  // Multi-word colors first
  "AZUL OSCURO": "Azul Oscuro",
  "CAFE OSCURO": "Café Oscuro",
  "CAFE O": "Café Oscuro",
  "NEGRA CEBRA": "Negro Cebra",
  "NEGRO CEBRA": "Negro Cebra",
  "GRIS HUMO": "Gris Humo",
  "TOTAL BLACK": "Total Black (Todo Negro)",
  "CORDONES BLANCOS": "Cordones Blancos",
  "GRIS CLARO": "Gris Claro",
  "PALO DE ROSA": "Palo de Rosa",
  "JEAN VINO": "Jean con Vinotinto",
  "JEANVINO": "Jean con Vinotinto",

  // Single word colors
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
  "CREMA": "Crema",
  "NARANJA": "Naranja",
  "HABANA": "Habana / Beige",
  "HABANAS": "Habana / Beige",
  "PANDA": "Panda (Blanco y Negro)",
  "CEBRA": "Negro Cebra",
  "PLATEADA": "Plateada / Silver",
  "PLATEADO": "Plateado / Silver",
  "AMARILLO": "Amarillo",
  "AMARILLA": "Amarillo",
  "LILA": "Lila",
  "VINO": "Vinotinto",
  "VINOTINTO": "Vinotinto",
  "ORO": "Dorado",
  "DORADO": "Dorado",

  // 3-4 Letter Supplier Abbreviations
  "BPCN": "Blanco / Palo de Rosa / Negro",
  "BVNAR": "Blanco / Verde / Naranja",
  "BNNA": "Blanco / Negro / Naranja",
  "VBAM": "Verde / Blanco / Amarillo",
  "GAAM": "Gris / Azul / Amarillo",
  "BROSA": "Blanco con Rosa",
  "GROSA": "Gris con Rosa",
  "BAH": "Blanco / Azul / Hueso",
  "BGV": "Blanco / Gris / Verde",
  "BVN": "Blanco / Verde / Negro",
  "NGB": "Negro / Gris / Blanco",
  "GNB": "Gris / Negro / Blanco",
  "BNH": "Blanco / Negro / Hueso",
  "BPN": "Blanco / Rosa / Negro",
  "NBR": "Negro / Blanco / Rojo",
  "AGB": "Azul / Gris / Blanco",
  "HAV": "Hueso / Azul / Verde",
  "BCL": "Blanco con Celeste",
  "HCB": "Hueso / Café / Blanco",
  "VAM": "Verde con Amarillo",
  "BNA": "Blanco / Negro / Azul",
  "BRA": "Blanco con Rojo y Azul",
  "BGR": "Blanco / Gris / Rojo",
  "BCEL": "Blanco con Celeste",
  "BVIN": "Blanco con Vinotinto",
  "BNVIN": "Blanco / Negro / Vinotinto",
  "GNAZ": "Gris / Negro / Azul",
  "NGR": "Negro / Gris / Rojo",
  "NBII": "Negro con Blanco",
  "BVK": "Blanco / Verde / Negro",
  "BVZ": "Blanco / Verde / Azul",
  "AZB": "Azul con Blanco",
  "AMN": "Amarillo con Negro",
  "AMA": "Amarillo con Blanco",
  "CVB": "Café / Verde / Blanco",
  "ROSAN": "Rosa con Negro",
  "BCN": "Blanco / Café / Negro",
  "BNG": "Blanco / Negro / Gris",
  "NBH": "Negro / Blanco / Hueso",
  "NVD": "Negro / Verde / Dorado",
  "BNC": "Blanco con Café",
  "BND": "Blanco / Negro / Dorado",
  "CAB": "Café con Azul y Blanco",
  "GBN": "Gris / Blanco / Negro",
  "VBN": "Verde / Blanco / Negro",
  "BPC": "Blanco / Palo de Rosa / Crema",
  "ABH": "Azul / Blanco / Hueso",
  "NBC": "Negro / Blanco / Café",
  "HNA": "Hueso / Negro / Amarillo",
  "BNR": "Blanco / Negro / Rojo",
  "BHN": "Blanco / Hueso / Negro",

  // 2 Letter Supplier Abbreviations
  "AV": "Azul con Verde",
  "BH": "Blanco con Hueso",
  "HN": "Hueso con Negro",
  "BA": "Blanco con Azul",
  "BG": "Blanco con Gris",
  "BN": "Blanco con Negro",
  "BV": "Blanco con Verde",
  "BVE": "Blanco con Verde",
  "AB": "Azul con Blanco",
  "GB": "Gris con Blanco",
  "GD": "Gris con Dorado",
  "GN": "Gris con Negro",
  "GR": "Gris con Rojo",
  "NA": "Negro con Azul",
  "NB": "Negro con Blanco",
  "ND": "Negro con Dorado",
  "NAM": "Negro con Amarillo",
  "NR": "Negro con Rojo",
  "NG": "Negro con Gris",
  "NN": "Total Black (Todo Negro)",
  "BR": "Blanco con Rojo",
  "GH": "Gris Humo",
  "BC": "Blanco con Café",
  "CB": "Café con Blanco",
  "NP": "Negro con Rosa",
  "PA": "Palo de Rosa con Azul",
  "RB": "Rojo con Blanco",
  "AAM": "Azul con Amarillo",
  "NV": "Negro con Verde",
  "AH": "Azul con Hueso",
  "NH": "Negro con Hueso",
  "BP": "Blanco con Rosa",
  "PC": "Palo de Rosa con Crema",
  "BF": "Blanco con Fucsia",
  "GC": "Gris Claro",
  "BAN": "Blanco / Azul / Negro",
  "NC": "Negro con Café",
  "HD": "Hueso con Dorado",
  "VG": "Verde con Gris",
  "COB": "Cobre / Beige",
  "CRB": "Crema con Blanco",
  "HC": "Hueso con Café",
  "HB": "Hueso con Blanco",
  "AN": "Azul con Negro",
  "LB": "Lila con Blanco",
  "VB": "Verde con Blanco",
  "NPR": "Negro / Rosa / Rojo",
  "FR": "Fucsia con Rojo",
  "RL": "Rojo con Lila",
  "VA": "Verde con Azul",
  "HG": "Hueso con Gris",
  "GA": "Gris con Azul"
};

const BRANDS = [
  "ALEXANDER MCQUEEN",
  "TOMMY HILFIGER",
  "GOLDEN GOOSE",
  "ONITSUKA TIGER",
  "ONITSUKA",
  "ON CLOUD",
  "ARMANI EXCHANGE",
  "BOTA UNDER ARMOUR",
  "UNDER ARMOUR",
  "HUGO BOSS",
  "BOSS",
  "LOUIS VUITTON",
  "LECOQ SPORTIF",
  "LE COQ SPORTIF",
  "NEW BALANCE",
  "ADIDAS",
  "ADISTAR",
  "SANDALIAS ADIDAS",
  "NIKE",
  "JORDAN",
  "PUMA",
  "CONVERSE",
  "ASICS",
  "SKECHERS",
  "FILA",
  "TIMBERLAND",
  "LACOSTE",
  "REEBOK",
  "DIESEL",
  "ALO",
  "PROMO GUAYOS",
  "PROMO DAMA Y CABALLERO",
  "PROMO DAMA",
  "PROMO CABALLERO",
  "PROMO"
];

function slugify(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function computeFileHash(filePath) {
  const buf = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(buf).digest("hex");
}

function parseProduct(filename, index, existingIds) {
  let clean = filename.replace(/\.jpe?g$/i, "").trim();

  // Match Colombian price pattern: e.g. $100.000, $90.000, $90000, 80.000, $75.000
  const priceMatch = clean.match(/\$\s*(\d{1,3}(?:\.\d{3})+|\d{5,6})|(?:\b|\s)(\d{1,3}\.000)\b/);
  let costPrice = 75000;
  if (priceMatch) {
    const rawDigits = (priceMatch[1] || priceMatch[2]).replace(/\./g, "");
    costPrice = parseInt(rawDigits, 10);
  }

  // Sale price = Cost + 45.000 COP profit
  const salePrice = costPrice + 45000;

  // Clean string without price and without duplicate numbering (2), (3), II
  let raw = clean
    .replace(/\$\s*(\d{1,3}(?:\.\d{3})+|\d{5,6})|(?:\b|\s)(\d{1,3}\.000)\b/g, "")
    .replace(/\(\d+\)/g, "")
    .trim();

  // Detect Brand
  let brand = "Otras";
  let brandPrefix = "";

  for (const b of BRANDS) {
    if (raw.toUpperCase().startsWith(b)) {
      brandPrefix = b;
      if (b.startsWith("PROMO")) brand = "Promociones";
      else if (b === "BOTA UNDER ARMOUR" || b === "UNDER ARMOUR") brand = "Under Armour";
      else if (b === "ARMANI EXCHANGE") brand = "Armani Exchange";
      else if (b === "LECOQ SPORTIF" || b === "LE COQ SPORTIF") brand = "Le Coq Sportif";
      else if (b === "HUGO BOSS" || b === "BOSS") brand = "Hugo Boss";
      else if (b === "LOUIS VUITTON") brand = "Louis Vuitton";
      else if (b === "NEW BALANCE") brand = "New Balance";
      else if (b === "ALEXANDER MCQUEEN") brand = "Alexander McQueen";
      else if (b === "TOMMY HILFIGER") brand = "Tommy Hilfiger";
      else if (b === "GOLDEN GOOSE") brand = "Golden Goose";
      else if (b === "ON CLOUD") brand = "On Cloud";
      else if (b === "ONITSUKA" || b === "ONITSUKA TIGER") brand = "Onitsuka Tiger";
      else if (b === "REEBOK") brand = "Reebok";
      else if (b === "DIESEL") brand = "Diesel";
      else if (b === "ALO") brand = "Alo";
      else if (b === "ADISTAR" || b === "SANDALIAS ADIDAS") brand = "Adidas";
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
  if (
    upper.includes("DAMA Y CABALLERO") ||
    upper.includes("DAMA/CABALLERO") ||
    upper.includes("DAMA Y CAB") ||
    upper.includes("DAMA  Y CABALLERO")
  ) {
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

  // Extract custom size range if present (e.g. 36 AL 40, 36-37-38-39, 40-41-42)
  let customSizes = null;
  const sizeListMatch = remainder.match(/\b(\d{2}(?:-\d{2})+)\b/);
  const sizeRangeMatch = remainder.match(/(\d{2})\s*(?:AL|A|-)\s*(\d{2})/i);

  if (sizeListMatch) {
    customSizes = sizeListMatch[1].split("-");
    remainder = remainder.replace(sizeListMatch[0], "").trim();
  } else if (sizeRangeMatch) {
    const start = parseInt(sizeRangeMatch[1], 10);
    const end = parseInt(sizeRangeMatch[2], 10);
    customSizes = [];
    for (let s = start; s <= end; s++) {
      customSizes.push(s.toString());
    }
    remainder = remainder.replace(sizeRangeMatch[0], "").trim();
  }

  // Remove "II" if at the very end of remainder
  remainder = remainder.replace(/\bII$/i, "").trim();

  // Check multi-word colors first
  let colorFound = null;
  for (const [key, val] of Object.entries(COLOR_EXPANSIONS)) {
    if (key.includes(" ")) {
      const reg = new RegExp(`\\b${key}\\b`, "i");
      if (reg.test(remainder)) {
        colorFound = val;
        remainder = remainder.replace(reg, "").trim();
        break;
      }
    }
  }

  // Find color abbreviations and words
  const words = remainder.split(/\s+/);
  const cleanWords = [];
  for (const w of words) {
    const uw = w.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (
      uw === "DAMA" ||
      uw === "CABALLERO" ||
      uw === "HOMBRE" ||
      uw === "Y" ||
      uw === "TALLAS" ||
      uw === "DISPONIBLE" ||
      uw === "DISPONIBLES" ||
      uw === "DEL" ||
      uw === "EN" ||
      uw === "LA" ||
      uw === "IMAGEN" ||
      uw === "II"
    ) {
      continue;
    }
    if (!colorFound && COLOR_EXPANSIONS[uw]) {
      colorFound = COLOR_EXPANSIONS[uw];
    } else if (w.trim()) {
      cleanWords.push(w.trim());
    }
  }

  let modelName = cleanWords.join(" ").trim();
  if (!modelName) {
    if (brandPrefix.includes("CHANCLA")) modelName = "Slide Chancla";
    else if (brandPrefix.includes("GUAYO")) modelName = "Guayo Soccer";
    else if (brandPrefix.includes("BOTA")) modelName = "Bota Táctica";
    else if (brand === "Promociones") {
      if (customSizes && customSizes.length > 0) {
        modelName = `Promo Selección (Tallas ${customSizes[0]} a ${customSizes[customSizes.length - 1]})`;
      } else {
        modelName = "Promo Selección";
      }
    }
    else if (brand === "Hugo Boss") modelName = "Urban Leather";
    else if (brand === "Armani Exchange") modelName = "Urban Leather";
    else if (brand === "Timberland") modelName = "Classic Boot";
    else modelName = "Classic";
  } else {
    if (brandPrefix.includes("GUAYO") && !modelName.toLowerCase().includes("guayo")) {
      modelName = `Guayo ${modelName}`;
    } else if (brandPrefix.includes("CHANCLA") && !modelName.toLowerCase().includes("chancla")) {
      modelName = `Chancla ${modelName}`;
    } else if (brandPrefix.includes("BOTA") && !modelName.toLowerCase().includes("bota")) {
      modelName = `Bota ${modelName}`;
    } else if (brandPrefix === "ADISTAR" && !modelName.toLowerCase().includes("adistar")) {
      modelName = `Adistar ${modelName}`;
    } else if (brandPrefix === "SANDALIAS ADIDAS" && !modelName.toLowerCase().includes("sandalias")) {
      modelName = `Sandalias ${modelName}`;
    }
  }

  // Handle distinct Samba Habana BT1333 monochromatic cream
  if (filename.includes("SAMBA DAMA HABANA $80.000")) {
    colorFound = "Crema Monocromático";
  }

  // Format model name capitalization
  modelName = modelName
    .split(" ")
    .map((w) => {
      const uw = w.toUpperCase();
      if (
        [
          "AF1", "SB", "OG", "TN", "V2K", "P-6000", "P6000", "P7000",
          "F50", "R1", "R3", "R4", "R5", "R11", "R13", "SL", "DN", "DN2", "ACG", "V5", "FF", "FR", "BYD", "TTNM", "ST"
        ].includes(uw)
      ) {
        return uw;
      }
      if (uw === "AGC") return "ACG";
      if (uw === "MAX90") return "Max 90";
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

  let id = `${slugify(`${brand}-${modelName}`)}-${index + 1}`;
  if (existingIds.has(id)) {
    id = `${id}-${Date.now()}`;
  }
  existingIds.add(id);

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

function cleanUpExistingProducts(products) {
  console.log("Deduplicating and refining existing catalog products...");

  const existingMap = new Map(products.map((p) => [p.id, p]));

  // Disambiguate inverted Superstar colorways
  if (existingMap.has("adidas-superstar-151")) {
    const p = existingMap.get("adidas-superstar-151");
    p.color = "Negro con Blanco (Cordones Negros)";
    p.description = "Zapatilla Adidas Superstar para Unisex en color Negro con Blanco y cordones negros.";
  }
  if (existingMap.has("adidas-superstar-152")) {
    const p = existingMap.get("adidas-superstar-152");
    p.color = "Negro con Blanco (Cordones Blancos)";
    p.description = "Zapatilla Adidas Superstar para Unisex en color Negro con Blanco y cordones blancos.";
  }

  // Disambiguate Samba Habana
  if (existingMap.has("adidas-samba-137")) {
    const p = existingMap.get("adidas-samba-137");
    p.color = "Habana con Suela Caramelo";
    p.description = "Zapatilla Adidas Samba para Dama en color Habana / Beige con suela caramelo clásica y rayas blancas.";
  }

  // Disambiguate Jordan R4 Sail Off-White vs Black Cat
  if (existingMap.has("jordan-r4-54")) {
    const p = existingMap.get("jordan-r4-54");
    p.name = "R4 Retro Off-White Sail";
    p.color = "Crema / Sail";
    p.description = "Zapatilla Jordan R4 Retro Off-White Sail para Caballero en color Crema / Sail. Acabados premium y suela Air translúcida.";
  }
  if (existingMap.has("jordan-r4-55")) {
    const p = existingMap.get("jordan-r4-55");
    p.name = "R4 Retro Black Cat";
    p.color = "Total Black (Negro)";
    p.description = "Zapatilla Jordan R4 Retro Black Cat para Caballero en color Total Black. Silueta icónica en ante negro azabache.";
  }

  // Disambiguate Hugo Boss silhouettes
  if (existingMap.has("hugo-boss-urban-leather-27")) {
    const p = existingMap.get("hugo-boss-urban-leather-27");
    p.name = "Parkour Retro Runner";
    p.color = "Azul con Gris";
  }
  if (existingMap.has("hugo-boss-urban-leather-28")) {
    const p = existingMap.get("hugo-boss-urban-leather-28");
    p.name = "Saturn Geometric Runner";
    p.color = "Azul Marino con Blanco";
  }
  if (existingMap.has("hugo-boss-urban-leather-30")) {
    const p = existingMap.get("hugo-boss-urban-leather-30");
    p.name = "Classic Suede Runner";
    p.color = "Gris Claro con Marrón";
  }
  if (existingMap.has("hugo-boss-urban-leather-31")) {
    const p = existingMap.get("hugo-boss-urban-leather-31");
    p.name = "Parkour Retro Runner";
    p.color = "Blanco con Verde Esmeralda";
  }
  if (existingMap.has("hugo-boss-urban-leather-34")) {
    const p = existingMap.get("hugo-boss-urban-leather-34");
    p.name = "Parkour Monogram Runner";
    p.color = "Gris Oscuro con Blanco";
  }
  if (existingMap.has("hugo-boss-urban-leather-35")) {
    const p = existingMap.get("hugo-boss-urban-leather-35");
    p.name = "Bulton Chunky Runner";
    p.color = "Azul Marino con Suela Gris";
  }
  if (existingMap.has("hugo-boss-urban-leather-37")) {
    const p = existingMap.get("hugo-boss-urban-leather-37");
    p.name = "Parkour Monogram Runner";
    p.color = "Negro con Gris";
  }
  if (existingMap.has("hugo-boss-urban-leather-38")) {
    const p = existingMap.get("hugo-boss-urban-leather-38");
    p.name = "Chunky Retro Runner";
    p.color = "Gris Monocromático";
  }
  if (existingMap.has("hugo-boss-urban-leather-42")) {
    const p = existingMap.get("hugo-boss-urban-leather-42");
    p.name = "Saturn Geometric Runner";
    p.color = "Negro con Suela Caramelo";
  }
  if (existingMap.has("hugo-boss-urban-leather-43")) {
    const p = existingMap.get("hugo-boss-urban-leather-43");
    p.name = "Chunky Embossed Runner";
    p.color = "Negro con Dorado";
  }
  if (existingMap.has("hugo-boss-urban-leather-44")) {
    const p = existingMap.get("hugo-boss-urban-leather-44");
    p.name = "Saturn Geometric Runner";
    p.color = "Total Black";
  }
  if (existingMap.has("hugo-boss-urban-leather-45")) {
    const p = existingMap.get("hugo-boss-urban-leather-45");
    p.name = "Chunky Suede Runner";
    p.color = "Total Black Monocromático";
  }

  // Disambiguate New Balance 574
  if (existingMap.has("new-balance-574-65")) {
    const p = existingMap.get("new-balance-574-65");
    p.color = "Negro con Dorado";
  }
  if (existingMap.has("new-balance-574-66")) {
    const p = existingMap.get("new-balance-574-66");
    p.color = "Negro Clásico";
  }

  // Disambiguate Nike Zoom
  if (existingMap.has("nike-zoom-88")) {
    const p = existingMap.get("nike-zoom-88");
    p.name = "Zoom Sport Dama";
    p.gender = "mujer";
    p.sizes = ["36", "37", "38", "39", "40"];
  }
  if (existingMap.has("nike-zoom-105")) {
    const p = existingMap.get("nike-zoom-105");
    p.name = "Zoom Classic Unisex";
    p.gender = "unisex";
    p.sizes = ["36", "37", "38", "39", "40", "41", "42"];
  }

  // Disambiguate Promo Sheets
  if (existingMap.has("promociones-promo-seleccion-114")) {
    existingMap.get("promociones-promo-seleccion-114").name = "Promo Selección Lote 1";
  }
  if (existingMap.has("promociones-promo-seleccion-115")) {
    existingMap.get("promociones-promo-seleccion-115").name = "Promo Selección Lote 2";
  }
  if (existingMap.has("promociones-promo-seleccion-116")) {
    existingMap.get("promociones-promo-seleccion-116").name = "Promo Selección Lote 3";
  }
  if (existingMap.has("promociones-guayo-soccer-118")) {
    existingMap.get("promociones-guayo-soccer-118").name = "Guayo Soccer Promo Lote 1";
  }
  if (existingMap.has("promociones-guayo-soccer-119")) {
    existingMap.get("promociones-guayo-soccer-119").name = "Guayo Soccer Promo Lote 2";
  }

  // Disambiguate Nike ST Glow colors
  if (existingMap.has("nike-st-glow-1788539520882")) {
    existingMap.get("nike-st-glow-1788539520882").color = "Negro / Blanco / Naranja";
  }
  if (existingMap.has("nike-st-glow")) {
    existingMap.get("nike-st-glow").color = "Blanco";
  }

  // Disambiguate Chanclas
  if (existingMap.has("nike-slide-chancla-19")) {
    existingMap.get("nike-slide-chancla-19").name = "Chancla Slide Swoosh";
  }
  if (existingMap.has("nike-chancla-ii-20")) {
    existingMap.get("nike-chancla-ii-20").name = "Chancla Slide Classic Logo";
  }

  return products;
}

async function run() {
  console.log("Loading existing products from:", productsJsonPath);
  let existingProducts = [];
  if (fs.existsSync(productsJsonPath)) {
    existingProducts = JSON.parse(fs.readFileSync(productsJsonPath, "utf8"));
  }
  console.log(`Currently registered products in catalog: ${existingProducts.length}`);

  // 1. Clean up & refine existing products
  existingProducts = cleanUpExistingProducts(existingProducts);

  // Build a map of registered image hashes -> product
  const registeredHashMap = new Map();
  // Known remote image hash for Adidas Samba Clásica
  registeredHashMap.set("3ed4a1c3498e3504c428840d39bdaff1", null);

  for (const p of existingProducts) {
    for (const img of (p.images || [])) {
      if (img.startsWith("/")) {
        const localPath = path.join(rootDir, "public", img);
        if (fs.existsSync(localPath)) {
          registeredHashMap.set(computeFileHash(localPath), p);
        }
      }
    }
  }

  console.log(`Total active image hashes in catalog: ${registeredHashMap.size}`);

  console.log("\nReading files from:", srcImagesDir);
  const allFiles = fs.readdirSync(srcImagesDir);
  const namedFiles = allFiles.filter((f) => !f.startsWith("WhatsApp") && /\.(jpe?g|png|webp)$/i.test(f));

  console.log(`Found ${namedFiles.length} named sneaker files.`);

  // 2. Identify new files vs existing, and separate multi-photo secondary images (II, (2), (3))
  const filesToAdd = [];
  const secondaryPhotos = [];
  const skippedFiles = [];
  const batchSeenHashes = new Map();

  for (const f of namedFiles) {
    const filePath = path.join(srcImagesDir, f);
    const hash = computeFileHash(filePath);

    if (registeredHashMap.has(hash)) {
      skippedFiles.push({ file: f, reason: "Already registered in catalog / public images" });
    } else if (batchSeenHashes.has(hash)) {
      skippedFiles.push({ file: f, reason: `Exact image duplicate of ${batchSeenHashes.get(hash)}` });
    } else {
      batchSeenHashes.set(hash, f);

      // Check if it is a secondary photo variant: ending in II or (2) or (3)
      const isSecondary = /\s+(II|\(2\)|\(3\))\s*(\$\d+|\.jpe?g)/i.test(f) || /\bII\b/i.test(f.replace(/\$\s*[\d.]+/g, ""));
      if (isSecondary) {
        secondaryPhotos.push(f);
      } else {
        filesToAdd.push(f);
      }
    }
  }

  console.log(`Skipped (already in catalog or identical hash duplicate): ${skippedFiles.length}`);
  skippedFiles.forEach(s => console.log(`  - ${s.file} (${s.reason})`));
  console.log(`Primary new sneaker models to add: ${filesToAdd.length}`);
  console.log(`Secondary photos to merge into matching sneaker cards: ${secondaryPhotos.length}`);

  const existingIds = new Set(existingProducts.map((p) => p.id));
  const startIndex = existingProducts.length;

  // 3. Parse and create new product objects for primary files
  const newProducts = filesToAdd.map((filename, i) => {
    return parseProduct(filename, startIndex + i, existingIds);
  });

  // Map to find newly created products by source filename base
  const newProductMap = new Map();
  filesToAdd.forEach((filename, i) => {
    const baseKey = filename.replace(/\s+(II|\(2\)|\(3\))\b/i, "").toLowerCase().replace(/\s+/g, " ").trim();
    newProductMap.set(baseKey, newProducts[i]);
  });

  // 4. Merge secondary photos into their matching product (either new or existing)
  for (const secFile of secondaryPhotos) {
    const srcPath = path.join(srcImagesDir, secFile);
    const ext = path.extname(secFile).toLowerCase() || ".jpeg";
    const cleanBase = secFile
      .replace(/\s+(II|\(2\)|\(3\))\b/i, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    // Check in newly created products
    let targetProduct = newProductMap.get(cleanBase);

    // If not found in new, check existing products
    if (!targetProduct) {
      if (secFile.includes("BOTA UNDER ARMOUR CABALLERO NEGRA II")) {
        targetProduct = existingProducts.find(p => p.id === "under-armour-bota-tactica-157");
      } else if (secFile.includes("NIKE AF1 CABALLERO BLANCA II")) {
        targetProduct = newProducts.find(p => p.brand === "Nike" && p.name.includes("AF1") && p.color === "Blanco");
      } else if (secFile.includes("PROMO CABALLERO II")) {
        targetProduct = newProducts.find(p => p.brand === "Promociones" && p.gender === "hombre");
      }
    }

    if (targetProduct) {
      const secSafeFilename = `${slugify(`${targetProduct.brand}-${targetProduct.name}-${targetProduct.color || ""}-photo2-${Date.now()}`)}${ext}`;
      const destPath = path.join(destImagesDir, secSafeFilename);
      fs.copyFileSync(srcPath, destPath);
      targetProduct.images.push(`/zapatillas/${secSafeFilename}`);
      console.log(`Merged secondary photo ${secFile} -> ${targetProduct.brand} ${targetProduct.name} (ID: ${targetProduct.id})`);
    } else {
      // If no exact parent found, register as its own product
      console.log(`No direct parent found for ${secFile}, creating distinct product...`);
      const prod = parseProduct(secFile, startIndex + newProducts.length, existingIds);
      newProducts.push(prod);
    }
  }

  // 5. Update catalog
  const updatedCatalog = [...existingProducts, ...newProducts];
  fs.writeFileSync(productsJsonPath, JSON.stringify(updatedCatalog, null, 2), "utf8");
  console.log(`\nCatalog successfully updated! Total products now: ${updatedCatalog.length}`);

  // Summary by Brand
  const brandStats = {};
  updatedCatalog.forEach((p) => {
    brandStats[p.brand] = (brandStats[p.brand] || 0) + 1;
  });
  console.log("\nUpdated Brand Distribution:", brandStats);

  // Price verification of newly added items
  console.log("\nSample Newly Added Products (Cost + 45.000 = Sale Price):");
  newProducts.slice(0, 10).forEach((p) => {
    console.log(`- [${p.brand}] ${p.name} | ${p.gender} | ${p.color || "Estándar"} | Tallas: ${p.sizes.join(",")} | Compra: $${p.costPrice?.toLocaleString("es-CO")} -> Venta: $${p.price.toLocaleString("es-CO")}`);
  });
}

run().catch((err) => {
  console.error("Error syncing products:", err);
  process.exit(1);
});
