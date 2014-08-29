var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
plugins.sass = require('gulp-ruby-sass');
plugins.ngAnnotate = require('gulp-ng-annotate');

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

// When adding a 3rd party we want to insert in the html, add it to
// vendoredLibs, order matters
var vendoredLibs = [
    'vendor/angular.js',
    'vendor/ui-router.js',
    'vendor/lodash.js',
    'vendor/restangular.js',
];

var injectLibsPaths = [];

vendoredLibs.forEach(function(lib) {
    injectLibsPaths.push(destinations.libs + '/' + lib.split('/')[1]);
});

var injectPaths = injectLibsPaths.concat([
    isDist? destinations.js + '/app.js' : destinations.js + "/app/**/*.js",
    destinations.js + "/templates.js",
    destinations.css + "/*.css"
]);

var karma = require('gulp-karma')({
    configFile: 'karma.conf.js'
});

// TASKS ===========================================================

gulp.task('sass', function () {
    return gulp.src(globs.sass)
        .pipe(plugins.sass({style: isDist ? 'compressed' : 'nested'}))
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest(destinations.css));
});

gulp.task('ts-lint', function () {
    return gulp.src(globs.app)
        .pipe(plugins.tslint())
        .pipe(plugins.tslint.report('prose', {emitError: true}));
});

var tsProject = plugins.type.createProject({
    declarationFiles: true,
    noExternalResolve: true
});

gulp.task('ts-compile', function () {
    var tsResult = gulp.src(globs.appWithDefinitions)
        .pipe(plugins.type(tsProject));

    return tsResult.js.pipe(isDist ? plugins.concat('app.js') : plugins.util.noop())
        .pipe(plugins.ngAnnotate())
        .pipe(isDist ? plugins.uglify() : plugins.util.noop())
        .pipe(plugins.wrap({ src: './iife.txt'}))
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
        .pipe(gulp.dest(destinations.js));
});

gulp.task('clean', function () {
    return gulp.src(['dist/', 'build/'], {read: false})
        .pipe(plugins.rimraf());
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
  return browserSync.init(null, {
    open: false,
    server: {
      baseDir: "./build"
    },
    watchOptions: {
      debounceDelay: 1000
    }
  });
});

gulp.task('copy-vendor', function () {
    return gulp.src(vendoredLibs)
        .pipe(isDist ? plugins.uglify() : plugins.util.noop())
        .pipe(gulp.dest(destinations.libs));
});

gulp.task('copy-assets', function () {
    return gulp.src(globs.assets)
        .pipe(gulp.dest(destinations.assets));
});

gulp.task('index', function () {
    var target = gulp.src(globs.index);
    return target.pipe(
        plugins.inject(gulp.src(injectPaths, {read: false}), {
            ignorePath: outputFolder,
            addRootSlash: false
        })
    ).pipe(gulp.dest(destinations.index));
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch(globs.sass, ['sass']);
    gulp.watch(globs.appWithDefinitions, ['ts-lint', 'ts-compile']);
    gulp.watch(globs.templates, ['templates']);
    gulp.watch(globs.index, ['index']);
    gulp.watch(globs.assets, ['copy-assets']);

    gulp.watch('build/**/*', function(file) {
      if (file.type === "changed") {
        return browserSync.reload(file.path);
      }
    });
});

gulp.task('build', function () {
    return runSequence(
        'clean',
        ['sass', 'copy-assets', 'ts-compile', 'templates', 'copy-vendor'],
        'index'
    );
});

gulp.task('default', ['build'], function () {
    return runSequence(['watch', 'karma-watch']);
});
