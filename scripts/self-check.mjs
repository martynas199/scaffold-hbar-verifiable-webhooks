import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const required = [
  "README.md",
  "AGENTS.md",
  "LICENCE",
  "package.json",
  "packages/nextjs/package.json",
  "packages/nextjs/app/api/health/route.ts",
  "packages/nextjs/.env.example"
];

const failures = [];
for (const file of required) {
  if (!existsSync(join(root, file))) failures.push(`missing: ${file}`);
}

const manifestPath = join(root, "template.json");
if (existsSync(manifestPath)) {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    if (!manifest.name) failures.push("template.json: missing name");
    if (!manifest["create-scaffold-hbar"]) failures.push("template.json: missing create-scaffold-hbar");
  } catch (error) {
    failures.push(`template.json: invalid JSON (${error.message})`);
  }
}

function walk(dir, prefix = "") {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    const rel = join(prefix, entry.name);
    if (["node_modules", ".next", ".git"].includes(entry.name)) return [];
    return entry.isDirectory() ? walk(join(dir, entry.name), rel) : [rel];
  });
}

for (const rel of walk(root)) {
  const lower = rel.toLowerCase();
  if (/(^|[\\/])\.env($|\.)/.test(lower) && !lower.endsWith(".env.example")) {
    failures.push(`secret-risk file committed: ${rel}`);
  }
  if (/private.*key|seed.*phrase|mnemonic/.test(lower) && !lower.endsWith("security.md")) {
    failures.push(`secret-risk filename: ${rel}`);
  }
}

if (failures.length) {
  console.error("Self-check failed:\n- " + failures.join("\n- "));
  process.exit(1);
}

console.log("Self-check passed: manifest/docs/licence/health route present and no obvious secret files detected.");
