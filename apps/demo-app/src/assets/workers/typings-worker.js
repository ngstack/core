self.importScripts([
  'https://cdnjs.cloudflare.com/ajax/libs/typescript/2.7.2/typescript.min.js'
]);

const PACKAGES_SOURCE = 'https://unpkg.com';

const resolved = {};
const downloaded = {};

const loadContent = async url => {
  try {
    const existing = downloaded[url];
    if (existing) {
      return downloaded;
    }

    const response = await fetch(url);
    console.log(response.status, url);

    if (response.status >= 200 && response.status < 300) {
      const text = await response.text();
      downloaded[url] = text;
      return text;
    }
  } catch (err) {
    console.log('Error:', err);
  }

  return null;
};

const getIndex = async lib => {
  const packageUrl = `${PACKAGES_SOURCE}/${lib}/package.json`;
  const content = await loadContent(packageUrl);

  if (content) {
    const json = JSON.parse(content);
    if (json.typings) {
      return new URL(json.typings, packageUrl).href;
    }
  }

  return null;
};

const findReferences = sourceFile => {
  const result = [];

  function scanNode(node) {
    if (
      node.kind === ts.SyntaxKind.ImportDeclaration ||
      node.kind === ts.SyntaxKind.ExportDeclaration
    ) {
      result.push(node.moduleSpecifier.text);
    }
    ts.forEachChild(node, scanNode);
  }

  ts.forEachChild(sourceFile, scanNode);
  return result;
};

const resolveLibs = async (url, cache = {}) => {
  if (cache[url]) {
    return [];
  }
  cache[url] = true;

  const result = [];
  const content = await loadContent(url);

  if (content) {
    result.push({
      url: url,
      path: url.replace(PACKAGES_SOURCE, 'node_modules')
    });

    const sourceFile = ts.createSourceFile(
      'main.ts',
      content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );
    const references = findReferences(sourceFile);

    for (const ref of references) {
      const fileUrl = new URL(`${ref}.d.ts`, url).href;
      const refLibs = await resolveLibs(fileUrl, cache);

      if (refLibs && refLibs.length > 0) {
        result.push(...refLibs);
      }
    }
  }

  return result;
};

const getPackageTypings = async lib => {
  const libUrl = `${PACKAGES_SOURCE}/${lib}`;

  const existing = resolved[libUrl];
  if (existing) {
    return existing.files || [];
  }

  const indexUrl = await getIndex(lib);
  if (indexUrl) {
    const files = await resolveLibs(indexUrl);

    resolved[libUrl] = { files };
    return files;
  }

  return [];
};

self.addEventListener('message', async e => {
  const { dependencies } = e.data;

  if (dependencies && dependencies.length > 0) {
    const result = await Promise.all(
      dependencies.map(d => {
        return getPackageTypings(d);
      })
    );

    const files = result
      .reduce((prev, curr) => prev.concat(curr), [])
      .map(t => {
        return {
          ...t,
          content: downloaded[t.url]
        };
      });

    self.postMessage(files);
  }
});
