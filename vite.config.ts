import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import glob from "fast-glob";
import normalize from "normalize-path";
import { defineConfig } from "vite";

const rel = (...paths: string[]) =>
  resolve(dirname(fileURLToPath(import.meta.url)), ...paths);

const getImports = (): Record<string, string> => {
  const entries = glob.sync(["./src/**/*.ts"]);

  return entries.reduce((w, cur) => {
    const dir = dirname(cur).substring("./src/".length);
    const entry = basename(cur, ".ts");
    w[normalize(join(dir, entry))] = rel(cur);

    return w;
  }, {});
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    copyPublicDir: false,
    lib: {
      entry: getImports(),
      fileName: "[name].[format]",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [],
      output: {
        preserveModules: true,
      },
    },
  },
});
