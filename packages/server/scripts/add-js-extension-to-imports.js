import { readdir, readFile, writeFile, stat } from 'fs/promises';
import path from 'path';

const exts = ['.js', '.mjs'];
const distDir = path.resolve('./dist');

function needsJsExtension(importPath) {
  // Уже есть .js или .json
  if (importPath.match(/\.(js|json)(['"])$/)) return false;
  // Относительный путь
  if (importPath.startsWith('./') || importPath.startsWith('../')) return true;
  // Алиасы пакетов
  if (importPath.startsWith('@way-to-bot/server/') || importPath.startsWith('@way-to-bot/shared/')) return true;
  return false;
}

async function processFile(filePath) {
  let code = await readFile(filePath, 'utf8');
  // import/export from, require(), import()
  code = code.replace(/((import|export)\s.*?from\s*['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\)|import\(\s*['"]([^'"]+)['"]\))/g, (match, _g0, _g1, from1, req1, imp1) => {
    const importPath = from1 || req1 || imp1;
    if (!importPath) return match;
    if (!needsJsExtension(importPath)) return match;
    // Добавить .js перед закрывающей кавычкой
    return match.replace(importPath, importPath + '.js');
  });
  await writeFile(filePath, code, 'utf8');
}

async function walk(dir) {
  const files = await readdir(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stats = await stat(full);
    if (stats.isDirectory()) {
      await walk(full);
    } else if (exts.some(ext => full.endsWith(ext))) {
      await processFile(full);
    }
  }
}

await walk(distDir); 