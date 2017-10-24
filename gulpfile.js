var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var scssSource = './src/scss/main.scss',
    scssAll = './src/scss/**/*.scss',
    cssDest = './static/css';

gulp.task('sass', function() {
  return gulp.src(scssSource)
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCss())
    .pipe(gulp.dest(cssDest))
});

gulp.task('watch', ['sass'], function(){
  gulp.watch(scssAll, ['sass']);
});
