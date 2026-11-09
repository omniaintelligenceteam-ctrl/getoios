import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Vendored as-is from the stageshow skill (MIT, see its LICENSE); our
    // tiles in src/components/stageshow/tiles are linted as usual.
    "src/components/stageshow/kit/**",
  ]),
]);

export default eslintConfig;
