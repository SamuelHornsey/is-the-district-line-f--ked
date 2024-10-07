const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const terser = require('@rollup/plugin-terser'); // Optional: for minification
const postcss = require('rollup-plugin-postcss');
const copy = require('rollup-plugin-copy');
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
    }),
    copy({
      targets: [
        {src: 'src/service-worker.js', dest: 'public/'},
        {src: 'src/underground.png', dest: 'public/'},
        {src: 'src/notification.png', dest: 'public/'},
        {src: 'src/manifest.json', dest: 'public/'}
      ]
    })
  ],
};