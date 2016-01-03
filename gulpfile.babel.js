'use strict';

import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import eslint from 'gulp-eslint';
import del from 'del';
import webpack from 'webpack-stream';

// lint all JS code
gulp.task('lint', () => {
    return gulp.src(['./server/**/*.js'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

// serve for development
gulp.task('serve', () => {
    nodemon({
        script: './server/server.js',
        ext: 'js', //watch all JS files in the /api folder,
        ignore: [
            'node_modules/**',
        ],
        watch: 'server',
        env: { 'NODE_ENV': 'development' },
        tasks: ['lint'],
    });
});

gulp.task('bundle', () => {
    return gulp.src('app/app.js')
        .pipe(webpack(require('./webpack.config.js')))
        .pipe(gulp.dest('dist/build'));
});

// cleanup
gulp.task('clean', () => {
    return del([
        'dist',
    ]);
});

gulp.task('build', ['bundle']);

gulp.task('default', ['serve']);
