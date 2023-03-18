const process = require('process');
const path = require('path');
const { readdir, writeFile } = require('fs').promises;

const IGNORE_DIRS = ['node_modules', '.next']
const SUPPORTED_FILES = ['index.html'];

async function* getFiles(dir) {
  const dirents = await readdir(dir, { withFileTypes: true });

  for (const dirent of dirents) {
    const res = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      if (!IGNORE_DIRS.includes(dirent.name)) {
        yield* getFiles(res);
      }
    } else {
      if (SUPPORTED_FILES.includes(dirent.name)) {
        yield res;
      }
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
  for await (let filename of getFiles(root)) {
    if (filename.endsWith('index.html')) {
      filename = path.dirname(filename)
    }
    links.push(filename);
  }

  const markdown = create_markdown(links);
  await writeFile(path.join(root, 'README.md'), markdown);
}

main();
