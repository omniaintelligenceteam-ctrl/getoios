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
    // The front door's kit (public/jarvis/assets), copied as-is from the tasteskill
    // design skill and loaded by the static page as plain files. The page's own
    // script (public/jarvis/door.js) is linted as usual.
    "public/jarvis/assets/**",
    // The design checker's local browser profile and evidence shots (gitignored).
    "**/.taste-skill/**",
  ]),
]);

export default eslintConfig;
