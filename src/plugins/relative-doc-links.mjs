import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

// Source Markdown links must also work when Docusaurus mixes translated files
// with English fallback files. Its file resolver otherwise looks in only one
// physical tree. Keep the URL relative so navigation retains the current locale.
export default function relativeDocLinks({docsDirectory = fileURLToPath(new URL('../../docs/', import.meta.url))} = {}) {
  return (tree, file) => {
    const filename = String(file.path).replaceAll('\\', '/');
    const sourceRoot = docsDirectory.replaceAll('\\', '/').replace(/\/$/, '') + '/';
    const relative = filename.startsWith(sourceRoot)
      ? filename.slice(sourceRoot.length)
      : filename.split('/docusaurus-plugin-content-docs/current/')[1];
    if (!relative) return;
    const route = value => value.replace(/\.mdx?$/, '').replace(/(^|\/)index$/, '');
    const sourceRoute = route(relative);
    const visit = node => {
      if ((node.type === 'link' || node.type === 'definition') && typeof node.url === 'string') {
        const match = node.url.match(/^(\.{1,2}\/[^?#]+\.mdx?)([?#].*)?$/);
        if (match) {
          const target = path.posix.normalize(path.posix.join(path.posix.dirname(relative), match[1]));
          // Leave invalid links to Docusaurus's strict error handler.
          if (!target.startsWith('../') && fs.existsSync(path.join(docsDirectory, target))) {
            let destination = path.posix.relative(sourceRoute, route(target));
            if (!destination.startsWith('.')) destination = './' + destination;
            node.url = destination.replace(/\/$/, '') + '/' + (match[2] || '');
          }
        }
      }
      for (const child of node.children || []) visit(child);
    };
    visit(tree);
  };
}
