import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';

const target = process.env.target || 'dev';

const production = !target === 'prod';

const config = require(`./env/${target}.js`);

export default {
  input: 'src/js/main.js',
  output: {
    file: 'www/js/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  plugins: [
    postcss({
      minimize: production,
    }),
    resolve(),
    commonjs(),
    replace({
      include: 'src/js/config.js',
      delimiters: ['<@', '@>'],
      ...config,
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    production && uglify(),
  ]
};
