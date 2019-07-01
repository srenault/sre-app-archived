import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import size from 'rollup-plugin-size';
import copy from 'rollup-plugin-copy';

const target = process.env.target || 'mock';

const production = target === 'prod';

const env = production ? 'production' : 'development';

let config;

if (production) {
  if (process.env.APP_PROD_ENDPOINT) {
    config = {
      prod: true,
      dev: false,
      mock: false,
      endpoint: process.env.APP_PROD_ENDPOINT,
    };
  } else {
    console.error('Please specify APP_PROD_ENDPOINT env');
    process.exit(1);
  }
} else {
  config = {
    prod: false,
    dev: false,
    mock: false,
    endpoint: undefined,
    ...require(`./env/${target}.js`),
  };
}

export default {
  input: 'src/index.js',
  output: {
    file: 'www/js/bundle.js',
    format: 'iife',
    sourcemap: true,
  },
  onwarn(message) {
    if (message.code === 'CIRCULAR_DEPENDENCY') {
      return;
    }
    console.error(message);
  },
  watch: {
    chokidar: true,
    clearScreen: false,
    include: 'src/**',
  },
  plugins: [
    size(),
    postcss({
      minimize: production,
    }),
    resolve(),
    babel({
      runtimeHelpers: true,
      exclude: 'node_modules/**',
    }),
    commonjs({
      namedExports: {
        'node_modules/react/index.js': ['Children', 'Component', 'PropTypes', 'createElement', 'useState', 'useEffect', 'useReducer', 'useRef', 'useDebugValue', 'useMemo', 'useCallback', 'createContext', 'Fragment', 'isValidElement', 'cloneElement'],
        'node_modules/react-dom/index.js': ['render', 'findDOMNode'],
        'node_modules/react-is/index.js': ['isValidElementType', 'ForwardRef'],
        'node_modules/prop-types/index.js': ['element', 'elementType', 'func', 'oneOfType', 'bool'],
      },
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env),
    }),
    replace({
      include: 'src/Config.js',
      delimiters: ['<@', '@>'],
      values: {
        ...config,
      }
    }),
    production && terser(),
    copy({
      targets: [{
        src: 'src/index.html',
        dest: 'www',
      }],
    }),
  ]
};
