// One-off helper: harvest long-form Unsplash ids via curl (node fetch trips
// the bot challenge), download several landscape candidates per hero so the
// subject can be eyeballed before one is promoted. Deleted once heroes land.
import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, mkdirSync } from "node:fs";

const TARGETS = [
  { file: "hero-services", query: "doctor-examining-patient-clinic" },
  { file: "hero-about", query: "medical-team-portrait" },
  { file: "hero-locations", query: "medical-clinic-building-exterior" },
  { file: "hero-journal", query: "doctor-writing-notes-desk" },
  { file: "hero-contact", query: "clinic-reception-desk-staff" },
];

const PER_TARGET = 4;
const MIN_BYTES = 20000;
const DIR = "public/images/_candidates";
const TMP_HTML = "harvest.tmp.html";

mkdirSync(DIR, { recursive: true });

function curl(url, out) {
  execFileSync("curl", ["-sS", "-L", "--max-time", "40", "-o", out, url], {
    stdio: ["ignore", "ignore", "pipe"],
  });
}

function isJpeg(buf) {
  return buf.length > MIN_BYTES && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff;
}

for (const target of TARGETS) {
  let ids = [];
  try {
    curl(`https://unsplash.com/s/photos/${target.query}`, TMP_HTML);
    const html = readFileSync(TMP_HTML, "utf8");
    ids = [...new Set([...html.matchAll(/photo-\d{13}-[0-9a-f]{12}/g)].map((m) => m[0]))];
  } catch (err) {
    console.log(`HARVEST FAIL ${target.query}: ${err.message}`);
    continue;
  }
  let n = 0;
  for (const id of ids) {
    if (n >= PER_TARGET) break;
    const out = `${DIR}/${target.file}--${n}.jpg`;
    try {
      // Wide crop: heroes are full-bleed bands, never portrait.
      curl(`https://images.unsplash.com/${id}?w=2000&h=1100&fit=crop&q=80&fm=jpg`, out);
      const buf = readFileSync(out);
      if (!isJpeg(buf)) {
        rmSync(out, { force: true });
        continue;
      }
      console.log(`${target.file}--${n}.jpg  ${id}  ${buf.length}`);
      n += 1;
    } catch {
      rmSync(out, { force: true });
    }
  }
  if (n === 0) console.log(`FAILED ${target.file} (${ids.length} candidates)`);
}

rmSync(TMP_HTML, { force: true });
