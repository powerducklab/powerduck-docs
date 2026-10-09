#!/usr/bin/env node
//
// inject-ga.mjs - guarantee the Google gtag.js snippet is present on every
// static HTML page produced by the Docusaurus build.
//
// The official @docusaurus/plugin-google-gtag injects the tag into normal
// doc pages, but Docusaurus also emits tiny client/meta-refresh redirect
// pages (for example the locale root index.html) that bypass the normal
// layout and therefore miss the tag. This script is a build-time safety net:
// it walks a build directory and inserts the canonical gtag snippet before
// </head> on any page that does not already contain the measurement id.
//
// Usage: node scripts/inject-ga.mjs <buildDir>
//
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const GA_ID = "G-8HXDV7CDEB";
const SNIPPET = [
  "<!-- Google tag (gtag.js) -->",
  `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>`,
  "<script>",
  "  window.dataLayer = window.dataLayer || [];",
  "  function gtag(){dataLayer.push(arguments);}",
  "  gtag('js', new Date());",
  `  gtag('config', '${GA_ID}');`,
  "</script>",
].join("\n");

const root = process.argv[2];
if (!root) {
  console.error("Usage: inject-ga.mjs <buildDir>");
  process.exit(2);
}

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      out.push(...walk(full));
    } else if (entry.endsWith(".html") || entry.endsWith(".htm")) {
      out.push(full);
    }
  }
  return out;
}

let injected = 0;
let already = 0;
let noHead = 0;
for (const file of walk(root)) {
  const html = readFileSync(file, "utf8");
  if (html.includes(GA_ID)) {
    already += 1;
    continue;
  }
  const match = html.match(/<\/head>/i);
  if (!match) {
    noHead += 1;
    console.warn(`no </head>, skipped: ${file}`);
    continue;
  }
  const at = match.index;
  writeFileSync(file, html.slice(0, at) + SNIPPET + "\n" + html.slice(at), "utf8");
  injected += 1;
}
console.log(`GA injection: injected=${injected} alreadyPresent=${already} noHead=${noHead}`);
if (noHead > 0) process.exit(1);
