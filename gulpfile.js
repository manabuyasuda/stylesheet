var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var csscomb = require('gulp-csscomb');

/**
 * 処理前のソースへのパス。
 */
var source = {
  'sass': 'source/assets/stylesheet/**/*.scss'
}

/**
 * 処理後に出力するパス。
 */
var build = {
  'css': 'build/css/'
}

/**
 * `.scss`を`.css`にコンパイルします。
 * 対象は`source/asset/stylesheet/`の中にある`.scss`ファイルです。
 * ベンダープレフィックスを付与後、csscombで整形されます。
 * sourcemapsは`.css`と同じディレクトリに出力されます。
 */
gulp.task('sass', function(){
  return gulp.src(source.sass)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 3 versions'],
    }))
    .pipe(csscomb())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(build.css));
});

/**
 * watchタスクを指定します。
 */
gulp.task('watch', function() {
  gulp.watch(source.sass, ['sass']);
});

/**
 * `sass`タスクを実行後、`watch`タスクを実行します。
 */
gulp.task('default', ['sass', 'watch']);