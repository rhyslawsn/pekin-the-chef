import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["./src/main.ts"],
  noExternal: ["@pekin-the-chef/types"],
  publicDir: "./public",
  // dts: true,
  target: "es2021",
  skipNodeModulesBundle: true,
  format: ["cjs"],
  outDir: "./build",
  cjsInterop: true,
  platform: "node",
  sourcemap: true,
});
