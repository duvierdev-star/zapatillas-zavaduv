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

// Compound multi-word colors (checked first via regex)
const COMPOUND_COLORS = [
  { match: /BLANCA\s+NEGRO\s+Y\s+ROJA/i, color: "Blanco / Negro / Rojo" },
  { match: /BLANCA\s+NEGRA\s+Y\s+ROJO/i, color: "Blanco / Negro / Rojo" },
  { match: /BLANCA\s+NEGRA\s+Y\s+VERDE/i, color: "Blanco / Negro / Verde" },
  { match: /BLANCA\s+NEGRO\s+Y\s+NARANJA/i, color: "Blanco / Negro / Naranja" },
  { match: /BLANCA\s+NEGRA\s+Y\s+AMARILLO/i, color: "Blanco / Negro / Amarillo" },
  { match: /NEGRA\s+BLANCO\s+Y\s+LILA/i, color: "Negro / Blanco / Lila" },
  { match: /NEGRA\s+BLANCA\s+Y\s+ROJA/i, color: "Negro / Blanco / Rojo" },
  { match: /NEGRA\s+BLANCA\s+Y\s+FUCSIA/i, color: "Negro / Blanco / Fucsia" },
  { match: /NEGRA\s+BLANCA\s+Y\s+ROJO/i, color: "Negro / Blanco / Rojo" },
  { match: /GRIS\s+BLANCA\s+Y\s+AMARILLO/i, color: "Gris / Blanco / Amarillo" },
  { match: /GRIS\s+AZUL\s+Y\s+ROJO/i, color: "Gris / Azul / Rojo" },
  { match: /AZUL\s+BLANCA\s+Y\s+ROJO/i, color: "Azul / Blanco / Rojo" },
  { match: /BLANCO\s+CON\s+ROJO\s+Y\s+AZUL/i, color: "Blanco / Rojo / Azul" },
  { match: /BLANCA\s+LEOPARDO/i, color: "Blanco Leopardo Nieve" },

  { match: /AZUL\s+CON\s+GRIS/i, color: "Azul con Gris" },
  { match: /AZUL\s+Y\s+GRIS/i, color: "Azul con Gris" },
  { match: /BLANCA\s+CON\s+NEGRO/i, color: "Blanco con Negro" },
  { match: /BLANCA\s+Y\s+NEGRO/i, color: "Blanco con Negro" },
  { match: /BLANCA\s+Y\s+NEGRA/i, color: "Blanco con Negro" },
  { match: /BLANCO\s+Y\s+NEGRO/i, color: "Blanco con Negro" },
  { match: /NEGRA\s+Y\s+BLANCO/i, color: "Negro con Blanco" },
  { match: /NEGRA\s+Y\s+BLANCA/i, color: "Negro con Blanco" },
  { match: /NEGRA\s+CON\s+BLANCO/i, color: "Negro con Blanco" },
  { match: /CELESTE\s+CON\s+GRIS/i, color: "Celeste con Gris" },
  { match: /HAVANA\s+CON\s+GRIS/i, color: "Habana con Gris" },
  { match: /HAVANA\s+Y\s+ROJO/i, color: "Habana con Rojo" },
  { match: /HAVANA\s+Y\s+CAFE/i, color: "Habana con Café" },
  { match: /AZUL\s+Y\s+BLANCA/i, color: "Azul con Blanco" },
  { match: /BLANCA\s+Y\s+CELESTE/i, color: "Blanco con Celeste" },
  { match: /BLANCA\s+CELESTE/i, color: "Blanco con Celeste" },
  { match: /BLANCA\s+Y\s+ROSA/i, color: "Blanco con Rosa" },
  { match: /BLANCA\s+Y\s+VERDE/i, color: "Blanco con Verde" },
  { match: /BLANCA\s+Y\s+GRIS/i, color: "Blanco con Gris" },
  { match: /BLANCA\s+Y\s+LILA/i, color: "Blanco con Lila" },
  { match: /BALNCA\s+Y\s+LILA/i, color: "Blanco con Lila" },
  { match: /BLANCA\s+Y\s+NARANJA/i, color: "Blanco con Naranja" },
  { match: /NEGRA\s+CON\s+GRIS/i, color: "Negro con Gris" },
  { match: /NEGRA\s+Y\s+GRIS/i, color: "Negro con Gris" },
  { match: /GRIS\s+Y\s+NEGRA/i, color: "Gris con Negro" },
  { match: /NEGRA\s+Y\s+LILA/i, color: "Negro con Lila" },
  { match: /NEGRA\s+LILA/i, color: "Negro con Lila" },
  { match: /NEGRA\s+Y\s+ROJA/i, color: "Negro con Rojo" },
  { match: /NEGRA\s+Y\s+ROJO/i, color: "Negro con Rojo" },
  { match: /NEGRO\s+Y\s+CELESTE/i, color: "Negro con Celeste" },
  { match: /VERDE\s+Y\s+HAVANA/i, color: "Verde con Habana" },
  { match: /CAFE\s+Y\s+NEGRO/i, color: "Café con Negro" },
  { match: /CAFE\s+Y\s+BLANCA/i, color: "Café con Blanco" },
  { match: /CAFE\s+ROJIZO/i, color: "Café Rojizo" },
  { match: /GRIS\s+Y\s+BLANCA/i, color: "Gris con Blanco" },
  { match: /GRIS\s+Y\s+VERDE/i, color: "Gris con Verde" },
  { match: /GRIS\s+Y\s+ROSA/i, color: "Gris con Rosa" },
  { match: /CELESTE\s+Y\s+AZUL/i, color: "Celeste con Azul" },
  { match: /AZUL\s+Y\s+NEGRO/i, color: "Azul con Negro" },
  { match: /NEGRA\s+Y\s+AZUL/i, color: "Negro con Azul" },
  { match: /CELESTE\s+Y\s+NEGRO/i, color: "Celeste con Negro" },
  { match: /AZUL\s+Y\s+ROSA/i, color: "Azul con Rosa" },
  { match: /NARANJA\s+Y\s+NEGRO/i, color: "Naranja con Negro" },
  { match: /ROSA\s+Y\s+BLANCA/i, color: "Rosa con Blanco" },
  { match: /LILA\s+Y\s+ROSA/i, color: "Lila con Rosa" },
  { match: /NEGRA\s+Y\s+VERDE/i, color: "Negro con Verde" },
  { match: /BLANCA\s+Y\s+AZUL/i, color: "Blanco con Azul" },
  { match: /NEGRA\s+Y\s+CAFE/i, color: "Negro con Café" },
  { match: /AZUL\s+Y\s+VERDE/i, color: "Azul con Verde" },
  { match: /AZUL\s+TURQUI/i, color: "Azul Turquí" },
  { match: /AZUL\s+OSCURO/i, color: "Azul Oscuro" },
  { match: /CAFE\s+OSCURO/i, color: "Café Oscuro" },
  { match: /TOTAL\s+BLACK/i, color: "Total Black (Todo Negro)" },
  { match: /GRIS\s+CLARO/i, color: "Gris Claro" },
  { match: /PALO\s+DE\s+ROSA/i, color: "Palo de Rosa" }
];

