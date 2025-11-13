// Reexport the native module. On web, it will be resolved to SudokuForAllUIModule.web.ts
// and on native platforms to SudokuForAllUIModule.ts
export { default } from "./src/module";
export * from "./src/components";
