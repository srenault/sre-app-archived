import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: 'src/js/main.js',
  output: {
    file: 'www/js/bundle.js',
    format: 'iife',
    sourcemap: true
  },
  plugins: [
    postcss({
      minimize: production,
    }),
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**'
    }),
    production && uglify()
  ]
};
