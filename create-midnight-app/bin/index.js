#!/usr/bin/env node

import { existsSync, mkdirSync, cpSync, rmSync, readFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(__dirname, "..", "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));

const args = process.argv.slice(2);

// --help
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
  create-midnight-app-new v${pkg.version}

  Usage:
    npx create-midnight-app-new <project-name>

  Scaffolds a new Midnight dApp project with:
    - midnight-local-network/    Local Midnight node + wallet funding
    - midnight-starter-template/ Counter dApp starter (contracts + CLI)

  Options:
    --help, -h       Show this message
    --version, -v    Show version
`);
  process.exit(0);
}

// --version
if (args.includes("--version") || args.includes("-v")) {
  console.log(pkg.version);
  process.exit(0);
}

// project name
const projectName = args[0];

if (!projectName) {
  console.error("Error: project name required\n");
  console.error("  npx create-midnight-app-new <project-name>");
  process.exit(1);
}

if (projectName.startsWith("-")) {
  console.error(`Error: unknown option "${projectName}"\n`);
  console.error("  npx create-midnight-app-new --help");
  process.exit(1);
}

const targetDir = resolve(process.cwd(), projectName);

if (existsSync(targetDir)) {
  console.error(`Error: directory "${projectName}" already exists`);
  process.exit(1);
}

const templatesDir = join(__dirname, "..", "templates");
const templates = ["midnight-local-network", "midnight-starter-template"];

// verify templates exist
for (const t of templates) {
  const tpl = join(templatesDir, t);
  if (!existsSync(tpl)) {
    console.error(`Error: template "${t}" not found at ${tpl}`);
    console.error("Package may be corrupted. Try reinstalling.");
    process.exit(1);
  }
}

console.log(`\nCreating project "${projectName}"...\n`);

try {
  mkdirSync(targetDir, { recursive: true });

  for (const t of templates) {
    const src = join(templatesDir, t);
    const dest = join(targetDir, t);
    cpSync(src, dest, { recursive: true });
    console.log(`  copied ${t}/`);
  }
} catch (err) {
  console.error(`\nError: ${err.message}`);
  // cleanup partial dir
  if (existsSync(targetDir)) {
    rmSync(targetDir, { recursive: true, force: true });
  }
  process.exit(1);
}

console.log(`
Done! Next steps:

  cd ${projectName}/midnight-local-network
  docker compose up -d
  npm install && npm run fund

  cd ../midnight-starter-template/counter-contract
  npm install && npm run build

  cd ../counter-cli
  npm install && npm test
`);
