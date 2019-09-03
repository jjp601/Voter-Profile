const gulp = require('gulp');
const terser = require('gulp-terser');
const livereload = require('gulp-livereload');
const concat = require('gulp-concat');
const minifyCss = require('gulp-minify-css');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const del = require('del');

// Image compression
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');

// File paths
const DIST_PATH = 'public/dist';
const SCRIPTS_PATH = 'public/scripts/**/*.js';
const CSS_PATH = 'public/css/**/*.css';
const IMAGES_PATH = 'public/images/**/*.{png,jpeg,jpg,svg,gif}';

// CSS Styles
// gulp.task('styles', function() {
//     console.log('starting styles task');
//     return gulp.src(['public/css/reset.css', CSS_PATH])
//         .pipe(plumber(function(err) {
//             console.log('Styles Task Error');
//             console.log(err);
//             this.emit('end');
//         }))
//         .pipe(sourcemaps.init())
//         .pipe(autoprefixer())
//         .pipe(concat('styles.css'))
//         .pipe(minifyCss())
//         .pipe(sourcemaps.write())
//         .pipe(gulp.dest(DIST_PATH))
//         .pipe(livereload());
// })

// SCSS Styles
gulp.task('styles', function() {
    console.log('starting styles task');
    return gulp.src('public/scss/styles.scss')
        .pipe(plumber(function(err) {
            console.log('Styles Task Error');
            console.log(err);
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
})

// Scripts
gulp.task('scripts', function() {
    console.log('starting scripts task');

    return gulp.src(SCRIPTS_PATH)
        .pipe(plumber(function(err) {
            console.log('Scripts Task Error')
            console.log(err)
            this.emit('end');
        }))
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DIST_PATH))
        .pipe(livereload());
})

// Images
gulp.task('images', function() {
    return gulp.src(IMAGES_PATH)
        .pipe(imagemin(
            [
                imagemin.gifsicle(),
                imagemin.jpegtran(),
                imagemin.optipng(),
                imagemin.svgo(),
                imageminPngquant(),
                imageminJpegRecompress()
            ]
        ))
        .pipe(gulp.dest(DIST_PATH + '/images'));
})

gulp.task('clean', function() {
    return del.sync([
        DIST_PATH
    ])
})

gulp.task('default', ['images', 'styles', 'scripts'], function() {
    console.log('Starting default task.');
})

gulp.task('watch', ['default'], function() {
    console.log('starting the watch task');
    require('./server.js');
    livereload.listen();
    gulp.watch(SCRIPTS_PATH, ['scripts']);
    // gulp.watch(CSS_PATH, ['styles']);
    gulp.watch('public/scss/**/*.scss', ['styles']);
});