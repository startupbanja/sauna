/* eslint-disable*/
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:3000/',
        secure: false,
        pathRewrite: { '^/api/': '/' }
      }
    },
  }
});
