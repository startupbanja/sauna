/* eslint-disable */
var webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
    template: __dirname + '/app/index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: __dirname + '/app/index.js',
    module: {
        rules: [
            {
                test: /\.css?$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ],
    },
    output: {
        filename: 'transformed.js',
        path: __dirname + '/build/',
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.jsx']
    },
    plugins: [
      HTMLWebpackPluginConfig,
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      })
    ],
    devServer: {
        historyApiFallback: true,
    }
};
/* eslint-enable */
