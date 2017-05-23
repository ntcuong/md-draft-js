/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');

const rootPath = __dirname;

module.exports = {
  entry: [
    './playground/index.js'
  ],

  output: {
    filename: 'bundle.js',
    publicPath: '/',
    path: path.join(rootPath, 'site')
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      comments: false
    })
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: [
        'babel'
      ],
      include: [
        path.join(rootPath, 'playground'),
        path.join(rootPath, 'src')
      ]
    }, {
      test: /\.json$/,
      loaders: [
        'json-loader'
      ]
    }]
  }
};
/* eslint-enable global-require */
/* eslint-enable import/no-extraneous-dependencies */
