const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const packageJson = require('./package.json');

const config = {
    devtool: 'source-map',
    entry: [
        'webpack/hot/dev-server',
        'webpack-dev-server/client?http://localhost:8080',
        path.resolve(__dirname, 'app', 'index.js'),
    ],
    output: {
        path: path.resolve(__dirname, 'app', 'build'),
        filename: 'bundle.js',
        publicPath: '/build',
    },
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                loader: 'eslint',
                exclude: /(node_modules)/,
            },
        ],
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
            },
            {
                test: /\.html$/,
                loader: 'raw',
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap'),
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&minetype=application/font-woff',
            },
            {
                test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader',
            }        ],
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),

        // prevent bundle generation when error found
        new webpack.NoErrorsPlugin(),

        // styles from initial chunks into separate css output file
        new ExtractTextPlugin('bundle.css'),

        new webpack.DefinePlugin({
            VERSION: JSON.stringify(packageJson.version),
        }),
    ],
};

module.exports = config;
