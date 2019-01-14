const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

// Server
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});

// Html
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('source/template/index.html')
        .pipe(gulp.dest('build'))
});

//saas
gulp.task('styles:compile', function () {
    return gulp.src('source/styles/style.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(concat('main.min.css'))
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('build/css'));
});

//css bootstrap 3
gulp.task('styles-bs:compile', function() {
    return gulp.src(['node_modules/bootstrap/dist/css/bootstrap.min.css'])
        .pipe(gulp.dest('build/css'));
});


//js
gulp.task('scripts:compile', function buildJS() {
    return gulp.src(['source/js/script.js', 'node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/jquery/dist/jquery.min.js', 'node_modules/popper.js/dist/umd/popper.min.js'])
        .pipe(gulp.dest('build/js'))
});

//sprite
gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global'));
    cb();
});

//delete
gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});

//copy fonts
gulp.task('copy:fonts', function () {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});

//copy images
gulp.task('copy:images', function () {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('build/images'));
});

//copy
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));

//watchers
gulp.task('watch', function(){
   gulp.watch('source/template/**/*.html', gulp.series('templates:compile'));
   gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
   gulp.watch('source/js/**/*.js', gulp.series('scripts:compile'));
});

//default
gulp.task('default', gulp.series(
  'clean',
  gulp.parallel('templates:compile', 'styles:compile', 'styles-bs:compile', 'scripts:compile', 'sprite', 'copy'),
  gulp.parallel('watch', 'server')
  )
);