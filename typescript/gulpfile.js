var gulp = require("gulp");
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var webpack = require('webpack');
var fileinlcude = require('gulp-file-include');
var connect = require('gulp-connect');
var gulpOpen = require('gulp-open');
var webpackConfig = null;
var isProduct = false;
var argv = require('yargs').argv;

gulp.task('init', function(){
    isProduct = argv.product;
    if( isProduct ){
        webpackConfig = require('./webpack.config.product.js');
    }
    else{
        webpackConfig = require('./webpack.config.js');
    }
});

gulp.task('fileinclude', ()=>{
    gulp.src(['src/**/*'])
    .pipe(fileinlcude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('html', ['fileinclude'], () => {
    return gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload())
});

gulp.task('ts', ['fileinclude'], ()=>{
    return gulp.src('./src/*.ts')
    .pipe(plumber({
        errorHandler : function(error){
            this.emit('end');
        }
    }))
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload())
});

gulp.task('images', () => {
    gulp.src(['src/images/**'])
    .pipe(gulp.dest('dist/images'))
});

gulp.task('watch', () => {
    gulp.watch('./src/css/*.scss', ['sass']);
    gulp.watch('./src/**/*.ts', ['ts']);
    gulp.watch('./src/*.html', ['html'])
    gulp.watch('./src/images/**', ['images'])
});

gulp.task('connect', function() {
    connect.server({
    livereload: true,
    root: 'dist/',
    port: 8888
    });
});
    
gulp.task('open', () => {
    gulp.src('')
    .pipe(gulpOpen({
    uri: 'http://localhost:8888'
    }));
});

gulp.task('sass', ['fileinclude'], () => {
    return gulp.src(['./src/css/main.scss', 'src/css/*.css'])
    // 防止因为编译失败而退出
    .pipe(plumber({
        errorHandler: function(error) {
            this.emit('end')
        }
    }))
    // 压缩scss文件
    .pipe(sass({
    outputStyle: 'compressed'
    }))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(connect.reload());
});

gulp.task('default', ['init', 'sass', 'ts', 'html', 'watch', 'connect', 'open', 'fileinclude', 'images']);
/*gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});*/