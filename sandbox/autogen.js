const process = require('process');
const path = require('path');
const { readdir, writeFile } = require('fs').promises;

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });

  for (const dirent of dirents) {
    const res = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res);
    } else {
      yield res;
    }
  }
}

function create_markdown(links) {
  const links_markdown = links.map(url => `- [${url}](${url})`).join('\n');

  return `
# Directory

${links_markdown}
 `;
}

async function main() {
  const root = '.';

  const links = []
  for await (const filename of getFiles(root)) {
    if (!filename.endsWith('.html')) {
      continue;
    }
    links.push(filename);
  }

  const markdown = create_markdown(links);
  await writeFile(path.join(root, 'README.md'), markdown);
}

main();
