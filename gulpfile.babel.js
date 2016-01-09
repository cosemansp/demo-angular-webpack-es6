'use strict';

import 'babel-polyfill';  // so we can use
import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import eslint from 'gulp-eslint';
import del from 'del';
import runSequence from "run-sequence";
import packageJson from "./package.json";
import gulpLoadPlugins from "gulp-load-plugins";
import webpack from "webpack";
import WebpackDevServer from "webpack-dev-server";
import webpackConfigFactory from "./webpack.config.factory";

const SERVER_PORT = process.env.PORT || 3000;
const DEV_SERVER_PORT = process.env.DEV_SERVER_PORT || 8080;
const $ = gulpLoadPlugins({camelize: true});

// Main tasks
gulp.task('default', ['serve']);
gulp.task('serve', () => runSequence('serve:dev-server', 'serve:api'));
gulp.task('serve-prod', () => runSequence('build', 'serve:prod'));
gulp.task('build', () => runSequence('clean', 'bundle', 'copy-to-dist', 'index'));

// Lint all JS code
gulp.task('lint', () => {
    return gulp.src(['./server/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

// Serve API server for development
gulp.task('serve:api', () => {
    nodemon({
        script: './server/server.js',
        ext: 'js',
        ignore: [
            'node_modules/**',
        ],
        watch: 'server',
        env: { 'NODE_ENV': 'development' },
        tasks: ['lint'],
    });
});

// Production specific task,
gulp.task('serve:prod', () => {
    nodemon({
        script: './server/server.js',
        ext: 'js',
        env: {'NODE_ENV': 'production'},
        watch: 'server',
    });
});

// Start a livereloading development server
gulp.task('serve:dev-server', () => {
    const config = webpackConfigFactory('development');
    const compiler = webpack(config);
    return new WebpackDevServer(compiler, config.devServer)
        .listen(DEV_SERVER_PORT, 'localhost', (err) => {
            //if (err)
            //    throw new $.util.PluginError('webpack-dev-server', err);

            $.util.log("Webpack-dev-server", `Listening at localhost:${DEV_SERVER_PORT}`);
        });
});

// Create a distributable package
gulp.task('bundle', cb => {
    const config = webpackConfigFactory('production');

    webpack(config, (err, stats) => {
        if (err) {
            throw new $.util.PluginError('dist', err);
        }
        $.util.log('bundle', stats.toString({
            colors: true,
            chunks: false,
            children: false
        }));
       cb();
    });
});

// Copy all static files to the dist folder
gulp.task('copy-to-dist', function() {
    return gulp.src([
            './app/**/*.html',
            '!./app/index.html'
        ])
        .pipe(gulp.dest('dist'))
        .pipe($.size({title: 'static'}))
});

// Copy our index file and inject css/script imports for this build
gulp.task('index', () => {
    var sources = gulp.src(['./*.js', './*.css'], {read: false, cwd: 'dist'});
    return gulp.src('./app/index.html')
               .pipe($.inject(sources))
               .on("error", $.util.log)
               .pipe(gulp.dest('dist'));
});

// Remove all build files
gulp.task('clean', () => {
    return del([
        'dist',
        'app/bundle.*'
    ]);
});
