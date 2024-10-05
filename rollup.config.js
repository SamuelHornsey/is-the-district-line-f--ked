const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const terser = require('@rollup/plugin-terser'); // Optional: for minification
const postcss = require('rollup-plugin-postcss');
const path = require('path');

module.exports = {
  input: 'src/main.js', // Path to your main JavaScript file
  output: {
    file: 'public/bundle.js', // Output file for bundled JavaScript
    format: 'iife', // Immediately Invoked Function Expression for browser usage
    name: 'app', // Optional: global variable name for your bundle
  },
  plugins: [
    resolve(), // Resolves node_modules imports
    commonjs(), // Converts CommonJS to ES modules
    terser(), // Optional: minifies the bundle
    postcss({
      extract: path.resolve('public/styles.css')
    })
  ],
};