/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');

const rootPath = __dirname;

module.exports = {
  devtool: 'eval-source-map',

  entry: [
    './playground/index.js'
  ],

  output: {
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.js.map',
    path: '/',
    publicPath: '/assets/'
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],

  module: {
    loaders: [{
      test: /\.js$/,
      loaders: [
        'react-hot-loader/webpack',
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
