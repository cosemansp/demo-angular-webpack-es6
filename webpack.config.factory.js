'use strict';

// Modules
const webpack = require('webpack');
const path = require('path');
const extractTextPlugin = require('extract-text-webpack-plugin');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const packageJson = require('./package.json');


module.exports = function webpackConfigFactory(environment) {

    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all common configuration gets set
     */
    const config = {
        entry: [
            './app/index.js'
        ],

        plugins: [
            new webpack.DefinePlugin({
                VERSION: JSON.stringify(packageJson.version),
                ENVIRONMENT: JSON.stringify(environment)
            }),
            //new ngAnnotatePlugin({add: true })
        ],

        output: {
            path: __dirname + '/app',
            filename: 'bundle.js'
        },

        resolve: {
            root: __dirname + '/app'
        },

        module: {
            preLoaders: [],
            loaders: [
                // load ES6
                {
                    test: /\.js$/,
                    loader: 'ng-annotate!babel',
                    exclude: /node_modules/,
                },

                // load html files as string
                {test: /\.html$/, loader: 'raw'},

                // load styles
                {
                    test: /\.scss$/,
                    loader: (environment == 'development')
                        ? 'style!css?sourceMap!sass?sourceMap'
                        : extractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap')
                },

                // Load fonts
                { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
                { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
            ]
        },

        // setup for webpack-dev-server
        devServer: {
            // root folder to serve the app
            contentBase: "./app",
            // Enable Hot Module Replacement
            hot: true,
            // To support html5 router.
            historyApiFallback: false,
            // Suppress boring information.
            noInfo: true,
            // Proxy api to API Server
            proxy: {
                '/api/*': 'http://localhost:3000/',
            },
            // Limit logging
            stats: {
                version: false,
                colors: true,
                chunks: false,
                children: false
            },
        },
    };

    /*
     * Environment specific configuration
     */
    switch (environment) {
        case 'production':
        case 'staging':
            config.output.path = __dirname + '/dist';
            config.plugins.push(new webpack.NoErrorsPlugin());
            config.plugins.push(new extractTextPlugin('bundle-[hash].css'));
            config.plugins.push(new webpack.optimize.UglifyJsPlugin());
            config.plugins.push(new webpack.optimize.DedupePlugin());
            config.plugins.push(new webpack.optimize.OccurenceOrderPlugin());
            config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
            config.plugins.push(new webpack.optimize.CommonsChunkPlugin({name: 'vendor', minChunks: Infinity}));

            config.output.filename = '[name]-[hash].js';
            config.entry = {
                bundle: './app/index.js',
                vendor: ['angular', 'angular-ui-router', 'lodash', 'babel-polyfill']
            }

            config.devtool = 'source-map';

            config.module.preLoaders = []; // remove ESLint
            break;

        case 'development':
            // For options, see http://webpack.github.io/docs/configuration.html#devtool
            config.devtool = 'eval';
            config.entry.push('webpack/hot/dev-server');
            config.entry.push('webpack-dev-server/client?http://localhost:8080');
            config.plugins.push(new webpack.HotModuleReplacementPlugin());

            config.module.preLoaders.push({
                test: /\.js$/,
                loader: 'eslint',
                exclude: /(node_modules)/
            });

            config.cache = true;
            config.debug = true;
            break;

        default:
            console.warn('Unknown or undefined NODE_ENV. Please refer to package.json for available build commands.');
    }

    return config;
}
