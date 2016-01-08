'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('styles', function() {
    return gulp.src([
            'src/styles/**/*.scss'
        ])
        .pipe($.concat('newtab.css'))
        .pipe($.sass())
        .pipe($.minifyCss())
        .pipe(gulp.dest('build'));
});

gulp.task('scripts', function() {
    return gulp.src([
            'node_modules/moment/min/moment.min.js',
            'src/scripts/**/*.js'
        ])
        .pipe($.concat('newtab.js'))
        .pipe($.uglify())
        .pipe(gulp.dest('build'));
});

gulp.task('build', ['styles', 'scripts']);

gulp.task('watch', ['styles', 'scripts'], function() {
    gulp.watch('src/styles/**/*.scss', ['styles']);
    gulp.watch('src/scripts/**/*.js', ['scripts']);
});

gulp.task('default', ['watch']);
