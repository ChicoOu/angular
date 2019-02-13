var gulp = require("gulp");
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var webpack = require('webpack-stream');
var connect = require('gulp-connect');
var gulpOpen = require('gulp-open');
var concat = require('gulp-concat');
var webpackConfig = require('./webpack.config.js');
var isProduct = false;
var argv = require('yargs').argv;

var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');

gulp.task('init', function(done){
    isProduct = argv.product;
    if( isProduct ){
        webpackConfig = require('./webpack.config.product.js');
    }

    done();
});

gulp.task('html', () => {
    return gulp.src('./src/*.html')
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());
});

gulp.task('ts', ()=>{
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

gulp.task('images', (done) => {
    gulp.src(['src/images/**'])
    .pipe(gulp.dest('dist/images'));
    done();
});

gulp.task('watch', async() => {
    gulp.watch('./src/css/*.scss', gulp.parallel(['css']));
    gulp.watch('./src/**/*.ts', gulp.parallel(['ts']));
    gulp.watch('./src/*.html', gulp.parallel(['html']));
    await gulp.watch('./src/images/**', gulp.parallel(['images']));
});

gulp.task('connect', async() => {
    await connect.server({
        livereload: true,
        root: 'dist/',
        port: 8888
    });
});
    
gulp.task('open', async() => {
    await gulp.src('dist/index.html')
    .pipe(gulpOpen({
    uri: 'http://localhost:8888'
    }));
});

gulp.task('css', () => {
    var processors = [
        autoprefixer,
        cssnano
    ];

    return gulp.src(['src/css/*.scss', 'src/css/*.css'])
    // 防止因为编译失败而退出
    .pipe(plumber({
        errorHandler: function(error) {
            this.emit('end');
        }
    }))
    // 压缩scss文件
    .pipe(sass({
        outputStyle: 'compressed'
    }))
    .pipe(postcss(processors))
    .pipe(concat('style.min.css'))
    .pipe(gulp.dest('./dist/css/'))
    .pipe(connect.reload());
});

gulp.task('default', 
    gulp.series(['init', 'images', 'css', 'ts', 'html', gulp.parallel(['watch', 'connect', 'open'])]));
/*gulp.task("default", function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("dist"));
});*/