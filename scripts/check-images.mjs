// Fails on oversized images or external image URLs. See rules 10 and 11 in CLAUDE.md.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const LIMITS = { ".svg": 50 * 1024, ".png": 300 * 1024, ".jpg": 300 * 1024, ".jpeg": 300 * 1024, ".webp": 300 * 1024 };
// The map tile server is the one approved exception (see CLAUDE.md rule 11).
const ALLOWED_HOSTS = ["tile.openstreetmap.org", "www.openstreetmap.org"];
const problems = [];

function walk(dir, visit) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, visit);
    else visit(path);
  }
}

walk("public/images", (path) => {
  const limit = LIMITS[extname(path).toLowerCase()];
  const size = statSync(path).size;
  if (limit && size > limit) problems.push(`${path} is ${Math.round(size / 1024)} KB, limit ${limit / 1024} KB`);
});

const IMAGE_URL = /https?:\/\/[^\s"'`)]+\.(?:png|jpe?g|webp|avif|gif|svg)\b/gi;
for (const root of ["app", "components", "lib"]) {
  walk(root, (path) => {
    if (!/\.(tsx?|css)$/.test(path) || /\.test\./.test(path)) return;
    const text = readFileSync(path, "utf8");
    for (const url of text.match(IMAGE_URL) ?? []) {
      if (!ALLOWED_HOSTS.some((host) => url.includes(host))) problems.push(`${path} links an external image: ${url}`);
    }
    if (/<img[\s>]/.test(text)) problems.push(`${path} uses a raw <img>, use next/image`);
  });
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log("check:images ok");
