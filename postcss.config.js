module.exports = {
  sourceMap: 'inline',
  extensions: [ '.css' ],
  plugins: [
    require('autoprefixer'),
    require('postcss-preset-env'),
  ]
};