const SINGLE_COLORS = {
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
  "HAVANA": "Habana / Beige",
  "LILA": "Lila",
  "FUCSIA": "Fucsia",
  "PLATEADA": "Plateada / Silver",
  "PLATEADO": "Plateado / Silver",
  "AMARILLO": "Amarillo",
  "AMARILLA": "Amarillo",
  "DORADO": "Dorado",
  "VINO": "Vinotinto",
  "VINOTINTO": "Vinotinto",

  // Supplier abbreviations
  "HA": "Hueso con Azul",
  "HR": "Hueso con Rojo",
  "HV": "Hueso con Verde",
  "BN": "Blanco con Negro",
  "BA": "Blanco con Azul",
  "BGA": "Blanco / Gris / Azul",
  "HNA": "Hueso / Negro / Amarillo",
  "NGR": "Negro / Gris / Rojo",
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
  "BNR": "Blanco / Negro / Rojo",
  "BHN": "Blanco / Hueso / Negro",
  "AV": "Azul con Verde",
  "BH": "Blanco con Hueso",
  "HN": "Hueso con Negro",
  "BG": "Blanco con Gris",
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
  "SKEACHERS",
  "FILA",
  "TIMBERLAND",
  "LACOSTE",
  "REEBOK",
  "DIESEL",
  "ALO",
  "SALOMON",
  "HOKA",
  "CHAMPIONS ESSENTIALS",
  "CHAMPION",
  "SANDALIA MIU MIU",
  "SANDALIA PRADA",
  "CHANCLA NIKE",
  "CHANCLA CABALLERO",
  "CHANCLA DAMA",
  "CHANCLA",
  "PROMO"
];

