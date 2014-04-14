var $, browserSync, destinations, distFolderName, gulp, gutil, injectPaths, isDist, libs, protractor, runSequence, sass, sources, testFiles, webdriver_update;

gulp = require('gulp');

gutil = require('gulp-util');

$ = require('gulp-load-plugins')();

sass = require('gulp-ruby-sass');

runSequence = require('run-sequence');

protractor = require('gulp-protractor').protractor;

webdriver_update = require('gulp-protractor').webdriver_update;

browserSync = require('browser-sync');

isDist = gutil.env.type === 'dist';

sources = {
  sass: 'src/style/**/*.scss',
  code: 'src/app/**/*.ts',
  app: ['src/**/*.ts', '!src/**/*.tests.js'],
  templates: 'src/templates/**/*.html',
  index: 'src/index.html',
  integration: 'src/tests/integration/**/*.js',
  assets: ['src/assets/**/*.png', 'src/assets/**/*.jpg']
};

distFolderName = isDist ? 'dist' : 'build';

destinations = {
  css: "" + distFolderName + "/style",
  assets: "" + distFolderName + "/assets",
  js: "" + distFolderName + "/src",
  libs: "" + distFolderName + "/libs",
  index: "" + distFolderName
};

libs = {
  dev: ['libs/angular/angular.js', 'libs/angular-ui-router/release/angular-ui-router.js'],
  dist: ['libs/angular/angular.min.js', 'libs/angular-ui-router/release/angular-ui-router.min.js']
};

testFiles = libs.dev;

testFiles = testFiles.concat(
    ['libs/angular-mocks/angular-mocks.js', 'build/src/templates.js', 'src/app/**/*.ts', 'src/tests/unit/**/*.js','!src/tests/integration/**/*.js'])
;

injectPaths = [
    "" + destinations.libs + "/angular." + (isDist ? 'min.' : '') + "js",
    "" + destinations.libs + "/angular-ui-router." + (isDist ? 'min.' : '') + "js",
    "" + destinations.js + "/**/*.js", "" + destinations.css + "/*.css"
];

gulp.task('style', function() {
  return gulp.src(sources.sass).pipe(sass({
    style: 'nested'
  })).pipe(gulp.dest(destinations.css));
});

gulp.task('lint', function() {
     return gulp.src(sources.code)
        .pipe($.tslint())
        .pipe($.tslint.report('prose', {
          emitError: true
        }));
});

gulp.task('typescript', function() {
  return gulp.src(sources.app).pipe($.tsc({
    emitError: false
  })).pipe(gulp.dest(destinations.js));
});

gulp.task('templates', function() {
  return gulp.src(sources.templates).pipe($.minifyHtml({
    empty: true,
    spare: true,
    quotes: true
  })).pipe($.ngHtml2js({
    moduleName: 'templates'
  })).pipe($.concat('templates.js')).pipe(isDist ? $.uglify() : gutil.noop()).pipe(gulp.dest(destinations.js));
});

gulp.task('libs', function() {
  return gulp.src(isDist ? libs.dist : libs.dev).pipe(gulp.dest(destinations.libs));
});

gulp.task('assets', function() {
  return gulp.src(sources.assets).pipe(gulp.dest(destinations.assets));
});

gulp.task('index', function() {
  return gulp.src(injectPaths, {
    read: false
  }).pipe($.inject(sources.index, {
    ignorePath: distFolderName,
    addRootSlash: false
  })).pipe(gulp.dest(destinations.index));
});

gulp.task('karma', function() {
  return gulp.src(testFiles).pipe($.karma({
    configFile: 'karma.conf.js',
    action: 'run'
  })).on('error', function(err) {
    console.log(err);
    throw err;
  });
});

gulp.task('test-continuous', function() {
  return gulp.src(testFiles).pipe($.karma({
    configFile: 'karma.conf.coffee',
    action: 'watch'
  }));
});

gulp.task('webdriver_update', webdriver_update);

gulp.task('protractor', ['webdriver_update'], function() {
  return gulp.src(sources.integration).pipe(protractor({
    configFile: 'protractor.conf.js'
  })).on('error', function(e) {
    throw e;
  });
});

gulp.task('ci', ['karma', 'protractor']);

gulp.task('clean', function() {
  return gulp.src(['dist/', 'build/'], {
    read: false
  }).pipe($.clean());
});

gulp.task('browser-sync', function() {
  return browserSync.init(['build/*.html', 'build/**/*.js', 'build/style/*.css'], {
    server: {
      baseDir: './build'
    },
    open: false
  });
});

gulp.task('default', ['build'], function() {
  return runSequence('browser-sync', ['watch', 'test-continuous']);
});

gulp.task('build', function() {
  return runSequence('clean', ['style', 'assets', 'lint', 'typescript', 'templates', 'libs'], 'index');
});

gulp.task('watch', function() {
  gulp.watch(sources.sass, ['style']);
  gulp.watch(sources.app, ['lint', 'typescript']);
  gulp.watch(sources.templates, ['templates']);
  gulp.watch(sources.index, ['index']);
  return gulp.watch(sources.assets, ['assets']);
});
