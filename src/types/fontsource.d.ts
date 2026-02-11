// Declarations for @fontsource packages used in the project
// Prevents `TS2307: Cannot find module '@fontsource/...'` during typecheck
declare module '@fontsource/*' {
  const content: any;
  export default content;
}
