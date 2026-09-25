// @ts-check
// Local Docusaurus plugin.
//
// Why this exists:
// With docs `routeBasePath: "/"`, Docusaurus registers a "/" route but the
// production static generator does not emit a root `index.html` for it. A
// `static/index.html` redirect used to fill that gap, but in `docusaurus start`
// that static copy collided with the registered "/" route and webpack failed
// with "Conflict: Multiple assets emit different content to the same filename
// index.html".
//
// This plugin writes the redirect `index.html` only during the production
// build (`postBuild` never runs in `docusaurus start`), so the dev server stays
// clean while every locale root still redirects to its documentation entry.

import { promises as fs } from "node:fs";
import path from "node:path";

const ENTRY = "overview/introduction";

function redirectHtml() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Powerduck Documentation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="0; url=${ENTRY}" />
  </head>
  <body>
    <p>
      Redirecting to the documentation entry point. If you are not redirected
      automatically, <a href="${ENTRY}">continue here</a>.
    </p>
    <script>
      (function redirect() {
        var target = "${ENTRY}";
        window.location.replace(target);
      })();
    </script>
  </body>
</html>
`;
}

// A locale root is a directory that holds the generated `overview/` folder.
// That matches the build output root (default locale) and every `<locale>`
// subdirectory produced by a multilingual build.
async function findLocaleRoots(outDir) {
  const roots = [];

  if (await isDirectory(path.join(outDir, "overview"))) {
    roots.push(outDir);
  }

  let entries = [];
  try {
    entries = await fs.readdir(outDir, { withFileTypes: true });
  } catch {
    return roots;
  }

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const candidate = path.join(outDir, entry.name);
    if (await isDirectory(path.join(candidate, "overview"))) {
      roots.push(candidate);
    }
  }

  return roots;
}

async function isDirectory(target) {
  try {
    const stat = await fs.stat(target);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/** @type {import('@docusaurus/types').PluginModule} */
export default function rootRedirect() {
  return {
    name: "powerduck-root-redirect",

    async postBuild({ outDir }) {
      const roots = await findLocaleRoots(outDir);
      await Promise.all(
        roots.map((root) =>
          fs.writeFile(path.join(root, "index.html"), redirectHtml(), "utf8"),
        ),
      );
    },
  };
}
