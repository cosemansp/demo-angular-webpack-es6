var webpackConfigFactory = require('./webpack.config.factory.js');

// This file is primary used to run the webpack tools (webpack & webpack-dev-server)
// from the commandline.

// It's just a pass-though which passed the current NODE-ENV to the factory
module.exports = webpackConfigFactory(process.env.NODE_ENV || 'development')
