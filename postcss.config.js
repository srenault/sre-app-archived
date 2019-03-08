module.exports = {
  sourceMap: 'inline',
  extensions: [ '.css' ],
  plugins: [
    require('postcss-import'),
    require('postcss-preset-env')({
      stage: 3,
      browsers: 'last 2 versions',
      features: {
        'nesting-rules': true,
        'custom-properties': true,
      }
    }),
  ]
};
