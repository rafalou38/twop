import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
// import html2 from "rollup-plugin-html2";
import svelte from "rollup-plugin-svelte";
// import serve from "rollup-plugin-serve";
import postcss from "rollup-plugin-postcss";
// import { terser } from "rollup-plugin-terser";
// import livereload from "rollup-plugin-livereload";
import sveltePreprocessor from "svelte-preprocess";
import path from "path";
import { readdirSync } from "fs";

const isDevelopment = process.env.NODE_ENV === "development";

const plugins = [
  svelte({
    // dev: isDevelopment,
    extensions: [".svelte"],
    preprocess: sveltePreprocessor(),
    emitCss: true,
    compilerOptions: {
      dev: isDevelopment,
    },
  }),
  postcss({
    extract: true,
  }),
  typescript({
    tsconfig: "./webviews/tsconfig.json",
    sourceMap: isDevelopment,
  }),
  commonjs({ include: "node_modules/**", extensions: [".js", ".ts"] }),
  resolve(),
  // html2({
  //   template: "src/index.html",
  // }),
];
if (isDevelopment) {
  // plugins.push(
  //   serve({
  //     contentBase: "./dist",
  //     open: false,
  //   }),
  //   livereload({ watch: "./dist" })
  // );
} else {
  // plugins.push(terser({ sourcemap: true }));
}

export default readdirSync(path.join(__dirname, "webviews", "pages")).map(
  (input) => {
    const name = input.split(".")[0];
    return {
      input: `./webviews/pages/${input}`,
      output: {
        file: `./dist/public/${name}.js`,
        sourcemap: isDevelopment,
        format: "iife",
        name: name,
      },
      plugins,
    };
  }
);
