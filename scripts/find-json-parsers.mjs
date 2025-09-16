import fs from "fs";
import path from "path";

const root = path.join(process.cwd(), "src");
const hits = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, e.name);
    if (e.isDirectory()) walk(fp);
    else if (/\.(t|j)sx?$|\.mjs$|\.cjs$/.test(e.name)) {
      const txt = fs.readFileSync(fp, "utf8");
      if (txt.includes("JSON.parse(")) hits.push(fp);
    }
  }
}
walk(root);

if (hits.length === 0) console.log("✅ No JSON.parse() found under src/");
else {
  console.log("🔎 Files containing JSON.parse():");
  hits.forEach((f) => console.log(" - " + f));
}
