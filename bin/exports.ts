import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import url from "node:url";

import fg from "fast-glob";
import normalize from "normalize-path";

// const __filename__ = url.fileURLToPath(import.meta.url);
const __dirname__ = path.dirname(url.fileURLToPath(import.meta.url));

const isFileExists = async (uri: string): Promise<boolean> => {
  return new Promise((resolve) => {
    resolve(fs.existsSync(uri));
  });
};

const main = async () => {
  const root = path.join(__dirname__, "..");
  const pkg = path.join(root, "package.json");
  const isExistsPackageJson = await isFileExists(pkg);
  if (isExistsPackageJson) {
    const json = await fsp.readFile(pkg, { encoding: "utf-8" });
    const obj = JSON.parse(json);

    const entries = await fg("./dist/**/index.es.js");
    const exports = {};

    // default entrypoint
    exports["."] = {
      import: "./dist/main.es.js",
      require: "./dist/main.cjs.cjs",
      types: "./dist/main.d.ts",
    };

    entries.sort((a, b) => a.localeCompare(b));

    for (const entry of entries) {
      const dir = path.dirname(entry);
      exports[`./${dir.substring("./dist/".length)}`] = {
        import: `./${normalize(path.join(dir, "index.es.js"))}`,
        require: `./${normalize(path.join(dir, "index.cjs.cjs"))}`,
        types: `./${normalize(path.join(dir, "index.d.ts"))}`,
      };
    }

    obj["exports"] = exports;
    await fsp.writeFile(pkg, JSON.stringify(obj, null, 2));
  }
};

await main();
