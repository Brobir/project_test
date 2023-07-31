const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify-es').default;
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const svgsprite = require('gulp-svg-sprite');
const fonter = require('gulp-fonter');
const ttf2woff2 = require('gulp-ttf2woff2');
const include = require('gulp-include');
const ftp = require('vinyl-ftp');

function pages() {
    return src('app/pages/*.html')
        .pipe(include())
        .pipe(dest('app'))
        .pipe(browserSync.stream())
}

function images() {
    return src(['app/img/src/*.*', '!app/img/src/*.svg'])
        .pipe(newer('app/img'))
        .pipe(avif({ quality : 50}))

        .pipe(src('app/img/src/*.*'))
        .pipe(newer('app/img'))
        .pipe(webp())

        .pipe(src('app/img/src/*.*'))
        .pipe(newer('app/img'))
        .pipe(imagemin())

        .pipe(dest('app/img'))
}

function sprite() {
    return src('app/img/*.svg')
    .pipe(svgsprite({
        mode : {
            stack : {
                sprite : '../sprite.svg',
                example : true
            }
        }
    }))
    .pipe(dest('app/img'))
}

function fonts() {
    return src('app/fonts/src/*.*')
    .pipe(fonter({
        formats : ['woff', 'ttf']
    }))
    .pipe(src('app/fonts/*.ttf'))
    .pipe(ttf2woff2())
    .pipe(dest('app/fonts'))
}

function styles() {
    return src('app/scss/style.scss')
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'] 
        }))
        .pipe(concat('style.min.css'))
        .pipe(scss({outputStyle: 'compressed'}))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/swiper/swiper-bundle.js',
        'app/js/main.js'
    ])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('app/js'))
        .pipe(browserSync.stream())
}

function watching(){
    browserSync.init({
        server: {
            baseDir: "app/"
        }
    });

    watch(['app/scss/style.scss'], styles)
    watch(['app/img/src'], images)
    watch(['app/js/main.js'], scripts)
    watch(['app/components/*.*', 'app/pages/*.*'], pages)
    watch(['app/*.html']).on('change', browserSync.reload)
}

function building() {
    return src([
        'app/css/style.min.css',
        'app/img/*.*',
        '!app/img/*.svg',
        // 'app/img/sprite.svg',
        'app/fonts/*.*',
        'app/js/main.min.js',
        'app/**/*.html',
        '!app/components/*.html',
        '!app/pages/*.html',
        '!app/img/stack/sprite.stack.html'
    ], {base : 'app'})
        .pipe(dest('dist'))
}

function cleanDist() {
    return src('dist')
        .pipe(clean())
}

function deploy() {
    var conn = ftp.create({
        host:     'h44.netangels.ru',
        user:     'c78320_brobir_ru_na4u_ru',
        password: 'RuXcaJezvazug16',
        parallel: 10,
    });

    var globs = [
        'dist/css/**',
        'dist/js/**',
        'dist/fonts/**',
        'dist/img/**',
        'dist/index.html'
    ];

    return src(globs, { base: 'dist', buffer: false } )
        .pipe(conn.newer('/www'))
        .pipe(conn.dest('/www'));
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.images = images;
exports.sprite = sprite;
exports.fonts = fonts;
exports.pages = pages;
exports.building = building;
exports.deploy = deploy;

exports.build = series(cleanDist, building);
exports.default = parallel(styles, scripts, pages, watching);