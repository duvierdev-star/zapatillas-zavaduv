import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import {
  makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  downloadMediaMessage,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import pino from "pino";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const srcImagesDir = path.join(rootDir, "Zapatillas");
const destImagesDir = path.join(rootDir, "public", "zapatillas");
const productsJsonPath = path.join(rootDir, "data", "products.json");
const authFolder = path.join(rootDir, ".wa_auth");

// Target WhatsApp Channel invite code
const CHANNEL_INVITE_CODE = "0029VbDmqrc0VycKJydJvb3q";

// Ensure directories exist
if (!fs.existsSync(srcImagesDir)) fs.mkdirSync(srcImagesDir, { recursive: true });
if (!fs.existsSync(destImagesDir)) fs.mkdirSync(destImagesDir, { recursive: true });
if (!fs.existsSync(authFolder)) fs.mkdirSync(authFolder, { recursive: true });

// -------------------------------------------------------------
// CATALOG PARSER UTILITIES (Reusing the refined store rules)
// -------------------------------------------------------------
const COMPOUND_COLORS = [
  { match: /BLANCA\s+NEGRA\s+Y\s+AGUAMARINA/i, color: "Blanco / Negro / Aguamarina" },
  { match: /VERDE\s+NEGRA\s+NARANJA/i, color: "Verde / Negro / Naranja" },
  { match: /BLANCA\s+GRIS\s+ROSA/i, color: "Blanco / Gris / Rosa" },
  { match: /HAVANA\s+NARANJA\s+Y\s+NEGRA/i, color: "Habana / Naranja / Negro" },
  { match: /NEGRA\s+VERDE\s+Y\s+LILA/i, color: "Negro / Verde / Lila" },
  { match: /AZUL\s+Y\s+AMARILLO\s+ROJIZO/i, color: "Azul / Amarillo Rojizo" },
  { match: /BLANCA\s+AMARILLA/i, color: "Blanco con Amarillo Neón" },
  { match: /BLANCA\s+Y\s+AMARILLO/i, color: "Blanco con Amarillo" },
  { match: /GRIS\s+NARANJA/i, color: "Gris con Naranja" },
  { match: /LILA\s+ROSA/i, color: "Lila con Rosa" },
  { match: /CAFE\s+GRIS/i, color: "Café con Gris" },
  { match: /CAFE\s+NEGRA/i, color: "Café con Negro" },
  { match: /CREMA\s+Y\s+ROJA/i, color: "Crema con Rojo" },
  { match: /NEGRA\s+AZUL/i, color: "Negro con Azul" },
  { match: /NEGRA\s+GRIS/i, color: "Negro con Gris" },
  { match: /BLANCA\s+MORADA/i, color: "Blanco con Morado" },
  { match: /CAFE\s+CREMA/i, color: "Café con Crema" },
  { match: /BLANCA\s+LILA/i, color: "Blanco con Lila" },
  { match: /CAFE\s+Y\s+HAVANA/i, color: "Café con Habana" },
  { match: /BLANCA\s+CAFE/i, color: "Blanco con Café" },
  { match: /BLANCA\s+NEGRA/i, color: "Blanco con Negro" },
  { match: /BLANCA\s+GRIS/i, color: "Blanco con Gris" },
  { match: /CHAROL\s+GRIS\s+Y\s+NEGRO/i, color: "Gris con Negro" },
  { match: /CHAROL\s+ROJA\s+Y\s+NEGRO/i, color: "Rojo con Negro" },
  { match: /HAVANA\s+AZUL/i, color: "Habana con Azul" },
  { match: /HAVANA\s+Y\s+VERDE/i, color: "Habana con Verde" },
  { match: /ROSA\s+Y\s+NEGRA/i, color: "Rosa con Negro" },
  { match: /BLANCA\s+ROSA/i, color: "Blanco con Rosa" },
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
  { match: /TOTAL\s+BLACK/i, color: "Total Black (Todo Negro)" },
  { match: /GRIS\s+CLARO/i, color: "Gris Claro" },
  { match: /PALO\s+DE\s+ROSA/i, color: "Palo de Rosa" }
];

const SINGLE_COLORS = {
  "AGUAMARINA": "Aguamarina",
  "CURUBA": "Curuba Melocotón Pastel",
  "MORADA": "Morado",
  "MORADO": "Morado",
  "CAFES": "Café",
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
  "VINOTINTO": "Vinotinto"
};

const BRANDS = [
  "OFF WHITE",
  "OFF-WHITE",
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
  "R3": "Air Jordan 3 Retro",
  "R1": "Air Jordan 1 Retro",
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
  "VOMERO": "Zoom Vomero 5",
  "VOMERO 5": "Zoom Vomero 5",
  "INITIATOR": "Initiator",
  "BLAZER": "Blazer Mid Plataforma",
  "INDOOR": "Palermo Indoor",
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

function cleanSalesCaption(text) {
  if (!text) return "";
  let clean = text
    // Strip WhatsApp markdown formatting (*bold*, _italic_, ~strikethrough~, `code`)
    .replace(/[*_~`]/g, " ")
    .replace(/\r?\n/g, " ")
    // Remove typical promotional chatter
    .replace(/(?:¡|!)?nuevo(?:s)?\s+ingreso(?:s)?(?:!|¡)?/gi, " ")
    .replace(/disponibles?(?:\s+para\s+entrega\s+inmediata)?/gi, " ")
    .replace(/pide\s+las\s+tuyas/gi, " ")
    .replace(/env[ií]os?\s+a\s+todo\s+el\s+pa[ií]s/gi, " ")
    .replace(/env[ií]os?\s+nacionales/gi, " ")
    .replace(/domicilio(?:s)?\s+gratis/gi, " ")
    .replace(/informaci[oó]n\s+(?:al|por)\s+interno/gi, " ")
    .replace(/escr[ií]benos/gi, " ")
    .replace(/whatsapp:?\s*[\d+\s-]+/gi, " ")
    .replace(/https?:\/\/\S+/gi, " ")
    // Remove emojis
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
  return clean;
}

function parseSneakerFromCaption(captionText, existingIds) {
  const clean = cleanSalesCaption(captionText);

  // Price match (e.g. $85.000, $85000, 85.000, $ 95.000, $135.000)
  const priceMatch = clean.match(/\$\s*(\d{1,3}(?:\.\d{3})+|\d{5,6})|(?:\b|\s)(\d{1,3}\.000)\b/);
  let rawPrice = 130000;
  if (priceMatch) {
    const rawDigits = (priceMatch[1] || priceMatch[2]).replace(/\./g, "");
    rawPrice = parseInt(rawDigits, 10);
  }

  const isChancla = /chancla/i.test(clean);
  const isSandalia = /sandalia|zandalia/i.test(clean);
  let profit = 45000;
  if (isChancla) profit = 20000;
  else if (isSandalia) profit = 25000;

  let costPrice = rawPrice;
  let salePrice = rawPrice;

  // In customer channels, prices >= 110.000 are already customer retail prices!
  // Prices <= 105.000 are wholesale supplier costs.
  if (rawPrice >= 110000) {
    salePrice = rawPrice;
    costPrice = rawPrice - profit;
  } else {
    costPrice = rawPrice;
    salePrice = rawPrice + profit;
  }

  // Clean raw string without price
  let raw = clean
    .replace(/\$\s*(\d{1,3}(?:\.\d{3})+|\d{5,6})|(?:\b|\s)(\d{1,3}\.000)\b/g, "")
    .replace(/\(\d+\)/g, "")
    .replace(/\s+/g, " ")
    .trim();

  // Detect Brand
  let brand = "Otras";
  let brandPrefix = "";
  const upperRaw = raw.toUpperCase();

  for (const b of BRANDS) {
    if (upperRaw.startsWith(b) || upperRaw.includes(` ${b} `) || upperRaw.includes(`${b} `)) {
      brandPrefix = b;
      if (b.startsWith("PROMO")) brand = "Promociones";
      else if (b.startsWith("OFF WHITE") || b.startsWith("OFF-WHITE")) brand = "Off-White";
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

  // Detect Sizes
  let customSizes = null;
  const sizesMatch =
    raw.match(/TALLAS?\s*(?:DISPONIBLES?)?\s*(?:DEL\s+)?([0-9\sA-Za-z-]+)/i) ||
    raw.match(/\b(\d{2})\s*(?:AL|A)\s*(\d{2})\b/i);

  if (sizesMatch) {
    const sStr = (sizesMatch[1] ? sizesMatch[1] : sizesMatch[0]).trim();
    if (/\b\d{2}\s*(?:AL|A)\s*\d{2}\b/i.test(sStr)) {
      const rm = sStr.match(/(\d{2})\s*(?:AL|A)\s*(\d{2})/i);
      const start = parseInt(rm[1], 10);
      const end = parseInt(rm[2], 10);
      customSizes = [];
      for (let s = start; s <= end; s++) customSizes.push(s.toString());
    } else if (/\b\d{2}-\d{2}\b/.test(sStr)) {
      const parts = sStr.split("-").map((s) => s.trim());
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

  // Detect Gender
  let gender = "unisex";
  const upper = raw.toUpperCase();
  if (
    upper.includes("DAMA Y CABALLERO") ||
    upper.includes("DAMA/CABALLERO") ||
    upper.includes("DAMA Y CAB") ||
    upper.includes("UNISEX")
  ) {
    gender = "unisex";
  } else if (upper.includes("DAMA") || upper.includes("MUJER")) {
    gender = "mujer";
  } else if (upper.includes("CABALLERO") || upper.includes("HOMBRE")) {
    gender = "hombre";
  } else if (customSizes && customSizes.length > 0) {
    const nums = customSizes.map(Number).filter((n) => !isNaN(n));
    if (nums.length > 0) {
      const minSize = Math.min(...nums);
      const maxSize = Math.max(...nums);
      if (maxSize <= 40 && minSize <= 37) {
        gender = "mujer";
      } else if (minSize >= 40) {
        gender = "hombre";
      } else {
        gender = "unisex";
      }
    }
  }

  // Detect Remainder for Model and Color
  let remainder = raw;
  if (brandPrefix && remainder.toUpperCase().startsWith(brandPrefix)) {
    remainder = remainder.slice(brandPrefix.length).trim();
  }

  remainder = remainder
    .replace(/\b(DAMA\s+Y\s+CABALLERO|DAMA\/CABALLERO|DAMA\s+Y\s+CAB|DAMA|CABALLERO|HOMBRE|MUJER|UNISEX|TALLAS?|DISPONIBLES?|DEL|EN|LA|IMAGEN|SOLO|TALLA)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Find Color
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

  // Clean remainder words for model name
  remainder = remainder
    .replace(/\b(DAMA|CABALLERO|HOMBRE|MUJER|TALLAS?|DISPONIBLES?|DEL|EN|LA|IMAGEN|SOLO|TALLA|II)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  let modelName = remainder;
  const upperRem = remainder.toUpperCase();
  for (const [mk, mv] of Object.entries(MODEL_FORMATS)) {
    if (upperRem === mk || upperRem.startsWith(mk + " ") || upperRem.endsWith(" " + mk) || upperRem.includes(" " + mk + " ")) {
      modelName = mv;
      break;
    }
  }

  if (brand === "Champion") modelName = "Essentials Retro";
  else if (isChancla) modelName = "Chancla Slide Swoosh";
  else if (isSandalia) modelName = `Sandalias ${modelName || "Slide"}`;
  else if (brand === "Hoka") modelName = "Transport Vibram";
  else if (brand === "Salomon") modelName = "XT-6 S/LAB";
  else if (brand === "Off-White") modelName = "Out Of Office (OOO) Sneaker";

  if (!modelName) modelName = "Classic";

  // Format model name capitalization
  modelName = modelName
    .split(" ")
    .map((w) => {
      const uw = w.toUpperCase();
      if (["AF1", "SB", "OG", "TN", "V2K", "P-6000", "P6000", "R1", "R3", "R4", "R11", "SL", "DN", "ACG", "LV"].includes(uw)) {
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

  const genderText = gender === "mujer" ? "Dama" : gender === "hombre" ? "Caballero" : "Unisex";
  const colorText = colorFound ? ` en color ${colorFound}` : "";
  const productType = isChancla ? "Chancla" : isSandalia ? "Sandalia" : "Zapatilla";
  const description = `${productType} ${brand} ${modelName} para ${genderText}${colorText}. Diseño exclusivo, acabados de alta calidad y máxima comodidad para uso diario o deportivo.`;

  let id = slugify(`${brand}-${modelName}`);
  let counter = 1;
  while (existingIds.has(`${id}-${counter}`)) {
    counter++;
  }
  const finalId = `${id}-${counter}`;
  existingIds.add(finalId);

  return {
    id: finalId,
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
    images: [],
    available: true,
    createdAt: new Date().toISOString()
  };
}

// -------------------------------------------------------------
// SAVE NEW PRODUCT & OPTIONAL GIT PUSH
// -------------------------------------------------------------
function saveProductToCatalog(product, imageBuffer, ext = ".jpeg") {
  // 1. Generate clean filenames
  const safeFilename = `${slugify(`${product.brand}-${product.name}-${product.color || ""}-${Date.now()}`)}${ext}`;
  const rawFilename = `${product.brand.toUpperCase()} ${product.name.toUpperCase()} ${product.gender.toUpperCase()} $${(product.costPrice || 80000).toLocaleString("es-CO")}${ext}`;

  // 2. Save image to public/zapatillas (for web) and Zapatillas/ (for local backup)
  const destPath = path.join(destImagesDir, safeFilename);
  const srcBackupPath = path.join(srcImagesDir, rawFilename);

  fs.writeFileSync(destPath, imageBuffer);
  fs.writeFileSync(srcBackupPath, imageBuffer);

  product.images = [`/zapatillas/${safeFilename}`];

  // 3. Load catalog and unshift
  let catalog = [];
  if (fs.existsSync(productsJsonPath)) {
    try {
      catalog = JSON.parse(fs.readFileSync(productsJsonPath, "utf8"));
    } catch (e) {
      console.error("Error leyendo catalog:", e);
    }
  }

  catalog.unshift(product);
  fs.writeFileSync(productsJsonPath, JSON.stringify(catalog, null, 2), "utf8");

  console.log(`\n🎉 PRODUCTO AGREGADO AL CATÁLOGO CON ÉXITO:`);
  console.log(`   🏷️  Nombre: ${product.brand} ${product.name}`);
  console.log(`   🎨 Color: ${product.color || "Estándar"}`);
  console.log(`   🚻 Género: ${product.gender}`);
  console.log(`   📏 Tallas: ${product.sizes.join(", ")}`);
  console.log(`   💰 Costo: $${product.costPrice?.toLocaleString("es-CO")} -> Venta: $${product.price.toLocaleString("es-CO")}`);
  console.log(`   🖼️  Foto: ${product.images[0]}`);

  // 4. Auto deploy to git / Vercel if enabled
  const autoPush = process.env.AUTO_GIT_PUSH !== "false";
  if (autoPush) {
    try {
      console.log(`\n🚀 Desplegando cambios a Vercel vía Git...`);
      execSync(`git add data/products.json public/zapatillas Zapatillas`, { cwd: rootDir, stdio: "inherit" });
      execSync(`git commit -m "Auto-add: ${product.brand} ${product.name} desde canal WhatsApp"`, { cwd: rootDir, stdio: "inherit" });
      execSync(`git push origin main`, { cwd: rootDir, stdio: "inherit" });
      console.log(`✅ ¡Publicado en GitHub y Vercel exitosamente! La web se actualizará en unos instantes.`);
    } catch (gitErr) {
      console.log(`⚠️ Aviso al hacer git push: ${gitErr.message}`);
    }
  }

  return product;
}

// -------------------------------------------------------------
// DOWNLOAD IMAGE BUFFER (Handles encrypted chat + public channels)
// -------------------------------------------------------------
async function downloadImageBuffer(msg, imageMsg, logger, remoteJid = "") {
  const isNewsletter = remoteJid.endsWith("@newsletter");

  // 1. Direct HTTP download for WhatsApp Newsletter (Channel) public media
  // In channels, media is public on mmg.whatsapp.net and NEVER end-to-end encrypted
  if (isNewsletter) {
    let downloadUrl = imageMsg?.url;
    if (!downloadUrl && imageMsg?.directPath) {
      downloadUrl = imageMsg.directPath.startsWith("http")
        ? imageMsg.directPath
        : `https://mmg.whatsapp.net${imageMsg.directPath}`;
    }

    if (downloadUrl) {
      try {
        console.log(`⬇️ Descargando imagen pública desde CDN de WhatsApp...`);
        const res = await fetch(downloadUrl, {
          headers: {
            Origin: "https://web.whatsapp.com",
            Referer: "https://web.whatsapp.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
          }
        });
        if (res.ok) {
          const arrayBuf = await res.arrayBuffer();
          const buf = Buffer.from(arrayBuf);
          if (buf.length > 0) {
            console.log(`✅ Imagen descargada exitosamente (${(buf.length / 1024).toFixed(1)} KB)`);
            return buf;
          }
        } else {
          console.warn(`⚠️ Respuesta HTTP ${res.status} al descargar desde CDN: ${downloadUrl}`);
        }
      } catch (err) {
        console.warn(`⚠️ Error en descarga de CDN: ${err.message}`);
      }
    }

    if (imageMsg?.jpegThumbnail) {
      console.log("ℹ️ Usando miniatura embebida de WhatsApp como alternativa...");
      return Buffer.from(imageMsg.jpegThumbnail);
    }
  }

  // 2. If private / group chat with valid mediaKey
  if (!isNewsletter && imageMsg?.mediaKey && imageMsg.mediaKey.length > 0) {
    try {
      const buf = await downloadMediaMessage(msg, "buffer", {}, { logger });
      if (buf && buf.length > 0) return buf;
    } catch (e) {
      console.log("ℹ️ Falló descarga cifrada:", e.message);
    }
  }

  // 3. Fallback direct download if not tried yet
  let downloadUrl = imageMsg?.url;
  if (!downloadUrl && imageMsg?.directPath) {
    downloadUrl = imageMsg.directPath.startsWith("http")
      ? imageMsg.directPath
      : `https://mmg.whatsapp.net${imageMsg.directPath}`;
  }
  if (downloadUrl) {
    try {
      const res = await fetch(downloadUrl, {
        headers: {
          Origin: "https://web.whatsapp.com",
          Referer: "https://web.whatsapp.com/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36"
        }
      });
      if (res.ok) {
        return Buffer.from(await res.arrayBuffer());
      }
    } catch {}
  }

  // 4. Fallback thumbnail
  if (imageMsg?.jpegThumbnail) {
    return Buffer.from(imageMsg.jpegThumbnail);
  }

  throw new Error("No se pudo obtener el archivo de imagen de la publicación de WhatsApp");
}

// -------------------------------------------------------------
// BAILEYS WHATSAPP BOT LISTENER
// -------------------------------------------------------------
let lastProcessedProduct = null;
let lastProcessedTime = 0;

async function startWhatsAppBot() {
  const logger = pino({ level: "silent" });
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  const { version, isLatest } = await fetchLatestBaileysVersion();

  console.log("\n=======================================================");
  console.log("👟 BOT ZAVADUV: SINCRONIZADOR DE CANAL DE WHATSAPP 👟");
  console.log(`   Baileys v${version.join(".")} (Latest: ${isLatest})`);
  console.log("=======================================================\n");

  const sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: state,
    browser: ["ZavaDuv Bot", "Chrome", "1.0.0"],
    syncFullHistory: false
  });

  sock.ev.on("creds.update", saveCreds);

  let targetChannelJid = null;

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log("\n📲 ESCANEA ESTE CÓDIGO QR CON TU WHATSAPP:");
      console.log("   1. Abre WhatsApp en tu celular.");
      console.log("   2. Toca Menú (tres puntos o Ajustes) > 'Dispositivos vinculados'.");
      console.log("   3. Toca 'Vincular un dispositivo' y escanea:\n");
      qrcode.generate(qr, { small: true });
      console.log("\nEsperando escaneo...\n");
    }

    if (connection === "close") {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      console.log(`⚠️ Conexión cerrada (Código: ${statusCode}). Reconectar: ${shouldReconnect}`);

      if (shouldReconnect) {
        console.log("🔄 Reconectando en 3 segundos...");
        setTimeout(() => startWhatsAppBot(), 3000);
      } else {
        console.log("❌ Sesión cerrada permanentemente. Limpiando credenciales...");
        fs.rmSync(authFolder, { recursive: true, force: true });
        console.log("Reinicia el script para generar un nuevo código QR.");
      }
    } else if (connection === "open") {
      console.log("✅ ¡CONECTADO CON ÉXITO A WHATSAPP!");

      // Resolve Channel JID
      try {
        console.log(`🔍 Buscando canal con enlace: https://whatsapp.com/channel/${CHANNEL_INVITE_CODE}...`);
        const meta = await sock.newsletterMetadata("invite", CHANNEL_INVITE_CODE);
        targetChannelJid = meta.id;
        console.log(`📢 Canal enlazado: "${meta.name}" (JID: ${targetChannelJid})`);
        console.log(`   Seguidores: ${meta.subscribers || "N/A"}`);
      } catch (err) {
        console.log(`ℹ️ Aviso al obtener metadata del canal: ${err.message}`);
        console.log(`   (Escucharemos cualquier mensaje entrante de canales o chats vinculados)`);
      }

      console.log("\n🎧 LISTO: Esperando nuevas publicaciones en tu canal...");
      console.log("   (Cada vez que subas una foto con su precio/modelo, se agregará a tu página automáticamente)\n");
    }
  });

  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    for (const msg of messages) {
      if (!msg.message) continue;

      const remoteJid = msg.key.remoteJid || "";

      // Check if message is from target channel or a newsletter
      const isFromChannel =
        (targetChannelJid && remoteJid === targetChannelJid) ||
        remoteJid.endsWith("@newsletter") ||
        msg.key.fromMe; // Also allows sending directly from own chat as test

      if (!isFromChannel) continue;

      // Extract image message
      const imageMsg =
        msg.message.imageMessage ||
        msg.message.viewOnceMessageV2?.message?.imageMessage ||
        msg.message.ephemeralMessage?.message?.imageMessage;

      if (!imageMsg) continue;

      const caption = (imageMsg.caption || "").trim();
      console.log(`\n📩 [NUEVO POST DETECTADO EN CANAL]`);
      console.log(`   Remitente/Canal: ${remoteJid}`);
      console.log(`   Pie de foto: "${caption || "(Sin pie de foto)"}"`);

      try {
        const buffer = await downloadImageBuffer(msg, imageMsg, logger, remoteJid);

        if (!buffer || buffer.length === 0) {
          console.log("⚠️ No se pudo descargar el buffer de la imagen.");
          continue;
        }

        // Check if this is a secondary photo for the recent product (within 20 seconds or no caption)
        const now = Date.now();
        const isRecentSecondary =
          lastProcessedProduct &&
          now - lastProcessedTime < 25000 &&
          (!caption || /foto\s*2|2/i.test(caption));

        if (isRecentSecondary) {
          console.log(`📎 Detectada foto secundaria para ${lastProcessedProduct.brand} ${lastProcessedProduct.name}`);
          const secFilename = `${slugify(`${lastProcessedProduct.brand}-${lastProcessedProduct.name}-photo2-${now}`)}.jpeg`;
          const secDestPath = path.join(destImagesDir, secFilename);
          fs.writeFileSync(secDestPath, buffer);

          lastProcessedProduct.images.push(`/zapatillas/${secFilename}`);

          // Update catalog file
          let catalog = JSON.parse(fs.readFileSync(productsJsonPath, "utf8"));
          const idx = catalog.findIndex((p) => p.id === lastProcessedProduct.id);
          if (idx !== -1) {
            catalog[idx] = lastProcessedProduct;
            fs.writeFileSync(productsJsonPath, JSON.stringify(catalog, null, 2), "utf8");
            console.log(`✅ Foto secundaria vinculada al producto.`);
          }
          continue;
        }

        // Parse new product from caption
        let existingIds = new Set();
        if (fs.existsSync(productsJsonPath)) {
          const catalog = JSON.parse(fs.readFileSync(productsJsonPath, "utf8"));
          existingIds = new Set(catalog.map((p) => p.id));
        }

        const newProduct = parseSneakerFromCaption(caption || "Zapatilla Nueva $85.000", existingIds);
        saveProductToCatalog(newProduct, buffer, ".jpeg");

        lastProcessedProduct = newProduct;
        lastProcessedTime = now;
      } catch (err) {
        console.error("❌ Error al procesar publicación de WhatsApp:", err);
      }
    }
  });
}

startWhatsAppBot().catch((err) => {
  console.error("Error fatal en el bot:", err);
});
