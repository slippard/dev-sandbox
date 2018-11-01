var gulp = require('gulp');
var ts = require('gulp-typescript');
var runSequence = require('run-sequence');
var tsProject = ts.createProject('tsconfig.json');
var del = require('del');

gulp.task('default', function (callback) {
    return runSequence('clean', 'ts', 'merge', function (error) {
        if (error) {
            console.error(error);
        }
        callback(error);
    });
});

gulp.task('clean', function () {
    return del([
        'dist/'
    ]);
});

gulp.task('ts', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
});

gulp.task('merge', function() {
    gulp.src('src/*.json')
    .pipe(gulp.dest('./dist'));
});