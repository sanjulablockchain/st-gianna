// Fails when source files contain em or en dashes. See rule 2 in CLAUDE.md.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components", "lib", "hooks"];
const DASH = /[–—]/;
const hits = [];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (/\.(tsx?|css)$/.test(name) && !/\.test\./.test(name)) {
      readFileSync(path, "utf8").split(/\r?\n/).forEach((line, i) => {
        if (DASH.test(line)) hits.push(`${path}:${i + 1}: ${line.trim()}`);
      });
    }
  }
}

ROOTS.forEach(walk);
if (hits.length) {
  console.error(`Dash punctuation found (${hits.length}):\n${hits.join("\n")}`);
  process.exit(1);
}
console.log("check:dashes ok");
