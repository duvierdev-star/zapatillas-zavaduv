import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";
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

const COMPOUND_COLORS = [
  { match: /BLANCA\s*AZUL/i, color: "Blanco con Azul" },
  { match: /BLANCO\s*AZUL/i, color: "Blanco con Azul" },
  { match: /BLANCA\s*CAFE/i, color: "Blanco con Café" },
  { match: /BLANCO\s*CAFE/i, color: "Blanco con Café" },
  { match: /BLANCA\s*NEGRA/i, color: "Blanco con Negro" },
  { match: /BLANCA\s*NEGRO/i, color: "Blanco con Negro" },
  { match: /BLANCO\s*NEGRO/i, color: "Blanco con Negro" },
  { match: /NEGRA\s*BLANCA/i, color: "Negro con Blanco" },
  { match: /NEGRA\s*BLANCO/i, color: "Negro con Blanco" },
  { match: /NEGRO\s*BLANCO/i, color: "Negro con Blanco" },
  { match: /BLANCA\s*PLATEAD[OA]/i, color: "Blanco con Plateado" },
  { match: /BLANCO\s*PLATEAD[OA]/i, color: "Blanco con Plateado" },
  { match: /SUELA\s*NEGRA/i, color: "Suela Negra" },
  { match: /SUELA\s*BLANCA/i, color: "Suela Blanca" },
  { match: /SUELA\s*GRIS/i, color: "Suela Gris" },
  { match: /CAFE\s*AZUL/i, color: "Café con Azul" },
  { match: /CAFE\s*NEGR[OA]/i, color: "Café con Negro" },
  { match: /ROSA\s*AZUL/i, color: "Rosa con Azul" },
  { match: /BLANC[OA]\s*NARANJA/i, color: "Blanco con Naranja" },
  { match: /GRIS\s*NARANJA/i, color: "Gris con Naranja" },
  { match: /CAFE\s*GRIS/i, color: "Café con Gris" },
  { match: /BLANC[OA]\s*VERDE/i, color: "Blanco con Verde" },
  { match: /NEGR[OA]\s*VERDE/i, color: "Negro con Verde" },
  { match: /NEGR[OA]\s*GRIS/i, color: "Negro con Gris" },
  { match: /BLANC[OA]\s*GRIS/i, color: "Blanco con Gris" },
  { match: /GRIS\s*BLANC[OA]/i, color: "Gris con Blanco" },
  { match: /GIRASOL/i, color: "Girasol Floral" },
  { match: /FUCHSIA/i, color: "Fucsia" },
  { match: /PURPLE/i, color: "Morado / Púrpura" },
  { match: /BEIGE/i, color: "Beige" },
  { match: /ROJIZO/i, color: "Rojizo" },
  { match: /ROJAS?/i, color: "Rojo" },
  { match: /CAFES/i, color: "Café" },
  { match: /VINOTINTO/i, color: "Vinotinto" },
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
  { match: /AZUL\s+TURQUI/i, color: "Azul Turquí" },
  { match: /AZUL\s+OSCURO/i, color: "Azul Oscuro" },
  { match: /CAFE\s+OSCURO/i, color: "Café Oscuro" },
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
  "OFF WHITE",
  "OFF-WHITE",
  "ALEXANDER MCQUEEN",
  "TOMMY HILFIGER",
  "GOLDEN GOOSE",
  "TIGER ONITSUKA",
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
  "FRESH FOAM HIERRO",
  "FRESH FOAM",
  "ADIDAS",
  "ADISTAR",
  "SUPERNOVA",
  "SUPERNOV",
  "SANDALIAS ADIDAS",
  "NIKE",
  "PEGASUS",
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
  "REBOOK",
  "DIESEL",
  "COLUMBIA",
  "VANS",
  "VEJA",
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
  "VOMERO 5": "Zoom Vomero 5",
  "VOMERO": "Zoom Vomero 5",
  "INITIATOR": "Initiator Retro",
  "BLAZER PLATAFORMA": "Blazer Mid Plataforma",
  "BLAZER": "Blazer Mid Plataforma",
  "INDOOR": "Palermo Indoor",
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

const FILE_OVERRIDES = {
  "ADIDAS GLOW DAMA PROMO $70.000.jpeg": { model: "Supernova Glow Promo", color: "Blanco con Lila y Verde Neón (BM972)" },
  "ADIDAS JANE DAMA $85.000.jpeg": { model: "Samba Jane Mary Jane", color: "Azul Marino con Blanco" },
  "ADIDAS SAMBA OG PROMO DAMA $70.000.jpeg": { model: "Samba OG Promo", color: "Negro con Blanco y Suela Caramelo (BT938)" },
  "ADIDAS SAMBA PLATAFORMA DAMA $75.000.jpeg": { model: "Samba OG Plataforma", color: "Negro con Blanco y Suela Caramelo" },
  "ADIDAS SPEZIAL DAMA $80.000 BBC.jpeg": { model: "Handball Spezial x BBC", color: "Café Moka con Blanco y Suela Caramelo" },
  "ADIDAS SUPERNOVA GLOW DAMA PROMO $70.000.jpeg": { model: "Supernova Glow Promo", color: "Gris Claro con Blanco y Naranja (BM969)" },
  "ADIDAS SUPERSTAR CABALLERO $80.000.jpeg": { model: "Superstar x Neighborhood", color: "Total Black Neighborhood" },
  "ADIDAS SUPERSTAR DAMA $80.000.jpeg": { model: "Superstar", color: "Blanco con Azul Celeste y Marino" },
  "ADIDAS SUPERSTAR DAMA Y CABALLERO $80.000.jpeg": { model: "Superstar x Neighborhood", color: "Blanco Hueso Neighborhood" },
  "COLUMBIA GORO T40 AL 44 $100.000.jpeg": { model: "Facet BOA Gore-Tex Trail", color: "Verde Militar con Negro BOA (01-265)" },
  "DIESEL 40 AL 44 $90.000.jpeg": { model: "S-Astico Low", color: "Blanco con Rojo (01-266)" },
  "DIESEL TYCHE CABALLERO $90.000.jpeg": { model: "Tyche Sneaker", color: "Azul Petróleo con Gris y Amarillo Neón" },
  "FRESH FOAM HIERRO T40 AL 44 $105.000.jpeg": { model: "Fresh Foam X Hierro Trail", color: "Verde Oliva con Gris y Terracota Vibram (01-248)" },
  "HOKA T36 AL 44 $100.000.jpeg": { model: "Transport Vibram", color: "Crema / Beige con Suela Caramelo Vibram (01-244)" },
  "JORDAN LOW CHAROL DAMA $75.000.jpeg": { model: "Air Jordan 1 Low Charol", color: "Blanco con Negro Panda Charol (BT2931)" },
  "JORDAN LOW DAMA $70.000.jpeg": { model: "Air Jordan 1 Low", color: "Total White (Blanco / BT-1468)" },
  "JORDAN R4 DAMA $70.000.jpeg": { model: "Air Jordan 4 Retro", color: "Negro con Blanco White Thunder (BT3013)" },
  "NEW BALANCE 530 V2 DAMA $90.000.jpeg": { model: "530 v2 Retro", color: "Blanco con Plateado (Silver White)" },
  "NEW BALANCE 9060 36 AL 38 $95.000.jpeg": { model: "9060 Chunky", color: "Gris Humo con Crema (01-254)" },
  "NEW BALANCE 9060 DAMA $90.000.jpeg": { model: "9060 Chunky", color: "Blanco Hueso con Crema y Rosa Pastel" },
  "NEW BALANCE 9060 DAMA Y CABALLERO $90.000.jpeg": { model: "9060 Chunky", color: "Blanco Sal / Sea Salt con Gris" },
  "NEW BALANCE 9060 T40 AL 44 $95.000.jpeg": { model: "9060 Chunky", color: "Negro con Blanco Panda (01-203)" },
  "NEW BALANCE FF CABALLERO $85.000.jpeg": { model: "Fresh Foam X More Trail", color: "Total White (Blanco)" },
  "NIKE DUNK LOW NEXT NATURE DAMA PROMO $55.000.jpeg": { model: "Dunk Low Next Nature Promo", color: "Rosa Pastel con Blanco (Pink Oxford / BT4569)" },
  "NIKE DUNK LOW PROMO CABALLERO $60.000.jpeg": { model: "Dunk Low Stüssy Promo", color: "Negro con Celeste Stüssy (BT4552)" },
  "NIKE DUNK LOW RETRO DAMA PROMO $70.000.jpeg": { model: "Dunk Low Retro Promo", color: "Café Moka con Vinotinto y Leopardo (BT4690)" },
  "NIKE DUNK LOW SE PROMO CABALLERO $60.000.jpeg": { model: "Dunk Low SE Promo", color: "Gris Claro con Blanco y Negro (Panda Gris / BT4277)" },
  "NIKE REACTX PEGASUS TRAIL PROMO DAMA $70.000.jpeg": { model: "ReactX Pegasus Trail Promo", color: "Blanco con Rosa y Detalles Multicolor (BT3744)" },
  "NIKE SB DAMA $85.000.jpeg": { model: "SB Dunk Low", color: "Pastel Multicolor (Rosa, Verde Menta y Crema)" },
  "NIKE SB DAMA Y CABALLERO $85.000.jpeg": { model: "SB Dunk Low x Travis Scott", color: "Travis Scott Cactus Jack (Beige con Bandana Paisley)" },
  "NIKE SB DUNK LOW CABALLERO $65.000.jpeg": { model: "SB Dunk Low x Supreme", color: "Total Black Supreme (Ante Negro)" },
  "NIKE SB DUNK LOW DAMA PROMO $65.000.jpeg": { model: "SB Dunk Low Born X Raised Promo", color: "Morado con Blanco y Negro (Born X Raised / BT4585)" },
  "NIKE SB DUNK LOW PROMO CABALLERO $55.000.jpeg": { model: "SB Dunk Low Light Bone Promo", color: "Beige Claro con Gris Claro (Light Bone / BT4544)" },
  "NIKE SB JARRITOS DAMA Y CABALLERO $85.000.jpeg": { model: "SB Dunk Low x Jarritos", color: "Blanco / Lona Beige con Verde y Naranja" },
  "NIKE SB PARRA DAMA $85.000.jpeg": { model: "SB Dunk Low x Parra", color: "Blanco con Swoosh Multicolor Geométrico (BT1407)" },
  "NIKE SB YUTO CABALLERO $85.000.jpeg": { model: "SB Dunk Low x Yuto Horigome", color: "Gris con Blanco y Rosa / Marrón (Yuto Horigome)" },
  "NIKE SHOX DAMA Y CABALLERO $85.000.jpeg": { model: "Shox R4", color: "Blanco con Azul Cielo (BT4770-4769)" },
  "NIKE TN PLUS CABALLERO $90.000.jpeg": { model: "Air Max Plus TN 3", color: "Azul Marino con Celeste y Blanco" },
  "NIKE TN PLUS CABALLERO $95.000.jpeg": { model: "Air Max Plus TN 3", color: "Negro con Azul Cyan Degradé (BT4774)" },
  "NIKE V2K DAMA $90.000.jpeg": { model: "V2K Run", color: "Rosa Pastel Monocromático (Triple Pink)" },
  "ON CLOUD DAMA $95.000.jpeg": { model: "Cloudtilt Swiss", color: "Beige / Arena con Detalles Verde y Burdeos" },
  "ON CLOUD ROSAZUL DAMA $95.000.jpeg": { model: "Cloudsurfer", color: "Rosa Pastel con Azul Lavanda" },
  "PEGASUS T36 AL 39 $90.000.jpeg": { model: "Air Zoom Pegasus 41", color: "Negro con Blanco y Plateado (01-262)" },
  "PUMA 180 DAMA Y CABALLERO $85.000.jpeg": { model: "180 Skate Retro", color: "Blanco Hueso con Gris Claro y Suela Crema" },
  "PUMA CLUB DAMA Y CABALLERO $80.000.jpeg": { model: "Club 5v5 Retro", color: "Blanco con Gris y Dorado (BT1174-642)" },
  "PUMA CLUB PROMO DAMA $60.000.jpeg": { model: "Club 5v5 Retro Promo", color: "Blanco Hueso con Rosa Pastel y Suela Caramelo (BT4761)" },
  "REBOOK CLUB C PROMO DAMA Y CABALLERO $60.000.jpeg": { model: "Club C 85 Promo", color: "Blanco Clásico con Verde Beams (BT1118-1119)" },
  "SKECHERS AERO 37 AL 44 $95.000.jpeg": { model: "Aero Burst Walking", color: "Blanco Carbon Infused (01-257 D / 01-258 H)" },
  "SKECHERS AERO T36 AL 44 $95.000.jpeg": { model: "Aero Burst Walking", color: "Negro con Blanco Carbon Infused (01-259)" },
  "SKECHERS CUSHLON DAMA $95.000.jpeg": { model: "Max Cushioning Trail", color: "Gris Claro con Blanco" },
  "SKECHERS CUSHLON DAMA Y CABALLERO $95.000.jpeg": { model: "Max Cushioning Trail", color: "Negro con Blanco" },
  "SKECHERS MAX CABALLERO $95.000.jpeg": { model: "Max Protect Trail", color: "Negro con Detalles Rojos Goodyear" },
  "SUPERNOV T36 AL 39 $95.000.jpeg": { model: "Supernova Rise 3", color: "Blanco con Morado / Lila y Plateado (01-37)" },
  "SUPERNOVA 36 AL 39 $95.000.jpeg": { model: "Supernova Rise 3", color: "Crema / Beige con Blanco y Suela Roja (01-277)" },
  "VANS HYLANE PROMO CABALLERO $60.000.jpeg": { model: "Hylane Skate Promo", color: "Café Moka con Beige y Blanco (BT3538)" },
  "VEJA DAMA $80.000.jpeg": { model: "Recife Velcro Classic", color: "Blanco con Nude / Beige Rosado y Velcro (3284 D)" }
};

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
    .replace(/270BLANACA/i, "270 BLANCA")
    .replace(/BLANACA/i, "BLANCA")
    .trim();

  // Detect Brand
  let brand = "Otras";
  let brandPrefix = "";

  const upperRaw = raw.toUpperCase();
  for (const b of BRANDS) {
    if (upperRaw.startsWith(b)) {
      brandPrefix = b;
      if (b.startsWith("PROMO")) brand = "Promociones";
      else if (b.startsWith("TIGER ONITSUKA") || b.startsWith("ONITSUKA")) brand = "Onitsuka Tiger";
      else if (b.startsWith("FRESH FOAM")) brand = "New Balance";
      else if (b.startsWith("COLUMBIA")) brand = "Columbia";
      else if (b.startsWith("SUPERNOV")) brand = "Adidas";
      else if (b.startsWith("PEGASUS")) brand = "Nike";
      else if (b.startsWith("REBOOK") || b === "REEBOK") brand = "Reebok";
      else if (b === "VANS") brand = "Vans";
      else if (b === "VEJA") brand = "Veja";
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
  const sizesMatch =
    raw.match(/TALLAS?\s+DISPONIBLES?\s+(?:DEL\s+)?([0-9\sA-Za-z-]+)/i) ||
    raw.match(/\bT?(\d{2})\s*(?:AL|A)\s*(\d{2})\b/i) ||
    raw.match(/\b(\d{2})\s*(?:AL|A)\s*(\d{2})\b/i);

  if (sizesMatch) {
    const sStr = (sizesMatch[1] ? sizesMatch[1] : sizesMatch[0]).trim();
    if (/T?(\d{2})\s*(?:AL|A)\s*(\d{2})/i.test(sizesMatch[0])) {
      const rm = sizesMatch[0].match(/T?(\d{2})\s*(?:AL|A)\s*(\d{2})/i);
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

  // Smart gender inference when size range is clearly male or female
  if (gender === "unisex" && customSizes && customSizes.length > 0) {
    const minSize = parseInt(customSizes[0], 10);
    const maxSize = parseInt(customSizes[customSizes.length - 1], 10);
    if (minSize >= 40) {
      gender = "hombre";
    } else if (maxSize <= 39) {
      gender = "mujer";
    }
  }

  // Detect Model and Colors
  let remainder = raw;
  if (brandPrefix) {
    remainder = remainder.slice(brandPrefix.length).trim();
  }

  // Remove gender and noise tokens
  remainder = remainder
    .replace(/\b(DAMA\s+Y\s+CABALLERO|DAMA\/CABALLERO|DAMA\s+Y\s+CAB|DAMA|CABALLERO|HOMBRE|TALLAS?|DISPONIBLES?|DEL|EN|LA|IMAGEN|SOLO|TALLA)\b/gi, " ")
    .replace(/\bT\b/gi, " ")
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
  if (FILE_OVERRIDES[filename] && FILE_OVERRIDES[filename].color) {
    colorFound = FILE_OVERRIDES[filename].color;
  } else if (filename === "ADIDAS SUPERSTAR DAMA $70.000.jpeg") colorFound = "Leopardo Clásico (Marrón)";
  else if (filename === "JORDAN R4 LOW CABALLERO $95.000.jpeg") colorFound = "Negro con Crema";
  else if (filename === "LECOQ SPORTIF CABALLERO 75.000.jpeg") colorFound = "Negro con Coral / Rojo (BT3688)";
  else if (filename === "NIKE P6000 DAMA $85.000.jpeg") colorFound = "Rosa con Café";
  else if (filename === "NIKE SB GAMUZA DAMA $75.000.jpeg") colorFound = "Café Moka con Blanco (BT4579)";
  else if (filename === "SALOMON XT CABALLERO $105.000.jpeg") colorFound = "Negro con Blanco y Rojo";
  else if (filename === "TIMBERLAND LV CABALLERO $95.000.jpeg") colorFound = "Total Black Monograma LV (BT4522)";
  else if (filename.startsWith("CHANCLA NIKE $40.000")) colorFound = "Rosa con Negro";
  else if (filename.includes("SAMBA BRILLOS BLANCA")) colorFound = "Blanco con Cristales";
  else if (filename.includes("SAMBA BRILLOS NEGRA")) colorFound = "Negro con Cristales";
  else if (filename.includes("PUMA CLUB BLANCA")) colorFound = "Blanco con Dorado";
  else if (filename.includes("PUMA XL BMW BLANCA")) colorFound = "Blanco BMW Motorsport";
  else if (filename.includes("PUMA XL BMW NEGRA")) colorFound = "Negro BMW Motorsport";
  else if (filename.includes("AF1 BILLIE BLANCA")) colorFound = "Blanco Sail";
  else if (filename.includes("AF1 LV BLANCA")) colorFound = "Blanco Monograma LV";

  // Clean remainder words for model name
  remainder = remainder
    .replace(/\b(DAMA|CABALLERO|HOMBRE|TALLAS?|DISPONIBLES?|DEL|EN|LA|IMAGEN|SOLO|TALLA|II|T)\b/gi, "")
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

  if (FILE_OVERRIDES[filename] && FILE_OVERRIDES[filename].model) {
    modelName = FILE_OVERRIDES[filename].model;
  } else if (brand === "Champion") modelName = "Essentials Retro";
  else if (isChancla) modelName = "Chancla Slide Swoosh";
  else if (isSandalia) {
    if (brand === "Miu Miu") modelName = "Sandalias Slide Tweed";
    else if (brand === "Prada") modelName = "Sandalias Slide Luxury";
    else modelName = `Sandalias ${modelName || "Slide"}`;
  } else if (brand === "Hoka") modelName = "Transport Vibram";
  else if (brand === "Salomon") modelName = "XT-6 S/LAB";
  else if (brand === "Off-White") modelName = "Out Of Office (OOO) Sneaker";
  else if (brand === "Adidas") {
    if (/ADIZERO/i.test(raw)) modelName = "Adizero";
    else if (/SUPERNOVA.*GLOW/i.test(raw) || (/GLOW/i.test(raw) && /PROMO/i.test(raw))) modelName = "Supernova Glow Promo";
    else if (/SUPERNOVA|SUPERNOV/i.test(raw)) modelName = "Supernova Rise 3";
    else if (/SAMBA.*PLATAFORMA/i.test(raw)) modelName = "Samba OG Plataforma";
    else if (/SAMBA.*OG.*PROMO/i.test(raw)) modelName = "Samba OG Promo";
    else if (/SAMBA.*BRILLOS/i.test(raw)) modelName = "Samba Brillos Cristales";
    else if (/SAMBA.*CLASICA/i.test(raw)) modelName = "Samba Clásica";
    else if (/SAMBA/i.test(raw)) modelName = "Samba OG";
    else if (/SPEZIAL.*BBC/i.test(raw)) modelName = "Handball Spezial x BBC";
    else if (/SPEZIAL/i.test(raw)) modelName = "Handball Spezial";
    else if (/SUPERSTAR.*GIRASOL/i.test(raw)) modelName = "Superstar Floral Girasol";
    else if (/SUPERSTAR.*SUELANEGRA/i.test(raw)) modelName = "Superstar Suela Negra";
    else if (/SUPERSTAR/i.test(raw)) modelName = "Superstar";
    else if (/JANE/i.test(raw)) modelName = "Samba Jane Mary Jane";
    else if (/\bFF\b/i.test(raw)) modelName = "Switch FWD (FF)";
    else if (/HYPERBOOST/i.test(raw)) modelName = "Hyperboost Runner";
  } else if (brand === "Columbia") {
    modelName = "Facet BOA Gore-Tex Trail";
  } else if (brand === "Diesel") {
    if (/TYCHE/i.test(raw)) modelName = "Tyche Sneaker";
    else modelName = "S-Astico Low";
  } else if (brand === "Asics") {
    if (/GEL/i.test(raw)) modelName = "Gel Running Superblast";
  } else if (brand === "Hugo Boss" && (filename.includes("HUGO BOSS BLANCA") || filename.includes("HUGO BOSS CAFE") || filename.includes("HUGO BOSS NEGRA") || filename.includes("HUGO BOSS BLANCA GRIS"))) {
    modelName = "Jonah Monogram Runner";
  } else if (brand === "Nike") {
    if (/REACTX\s*PEGASUS\s*TRAIL/i.test(raw)) modelName = "ReactX Pegasus Trail Promo";
    else if (/PEGASUS/i.test(raw)) modelName = "Air Zoom Pegasus 41";
    else if (/DUNK\s*LOW.*NEXT\s*NATURE/i.test(raw)) modelName = "Dunk Low Next Nature Promo";
    else if (/DUNK\s*LOW.*RETRO/i.test(raw)) modelName = "Dunk Low Retro Promo";
    else if (/DUNK\s*LOW.*SE/i.test(raw)) modelName = "Dunk Low SE Promo";
    else if (/DUNK\s*LOW.*PROMO/i.test(raw)) modelName = "Dunk Low Promo";
    else if (/SB\s*DUNK\s*LOW.*PROMO/i.test(raw)) modelName = "SB Dunk Low Promo";
    else if (/JARRITOS/i.test(raw)) modelName = "SB Dunk Low x Jarritos";
    else if (/PARRA/i.test(raw)) modelName = "SB Dunk Low x Parra";
    else if (/YUTO/i.test(raw)) modelName = "SB Dunk Low x Yuto Horigome";
    else if (/SB\s*DUNK|SB/i.test(raw)) modelName = "SB Dunk Low";
    else if (/SHOX/i.test(raw)) modelName = "Shox TL";
    else if (/TN\s*PLUS/i.test(raw)) modelName = "Air Max Plus TN 3";
    else if (/V2K/i.test(raw)) modelName = "V2K Run";
    else if (/\b270\b/i.test(raw)) modelName = "Air Max 270";
    else if (/\bACG\b/i.test(raw)) modelName = "ACG Mountain Trail Vibram";
    else if (/BILLIE/i.test(raw)) modelName = "Air Force 1 x Billie Eilish";
    else if (/CHAROL/i.test(raw)) modelName = "Air Force 1 '07 Charol";
    else if (/AF1\s+LV/i.test(raw)) modelName = "Air Force 1 x Louis Vuitton";
    else if (/\bAF1\b/i.test(raw)) modelName = "Air Force 1 '07";
    else if (/AIR\s+ZOOM/i.test(raw)) modelName = "Air Zoom Winflo 11";
    else if (/\bEVA\b/i.test(raw)) modelName = "Motiva EVA Walking";
    else if (/SPEED\s*X/i.test(raw)) modelName = "ZoomX Speed X";
    else if (/\bV5\b/i.test(raw)) modelName = "V2K Run V5";
    else if (/P6000/i.test(raw)) modelName = "P-6000";
  } else if (brand === "On Cloud") {
    if (/SURFER|ROSAZUL/i.test(raw)) modelName = "Cloudsurfer";
    else if (/TITLT|TILT|SWISS/i.test(raw)) modelName = "Cloudtilt Swiss";
    else modelName = "Cloudsurfer";
  } else if (brand === "Onitsuka Tiger") {
    modelName = "Mexico 66";
  } else if (brand === "Puma") {
    if (/180/i.test(raw)) modelName = "180 Skate Retro";
    else if (/CLUB.*PROMO/i.test(raw)) modelName = "Club 5v5 Retro Promo";
    else if (/CLUB/i.test(raw)) modelName = "Club 5v5 Retro";
    else if (/XL\s+BMW/i.test(raw)) modelName = "Suede XL x BMW M Motorsport";
    else if (/SUEDE\s+XL/i.test(raw)) modelName = "Suede XL";
  } else if (brand === "New Balance") {
    if (/9060.*PROMO/i.test(raw)) modelName = "9060 Promo";
    else if (/9060/i.test(raw)) modelName = "9060 Chunky";
    else if (/530/i.test(raw)) modelName = "530 v2 Retro";
    else if (/HIERRO/i.test(raw)) modelName = "Fresh Foam X Hierro Trail";
    else if (/FF/i.test(raw)) modelName = "Fresh Foam X More Trail";
    else if (/471/i.test(raw)) modelName = "471 Retro Runner";
  } else if (brand === "Jordan") {
    if (/LOW\s*CHAROL/i.test(raw)) modelName = "Air Jordan 1 Low Charol";
    else if (/LOW/i.test(raw)) modelName = "Air Jordan 1 Low";
    else if (/R4/i.test(raw)) modelName = "Air Jordan 4 Retro";
    else if (/R1\s+SPACE/i.test(raw)) modelName = "Air Jordan 1 Space";
    else if (/R1/i.test(raw)) modelName = "Air Jordan 1 Retro";
  } else if (brand === "Reebok") {
    if (/CLUB\s*C/i.test(raw)) modelName = "Club C 85 Promo";
    else modelName = "Club C 85";
  } else if (brand === "Skechers") {
    if (/AERO/i.test(raw)) modelName = "Aero Burst Walking";
    else if (/CUSHLON/i.test(raw)) modelName = "Max Cushioning Trail";
    else if (/MAX/i.test(raw)) modelName = "Max Protect Trail";
  } else if (brand === "Vans") {
    modelName = "Hylane Skate Promo";
  } else if (brand === "Veja") {
    modelName = "Campo Classic";
  } else if (filename.includes("TIMBERLAND LV")) modelName = "6-Inch Boot x Louis Vuitton";
  else if (filename.includes("NIKE SB LV")) modelName = "SB Dunk Low x Louis Vuitton";
  else if (brand === "Under Armour" && filename.includes("BOTA")) modelName = "Bota Táctica";
  else if (brand === "Lacoste") modelName = "Carnaby Classic";
  else if (brand === "Le Coq Sportif" && (!modelName || modelName === "Classic")) modelName = "Court Classic";
  else if (brand === "Promociones") {
    let promoSub = raw.replace(/^PROMO\s*/i, "").trim();
    if (customSizes && customSizes.length > 0) {
      if (customSizes.length === 1) promoSub += ` (Talla ${customSizes[0]})`;
      else promoSub += ` (Tallas ${customSizes[0]} a ${customSizes[customSizes.length - 1]})`;
    }
    modelName = `Promo ${promoSub}`.replace(/\s+/g, " ").trim();
  }

  if (FILE_OVERRIDES[filename]) {
    if (FILE_OVERRIDES[filename].brand) brand = FILE_OVERRIDES[filename].brand;
    if (FILE_OVERRIDES[filename].gender) gender = FILE_OVERRIDES[filename].gender;
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
          "F50", "R1", "R3", "R4", "R5", "R11", "R13", "SL", "DN", "DN2", "ACG", "V5", "FF", "(FF)", "FWD", "(OOO)", "BMW", "FR", "BYD", "TTNM", "ST", "RM", "LV", "D&G"
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
    compareAtPrice: /promo/i.test(filename) ? salePrice + 35000 : (brand === "Promociones" ? salePrice + 30000 : undefined),
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

  let untrackedSet = null;
  try {
    const gitStatus = execSync("git status -s Zapatillas", { cwd: rootDir }).toString("utf8");
    const untrackedList = gitStatus
      .split("\n")
      .filter((l) => l.startsWith("?? "))
      .map((l) => l.substring(3).trim().replace(/^"|"$/g, "").replace(/^Zapatillas\//, ""))
      .filter(Boolean);
    if (untrackedList.length > 0 && !process.argv.includes("--all")) {
      untrackedSet = new Set(untrackedList);
      console.log(`Detected ${untrackedSet.size} untracked files in Zapatillas/. Processing only new batch.`);
    }
  } catch (e) {
    console.warn("Could not query git status:", e.message);
  }

  let namedFiles = allFiles.filter((f) => !f.startsWith("WhatsApp") && /\.(jpe?g|png|webp)$/i.test(f));
  if (untrackedSet) {
    namedFiles = namedFiles.filter((f) => untrackedSet.has(f));
  }

  console.log(`Found ${namedFiles.length} named sneaker files to process.`);

  // 2. Identify new files vs existing, and separate multi-photo secondary images (II, (2), (3))
  const filesToAdd = [];
  const secondaryPhotos = [];
  const skippedFiles = [];
  const batchSeenHashes = new Map();

  for (const f of namedFiles) {
    const filePath = path.join(srcImagesDir, f);
    const hash = computeFileHash(filePath);

    if (!untrackedSet && registeredHashMap.has(hash)) {
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
