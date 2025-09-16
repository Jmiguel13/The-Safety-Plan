import fs from "fs";
import path from "path";

const root = process.cwd();
const bad = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(fp);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith(".json")) {
      try {
        const raw = fs.readFileSync(fp, "utf8").trim();
        JSON.parse(raw);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        bad.push({ file: fp, error: msg });
      }
    }
  }
}
walk(root);

if (bad.length === 0) {
  console.log("✅ All *.json files parse correctly.");
  process.exit(0);
} else {
  console.log("❌ Invalid JSON files:");
  for (const b of bad) console.log(` - ${b.file}\n   ${b.error}`);
  process.exit(1);
}
