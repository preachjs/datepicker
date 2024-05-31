import esbuild from "esbuild";

const args = process.argv.slice();
const isDev = args.includes("--dev");

const ctx = await esbuild.context({
  entryPoints: ["./example/src/main.jsx"],
  format: "esm",
  bundle: true,
  logLevel: "info",
  platform: "browser",
  outdir: "example/dist",
  jsx: "automatic",
  jsxImportSource: "preact",
});

if (isDev) {
  await ctx.watch();
  setTimeout(() => {
    ctx.serve({
      port: 8000,
      servedir: "./example",
    });
  }, 100);
}

await ctx.rebuild();
!isDev && process.exit(0);
