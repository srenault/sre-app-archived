import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from "rollup-plugin-terser";
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import replace from 'rollup-plugin-replace';
import size from 'rollup-plugin-size';
import copy from 'rollup-plugin-copy';
import includePaths from 'rollup-plugin-includepaths';

const target = process.env.target || 'mock';

const production = target === 'prod';

const env = production ? 'production' : 'development';

let config = {
  env: target,
  endpoint: '',
  basic_auth_user: '',
  basic_auth_password: '',
};

if (target === 'prod') {
  if (!process.env.APP_PROD_ENDPOINT) {
    console.error('Please specify APP_PROD_ENDPOINT env');
    process.exit(1);
  }

  if (!process.env.APP_PROD_BASICAUTHUSER) {
    console.error('Please specify APP_PROD_BASICAUTHUSER env');
    process.exit(1);
  }

  if (!process.env.APP_PROD_BASICAUTHPASSWORD) {
    console.error('Please specify APP_PROD_BASICAUTHPASSWORD env');
    process.exit(1);
  }

  config = {
    env: target,
    endpoint: process.env.APP_PROD_ENDPOINT,
    basic_auth_user: process.env.APP_PROD_BASICAUTHUSER,
    basic_auth_password: process.env.APP_PROD_BASICAUTHPASSWORD,
  };

} else {
  config = {
    ...config,
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
        'node_modules/@material-ui/utils/node_modules/react-is/index.js': ['ForwardRef'],
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
    includePaths({
      include: {},
      paths: ['src'],
      external: [],
      extensions: ['.js'],
    }),
  ]
};
