// Writes lib/blurData.json: a tiny base64 placeholder per photo in public/images.
// Re-run after adding or replacing a photo. See rule 10 in CLAUDE.md.
import { readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const DIR = "public/images";
const out = {};

for (const name of readdirSync(DIR).sort()) {
  if (!/\.(jpe?g|webp)$/i.test(name)) continue;
  const buffer = await sharp(join(DIR, name)).resize(16).blur().jpeg({ quality: 40 }).toBuffer();
  out[`/images/${name}`] = `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

writeFileSync("lib/blurData.json", JSON.stringify(out, null, 2) + "\n");
console.log(`gen:blur wrote ${Object.keys(out).length} placeholders`);
