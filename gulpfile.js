const gp = require('gulp');
const tsify = require('tsify');
const pug = require('gulp-pug');
const stylus = require('gulp-stylus');
const minify = require('gulp-minify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const babel = require('babelify');
const uglify = require('uglifyify');

gp.task('bundle', () => {
    browserify('assets/main.ts')
        .plugin(tsify)
        .transform(babel, { presets: ["@babel/preset-env"] })
        .transform(uglify, { global: true })
        .bundle()
        .on('error', function(err) {
            console.error(err.message);
            this.emit('end');
        })
        .pipe(source('bundle.js'))
        .pipe(gp.dest('public/js'));
});

gp.task('stylus', () => {
    gp.src('assets/components/stylus/common.styl')
        .pipe(stylus())
        .pipe(gp.dest('public/css'));
});

gp.task('pug', () => {
    gp.src('assets/views/**/*.pug')
        .pipe(pug())
        .pipe(gp.dest('public'))
});

gp.task('watch', () => {
    gp.watch(['assets/components/**/*.styl', 'assets/mixins/stylus/**/*.styl'], ['stylus']);
    gp.watch(['assets/components/**/*.pug', 'assets/mixins/pug/**/*.pug', 'assets/views/**/*.pug'], ['pug']);
    gp.watch(['assets/modules/**/*.ts', 'assets/components/**/*.ts', 'assets/*.ts'], ['bundle']);
});

gp.task('build', ['bundle', 'stylus', 'pug']);
gp.task('default', ['build', 'watch']);