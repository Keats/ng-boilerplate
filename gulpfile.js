var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
plugins.sass = require('gulp-ruby-sass');

var runSequence = require('run-sequence');
var browserSync = require('browser-sync');


// VARIABLES ======================================================
var isDist = plugins.util.env.type === 'dist';
var outputFolder = isDist ? 'dist' : 'build';

var globs = {
    sass: 'src/style/**/*.scss',
    templates: 'src/templates/**/*.html',
    assets: 'src/assets/**/*.*',
    app: 'src/app/**/*.ts',
    appWithDefinitions: 'src/**/*.ts',
    integration: 'src/tests/integration/**/*.js',
    index: 'src/index.html'
};

var destinations = {
    css: "" + outputFolder + "/style",
    js: "" + outputFolder + "/src",
    libs: "" + outputFolder + "/vendor",
    assets: "" + outputFolder + "/assets",
    index: "" + outputFolder
};

// find a better way to handle 3rd party vendor than that
var vendor = {
    dev: [
        'vendor/angular/angular.js',
        'vendor/angular-ui-router/release/angular-ui-router.js',
        'vendor/lodash/dist/lodash.js',
        'vendor/restangular/dist/restangular.js',
    ],
    dist: [
        'vendor/angular/angular.min.js',
        'vendor/angular-ui-router/release/angular-ui-router.min.js',
        'vendor/lodash/dist/lodash.min.js',
        'vendor/restangular/dist/restangular.min.js',
    ]
};

var injectPaths = [
    "" + destinations.libs + "/angular." + (isDist ? 'min.' : '') + "js",
    "" + destinations.libs + "/angular-ui-router." + (isDist ? 'min.' : '') + "js",
    "" + destinations.libs + "/lodash." + (isDist ? 'min.' : '') + "js",
    "" + destinations.libs + "/restangular." + (isDist ? 'min.' : '') + "js",
    "" + destinations.js + "/app/**/*.js",
    "" + destinations.js + "/templates.js",
    "" + destinations.css + "/*.css"
];

var karma = require('gulp-karma')({
    configFile: 'karma.conf.js'
});

// TASKS ===========================================================

gulp.task('sass', function () {
    return gulp.src(globs.sass)
        .pipe(plugins.sass({style: isDist ? 'compressed' : 'nested'}))
        .pipe(gulp.dest(destinations.css))
        .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('ts-lint', function () {
    return gulp.src(globs.app)
        .pipe(plugins.tslint())
        .pipe(plugins.tslint.report('prose', {emitError: true}));
});

gulp.task('ts-compile', function () {
    return gulp.src(globs.appWithDefinitions)
        .pipe(plugins.tsc({emitError: false}))
        .pipe(isDist ? plugins.concat('app.js') : plugins.util.noop())
        .pipe(isDist ? plugins.uglify() : plugins.util.noop())
        .pipe(gulp.dest(destinations.js));
});

gulp.task('templates', function () {
    return gulp.src(globs.templates)
        .pipe(plugins.minifyHtml({
            empty: true,
            spare: true,
            quotes: true
        }))
        .pipe(plugins.ngHtml2js({moduleName: 'templates'}))
        .pipe(plugins.concat('templates.js'))
        .pipe(isDist ? plugins.uglify() : plugins.util.noop())
        .pipe(gulp.dest(destinations.js))
        .pipe(browserSync.reload({stream: true, once: true}));
});

gulp.task('clean', function () {
    return gulp.src(['dist/', 'build/'], {read: false})
        .pipe(plugins.clean());
});

gulp.task('karma-once', function () {
    return karma.once();
});

gulp.task('karma-watch', function () {
    return karma.start({autoWatch: true});
});

gulp.task('webdriver_update', plugins.protractor.webdriver_update);

gulp.task('protractor', ['webdriver_update'], function () {
    return gulp.src(globs.integration)
        .pipe(plugins.protractor.protractor({configFile: 'protractor.conf.js'}));
});

gulp.task('browser-sync', function () {
    browserSync.init(null, {
        server: {baseDir: "./build"},
        open: false
    });
});

gulp.task('copy-vendor', function () {
    return gulp.src(isDist ? vendor.dist : vendor.dev)
        .pipe(gulp.dest(destinations.libs));
});

gulp.task('copy-assets', function () {
    return gulp.src(globs.assets)
        .pipe(gulp.dest(destinations.assets));
});

gulp.task('index', function () {
    return gulp.src(injectPaths, {read: false})
        .pipe(plugins.inject(globs.index, {
            ignorePath: outputFolder,
            addRootSlash: false
        }))
        .pipe(gulp.dest(destinations.index));
});

gulp.task('watch', function () {
    gulp.watch(globs.sass, ['sass']);
    gulp.watch(globs.appWithDefinitions, ['ts-lint', 'ts-compile']);
    gulp.watch(globs.templates, ['templates']);
    gulp.watch(globs.index, ['index']);
    gulp.watch(globs.assets, ['copy-assets']);
});

gulp.task('build', function () {
    return runSequence(
        'clean',
        ['sass', 'copy-assets', 'ts-compile', 'templates', 'copy-vendor'],
        'index'
    );
});

gulp.task('default', ['browser-sync', 'build'], function () {
    return runSequence(['watch', 'karma-watch']);
});