const MODEL_FORMATS = {
  "ADIZERO": "Adizero",
  "ASPYRE": "Aspyre",
  "DEFIAN": "Defiant Speed",
  "DURAMO": "Duramo",
  "RESPONSE": "Response Super",
  "SAMBA": "Samba OG",
  "SAMBA CLASICA": "Samba Clásica",
  "SUPERMAGNA": "Supermagna",
  "SUPERNOVA": "Supernova",
  "SUPERSTAR": "Superstar",
  "R11": "Air Jordan 11 Retro",
  "R4": "Air Jordan 4 Retro",
  "R4 LOW": "Air Jordan 4 RM Low",
  "AF1": "Air Force 1",
  "AIR MAX BRAZEN": "Air Max Brazen",
  "AIR MAX90": "Air Max 90",
  "LÍQUID": "Air Max Dn Liquid",
  "LIQUID": "Air Max Dn Liquid",
  "P6000": "P-6000",
  "SB DUNK": "SB Dunk Low",
  "SB GAMUZA": "SB Dunk Low Gamuza",
  "SB LV": "SB Dunk Low x Louis Vuitton",
  "SHOX": "Shox TL",
  "TN": "Air Max Plus TN",
  "TRAIL": "Pegasus Trail",
  "ZOOM": "Zoom Vomero",
  "740": "740 Retro Runner",
  "ELITE": "Elite Runner",
  "FRESH FOAM": "Fresh Foam X",
  "CUSHLON": "Cushlon Comfort",
  "SKY": "Sky Arch Walk",
  "XT": "XT-6 S/LAB",
  "NANO": "Nano X Cross Training",
  "SKATE": "LV Skate Sneaker"
};

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

  // Price match
  const priceMatch = clean.match(/\$\s*(\d{1,3}(?:\.\d{3})+|\d{5,6})|(?:\b|\s)(\d{1,3}\.000)\b/);
  let costPrice = 75000;
  if (priceMatch) {
    const rawDigits = (priceMatch[1] || priceMatch[2]).replace(/\./g, "");
    costPrice = parseInt(rawDigits, 10);
  }

  // Pricing rule:
  // Chanclas: cost + 20.000 COP
  // Sandalias: cost + 25.000 COP
  // Sneakers / calzado estándar: cost + 45.000 COP
  const isChancla = /chancla/i.test(clean);
  const isSandalia = /sandalia|zandalia/i.test(clean);
  let profit = 45000;
  if (isChancla) profit = 20000;
  else if (isSandalia) profit = 25000;

  const salePrice = costPrice + profit;

  // Clean raw string without price and without duplicate numbering (2), (3), II
  let raw = clean
    .replace(/\$\s*(\d{1,3}(?:\.\d{3})+|\d{5,6})|(?:\b|\s)(\d{1,3}\.000)\b/g, "")
    .replace(/\(\d+\)/g, "")
    .trim();

  // Detect Brand
  let brand = "Otras";
  let brandPrefix = "";

  const upperRaw = raw.toUpperCase();
  for (const b of BRANDS) {
    if (upperRaw.startsWith(b)) {
      brandPrefix = b;
      if (b.startsWith("PROMO")) brand = "Promociones";
      else if (b.startsWith("CHANCLA")) brand = "Nike";
      else if (b.startsWith("SANDALIA MIU MIU")) brand = "Miu Miu";
      else if (b.startsWith("SANDALIA PRADA")) brand = "Prada";
      else if (b.startsWith("CHAMPION")) brand = "Champion";
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
      else if (b === "SALOMON") brand = "Salomon";
      else if (b === "HOKA") brand = "Hoka";
      else if (b === "SKEACHERS" || b === "SKECHERS") brand = "Skechers";
      else if (b === "ADISTAR" || b === "SANDALIAS ADIDAS") brand = "Adidas";
      else brand = b.charAt(0) + b.slice(1).toLowerCase();
      break;
    }
  }

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

  // Detect custom size range if present
  let customSizes = null;
  const sizesMatch = raw.match(/TALLAS?\s+DISPONIBLES?\s+(?:DEL\s+)?([0-9\sA-Za-z-]+)/i);
  if (sizesMatch) {
    const sStr = sizesMatch[1].trim();
    if (/\b\d{2}\s*(?:AL|A)\s*\d{2}\b/i.test(sStr)) {
      const rm = sStr.match(/(\d{2})\s*(?:AL|A)\s*(\d{2})/i);
      const start = parseInt(rm[1], 10);
      const end = parseInt(rm[2], 10);
      customSizes = [];
      for (let s = start; s <= end; s++) customSizes.push(s.toString());
    } else if (/\b\d{2}-\d{2}\b/.test(sStr) && !/\d{2}-\d{2}-\d{2}/.test(sStr)) {
      const parts = sStr.split("-").map(s => s.trim());
      const n1 = parseInt(parts[0], 10);
      const n2 = parseInt(parts[1], 10);
      if (n2 - n1 >= 3) {
        customSizes = [];
        for (let s = n1; s <= n2; s++) customSizes.push(s.toString());
      } else {
        customSizes = [n1.toString(), n2.toString()];
      }
    } else if (/\d{2}/.test(sStr)) {
      customSizes = sStr.match(/\b\d{2}\b/g);
    }
    raw = raw.replace(sizesMatch[0], "").trim();
  }

  // Detect Model and Colors
  let remainder = raw;
  if (brandPrefix) {
    remainder = remainder.slice(brandPrefix.length).trim();
  }

  // Remove gender and noise tokens
  remainder = remainder
    .replace(/\b(DAMA\s+Y\s+CABALLERO|DAMA\/CABALLERO|DAMA\s+Y\s+CAB|DAMA|CABALLERO|HOMBRE|TALLAS?|DISPONIBLES?|DEL|EN|LA|IMAGEN|SOLO|TALLA)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Find color
  let colorFound = null;
  for (const cc of COMPOUND_COLORS) {
    if (cc.match.test(remainder)) {
      colorFound = cc.color;
      remainder = remainder.replace(cc.match, " ").trim();
      break;
    }
  }

  if (!colorFound) {
    const tokens = remainder.split(/\s+/);
    for (const t of tokens) {
      const ut = t.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (SINGLE_COLORS[ut]) {
        colorFound = SINGLE_COLORS[ut];
        remainder = remainder.replace(new RegExp(`\\b${t}\\b`, "i"), " ").trim();
        break;
      }
    }
  }

  // Image-verified color overrides for items without color in title
  if (filename === "ADIDAS SUPERSTAR DAMA $70.000.jpeg") colorFound = "Leopardo Clásico (Marrón)";
  else if (filename === "JORDAN R4 LOW CABALLERO $95.000.jpeg") colorFound = "Negro con Crema";
  else if (filename === "LECOQ SPORTIF CABALLERO 75.000.jpeg") colorFound = "Negro con Coral / Rojo (BT3688)";
  else if (filename === "NIKE P6000 DAMA $85.000.jpeg") colorFound = "Rosa con Café";
  else if (filename === "NIKE SB GAMUZA DAMA $75.000.jpeg") colorFound = "Café Moka con Blanco (BT4579)";
  else if (filename === "SALOMON XT CABALLERO $105.000.jpeg") colorFound = "Negro con Blanco y Rojo";
  else if (filename === "TIMBERLAND LV CABALLERO $95.000.jpeg") colorFound = "Total Black Monograma LV (BT4522)";
  else if (filename.startsWith("CHANCLA NIKE $40.000")) colorFound = "Rosa con Negro";

  // Clean remainder words for model name
  remainder = remainder
    .replace(/\b(DAMA|CABALLERO|HOMBRE|TALLAS?|DISPONIBLES?|DEL|EN|LA|IMAGEN|SOLO|TALLA|II)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  let modelName = remainder;
  const upperRem = remainder.toUpperCase();
  for (const [mk, mv] of Object.entries(MODEL_FORMATS)) {
    if (upperRem === mk || upperRem.startsWith(mk + " ") || upperRem.endsWith(" " + mk)) {
      modelName = mv;
      break;
    }
  }

  if (brand === "Champion") modelName = "Essentials Retro";
  else if (isChancla) modelName = "Chancla Slide Swoosh";
  else if (isSandalia) {
    if (brand === "Miu Miu") modelName = "Sandalias Slide Tweed";
    else if (brand === "Prada") modelName = "Sandalias Slide Luxury";
    else modelName = `Sandalias ${modelName || "Slide"}`;
  } else if (brand === "Hoka") modelName = "Transport Vibram";
  else if (brand === "Salomon") modelName = "XT-6 S/LAB";
  else if (filename.includes("TIMBERLAND LV")) modelName = "6-Inch Boot x Louis Vuitton";
  else if (filename.includes("NIKE SB LV")) modelName = "SB Dunk Low x Louis Vuitton";
  else if (brand === "Under Armour" && filename.includes("BOTA")) modelName = "Bota Táctica";
  else if (brand === "Lacoste") modelName = "Carnaby Classic";
  else if (brand === "Le Coq Sportif" && (!modelName || modelName === "Classic")) modelName = "Court Classic";
  else if (brand === "On Cloud") modelName = "Cloud 5";
  else if (brand === "Promociones") {
    let promoSub = raw.replace(/^PROMO\s*/i, "").trim();
    if (customSizes && customSizes.length > 0) {
      if (customSizes.length === 1) promoSub += ` (Talla ${customSizes[0]})`;
      else promoSub += ` (Tallas ${customSizes[0]} a ${customSizes[customSizes.length - 1]})`;
    }
    modelName = `Promo ${promoSub}`.replace(/\s+/g, " ").trim();
  }

  if (!modelName) {
    modelName = "Classic";
  }

  // Format model name capitalization
  modelName = modelName
    .split(" ")
    .map((w) => {
      const uw = w.toUpperCase();
      if (
        [
          "AF1", "SB", "OG", "TN", "V2K", "P-6000", "P6000", "P7000",
          "F50", "R1", "R3", "R4", "R5", "R11", "R13", "SL", "DN", "DN2", "ACG", "V5", "FF", "FR", "BYD", "TTNM", "ST", "RM", "LV", "D&G"
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
  const productType = isChancla ? "Chancla" : isSandalia ? "Sandalia" : "Zapatilla";
  const description = `${productType} ${brand} ${modelName} para ${genderText}${colorText}. Diseño exclusivo, acabados de alta calidad y máxima comodidad para uso diario o deportivo.`;

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

  // Update existing Chanclas to Markup +20.000 COP
  if (existingMap.has("nike-slide-chancla-19")) {
    const p = existingMap.get("nike-slide-chancla-19");
    p.name = "Chancla Slide Swoosh";
    p.price = (p.costPrice || 45000) + 20000;
  }
  if (existingMap.has("nike-chancla-ii-20")) {
    const p = existingMap.get("nike-chancla-ii-20");
    p.name = "Chancla Slide Classic Logo";
    p.price = (p.costPrice || 45000) + 20000;
  }
  if (existingMap.has("puma-slide-chancla-21")) {
    const p = existingMap.get("puma-slide-chancla-21");
    p.name = "Chancla Slide Puma";
    p.price = (p.costPrice || 55000) + 20000;
  }

  // Update existing Sandalias to Markup +25.000 COP
  if (existingMap.has("adidas-classic-477")) {
    const p = existingMap.get("adidas-classic-477");
    p.name = "Sandalias Slide Platform";
    p.price = (p.costPrice || 95000) + 25000;
    p.description = "Sandalia Adidas Slide Platform para Dama en color Café. Diseño exclusivo, confort y estilo veraniego.";
  }
  if (existingMap.has("adidas-classic-478")) {
    const p = existingMap.get("adidas-classic-478");
    p.name = "Sandalias Slide Platform";
    p.price = (p.costPrice || 95000) + 25000;
    p.description = "Sandalia Adidas Slide Platform para Dama en color Negro. Diseño exclusivo, confort y estilo veraniego.";
  }

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
    existingMap.get("hugo-boss-urban-leather-27").name = "Parkour Retro Runner";
    existingMap.get("hugo-boss-urban-leather-27").color = "Azul con Gris";
  }
  if (existingMap.has("hugo-boss-urban-leather-28")) {
    existingMap.get("hugo-boss-urban-leather-28").name = "Saturn Geometric Runner";
    existingMap.get("hugo-boss-urban-leather-28").color = "Azul Marino con Blanco";
  }
  if (existingMap.has("hugo-boss-urban-leather-30")) {
    existingMap.get("hugo-boss-urban-leather-30").name = "Classic Suede Runner";
    existingMap.get("hugo-boss-urban-leather-30").color = "Gris Claro con Marrón";
  }
  if (existingMap.has("hugo-boss-urban-leather-31")) {
    existingMap.get("hugo-boss-urban-leather-31").name = "Parkour Retro Runner";
    existingMap.get("hugo-boss-urban-leather-31").color = "Blanco con Verde Esmeralda";
  }
  if (existingMap.has("hugo-boss-urban-leather-34")) {
    existingMap.get("hugo-boss-urban-leather-34").name = "Parkour Monogram Runner";
    existingMap.get("hugo-boss-urban-leather-34").color = "Gris Oscuro con Blanco";
  }
  if (existingMap.has("hugo-boss-urban-leather-35")) {
    existingMap.get("hugo-boss-urban-leather-35").name = "Bulton Chunky Runner";
    existingMap.get("hugo-boss-urban-leather-35").color = "Azul Marino con Suela Gris";
  }
  if (existingMap.has("hugo-boss-urban-leather-37")) {
    existingMap.get("hugo-boss-urban-leather-37").name = "Parkour Monogram Runner";
    existingMap.get("hugo-boss-urban-leather-37").color = "Negro con Gris";
  }
  if (existingMap.has("hugo-boss-urban-leather-38")) {
    existingMap.get("hugo-boss-urban-leather-38").name = "Chunky Retro Runner";
    existingMap.get("hugo-boss-urban-leather-38").color = "Gris Monocromático";
  }
  if (existingMap.has("hugo-boss-urban-leather-42")) {
    existingMap.get("hugo-boss-urban-leather-42").name = "Saturn Geometric Runner";
    existingMap.get("hugo-boss-urban-leather-42").color = "Negro con Suela Caramelo";
  }
  if (existingMap.has("hugo-boss-urban-leather-43")) {
    existingMap.get("hugo-boss-urban-leather-43").name = "Chunky Embossed Runner";
    existingMap.get("hugo-boss-urban-leather-43").color = "Negro con Dorado";
  }
  if (existingMap.has("hugo-boss-urban-leather-44")) {
    existingMap.get("hugo-boss-urban-leather-44").name = "Saturn Geometric Runner";
    existingMap.get("hugo-boss-urban-leather-44").color = "Total Black";
  }
  if (existingMap.has("hugo-boss-urban-leather-45")) {
    existingMap.get("hugo-boss-urban-leather-45").name = "Chunky Suede Runner";
    existingMap.get("hugo-boss-urban-leather-45").color = "Total Black Monocromático";
  }

  // Disambiguate New Balance 574
  if (existingMap.has("new-balance-574-65")) {
    existingMap.get("new-balance-574-65").color = "Negro con Dorado";
  }
  if (existingMap.has("new-balance-574-66")) {
    existingMap.get("new-balance-574-66").color = "Negro Clásico";
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

  return products;
}

async function run() {
  console.log("Loading existing products from:", productsJsonPath);
  let existingProducts = [];
  if (fs.existsSync(productsJsonPath)) {
    existingProducts = JSON.parse(fs.readFileSync(productsJsonPath, "utf8"));
  }
  console.log(`Currently registered products in catalog: ${existingProducts.length}`);

  // 1. Clean up & refine existing products (including chanclas & sandalias price adjustment)
  existingProducts = cleanUpExistingProducts(existingProducts);

  // Build a map of registered image hashes -> product
  const registeredHashMap = new Map();
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
  console.log(`Primary new models to add: ${filesToAdd.length}`);
  console.log(`Secondary photos to merge into matching cards: ${secondaryPhotos.length}`);

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

  // 4. Merge secondary photos into their matching product
  for (const secFile of secondaryPhotos) {
    const srcPath = path.join(srcImagesDir, secFile);
    const ext = path.extname(secFile).toLowerCase() || ".jpeg";
    const cleanBase = secFile
      .replace(/\s+(II|\(2\)|\(3\))\b/i, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    let targetProduct = newProductMap.get(cleanBase);

    if (!targetProduct) {
      if (secFile.includes("PROMO JORDAN CABALLERO $65.000 TALLAS DISPONIBLES 40")) {
        targetProduct = newProducts.find(p => p.brand === "Promociones" && p.name.includes("Jordan") && p.sizes.includes("40"));
      }
    }

    if (targetProduct) {
      const secSafeFilename = `${slugify(`${targetProduct.brand}-${targetProduct.name}-${targetProduct.color || ""}-photo2-${Date.now()}`)}${ext}`;
      const destPath = path.join(destImagesDir, secSafeFilename);
      fs.copyFileSync(srcPath, destPath);
      targetProduct.images.push(`/zapatillas/${secSafeFilename}`);
      console.log(`Merged secondary photo ${secFile} -> ${targetProduct.brand} ${targetProduct.name} (ID: ${targetProduct.id})`);
    } else {
      console.log(`No direct parent found for ${secFile}, creating distinct product...`);
      const prod = parseProduct(secFile, startIndex + newProducts.length, existingIds);
      newProducts.push(prod);
    }
  }

  // 5. Update catalog: Put new products first so they appear in "Nuevos Ingresos"
  // Assign timestamps so newProducts are in descending order and newer than existing
  const baseTime = Date.now();
  newProducts.forEach((p, idx) => {
    p.createdAt = new Date(baseTime - idx * 60000).toISOString();
  });

  const updatedCatalog = [...newProducts, ...existingProducts];
  fs.writeFileSync(productsJsonPath, JSON.stringify(updatedCatalog, null, 2), "utf8");
  console.log(`\nCatalog successfully updated! Total products now: ${updatedCatalog.length}`);

  // Summary by Brand
  const brandStats = {};
  updatedCatalog.forEach((p) => {
    brandStats[p.brand] = (brandStats[p.brand] || 0) + 1;
  });
  console.log("\nUpdated Brand Distribution:", brandStats);

  // Price verification of newly added items
  console.log("\nSample Newly Added Products:");
  newProducts.slice(0, 15).forEach((p) => {
    console.log(`- [${p.brand}] ${p.name} | ${p.gender} | ${p.color || "Estándar"} | Tallas: ${p.sizes.join(",")} | Compra: $${p.costPrice?.toLocaleString("es-CO")} -> Venta: $${p.price.toLocaleString("es-CO")}`);
  });

  // Chanclas verification
  const chanclas = updatedCatalog.filter(p => /chancla/i.test(p.name));
  console.log(`\nTotal Chanclas in catalog: ${chanclas.length}`);
  chanclas.forEach(c => {
    console.log(`  * ${c.brand} ${c.name} (${c.color}) - Costo: $${c.costPrice?.toLocaleString("es-CO")} -> Venta: $${c.price.toLocaleString("es-CO")} (Ganancia: $${(c.price - (c.costPrice||0)).toLocaleString("es-CO")})`);
  });

  // Sandalias verification
  const sandalias = updatedCatalog.filter(p => /sandalia/i.test(p.name));
  console.log(`\nTotal Sandalias in catalog: ${sandalias.length}`);
  sandalias.forEach(s => {
    console.log(`  * ${s.brand} ${s.name} (${s.color}) - Costo: $${s.costPrice?.toLocaleString("es-CO")} -> Venta: $${s.price.toLocaleString("es-CO")} (Ganancia: $${(s.price - (s.costPrice||0)).toLocaleString("es-CO")})`);
  });
}

run().catch((err) => {
  console.error("Error syncing products:", err);
  process.exit(1);
});
