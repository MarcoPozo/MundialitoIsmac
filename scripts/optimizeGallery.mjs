import fs from "fs";
import path from "path";
import fg from "fast-glob";
import sharp from "sharp";

// 1) Configura la carpeta de origen
const SOURCE_DIR = "C:/Users/Desarrollador2/Desktop/imagenesMundialito";

// 2) Carpetas de salida en public
const OUT_THUMBS = "public/galeria/thumbs";
const OUT_FULL = "public/galeria/full";
const OUT_JSON = "public/data/gallery.json";

// Crea carpetas si no existen
[OUT_THUMBS, OUT_FULL, path.dirname(OUT_JSON)].forEach((d) => {
  fs.mkdirSync(d, { recursive: true });
});

// Busca extenciones a procesar
const files = await fg(["**/*.jpg", "**/*.jpeg", "**/*.png"], {
  cwd: SOURCE_DIR,
  onlyFiles: true,
  caseSensitiveMatch: false,
  absolute: true,
});

// Ordena por nombre de archivo
files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

console.log(`Encontradas ${files.length} imágenes.`);

const data = [];
let index = 1;

for (const file of files) {
  const id = `g${index}`;
  const base = String(index).padStart(3, "0");

  const outThumb = path.join(OUT_THUMBS, `${base}.webp`);
  const outFull = path.join(OUT_FULL, `${base}.webp`);

  // Thumb: 480px / calidad ~75
  await sharp(file)
    .rotate()
    .resize({ width: 480, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(outThumb);

  // Full: 1600px / calidad ~82
  await sharp(file)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outFull);

  data.push({
    id,
    thumb: `/galeria/thumbs/${base}.webp`,
    full: `/galeria/full/${base}.webp`,
    alt: `Foto ${index}`,
    tags: [],
    fecha: null,
  });

  console.log(`✔ ${base} listo`);
  index++;
}

// Genera gallery.json
fs.writeFileSync(OUT_JSON, JSON.stringify(data, null, 2));
console.log(`\n✅ Generado ${OUT_JSON} con ${data.length} items.`);
