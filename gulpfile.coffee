# PLUGINS ------------------------------------------
gulp = require 'gulp'
gutil = require 'gulp-util'

sass = require 'gulp-sass'
coffeelint = require 'gulp-coffeelint'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
html2js = require 'gulp-ng-html2js'
minifyHTML = require 'gulp-minify-html'
inject = require 'gulp-inject'
clean = require 'gulp-clean'
runSequence = require 'run-sequence'
debug = require 'gulp-debug'
karma = require 'gulp-karma'


# CONFIG -------------------------------------------

# Pass the env by using: gulp --type ENV_NAME
isDist = gutil.env.type is 'dist';

# File sources, both origin and destinations
sources =
  sass: 'src/style/*.scss'
  coffee: 'src/**/*coffee'
  app: ['src/**/*.coffee', '!src/**/*.tests.coffee']
  tests: 'src/**/*.tests.coffee'
  templates: 'src/**/*.html'
  index: 'src/index.html'

distFolderName = if isDist then 'dist' else 'build'
destinations =
  css: "#{ distFolderName }/style"
  js: "#{ distFolderName }/src"
  libs: "#{ distFolderName }/libs"
  index: "#{ distFolderName }"

# 3rd party libs, needs to be updated everytime we add a lib
libs =
  dev: [
    'libs/angular/angular.js',
    'libs/angular-ui-router/release/angular-ui-router.js',
  ]
  dist: [
    'libs/angular/angular.min.js',
    'libs/angular-ui-router/release/angular-ui-router.min.js',
  ]

# The gulp plugin for karma needs the files to load here instead of in the
# karma.config.coffee
testFiles = libs.dev;
testFiles = testFiles.concat [
  'libs/angular-mocks/angular-mocks.js',
  'build/src/templates.js',
  'src/**/*.coffee'
]

# JS/CSS to inject in index.html
# Order is important when injecting them into index.html
injectPaths = [
  "#{ destinations.libs }/angular.#{ if isDist then 'min.' else '' }js"
  "#{ destinations.libs }/angular-ui-router.#{ if isDist then 'min.' else '' }js"
  "#{ destinations.js }/**/*.js"
  "#{ destinations.css }/*.css"
]

# TASKS ----------------------------------------------------------------------

# Compiles SASS with libsass to a compressed output
gulp.task 'style', ->
  gulp.src(sources.sass)
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(gulp.dest(destinations.css))

# Checks that the coffeescript code passes linting
gulp.task 'lint', ->
  gulp.src(sources.coffee)
  .pipe(coffeelint())
  .pipe(coffeelint.reporter())

# Compiles to coffeescript.
# If we are in dist env, concat all the files and uglify them
gulp.task 'scripts', ->
  stream = gulp.src(sources.app)
  .pipe(coffee({bare: true}).on('error', gutil.log))

  # On dist env, we only want one uglified file for the whole app
  if isDist
    stream = stream.pipe(concat('app.js')).pipe(uglify())

  stream.pipe(gulp.dest(destinations.js))

# Transforms the templates to js using html2js to a single file and minify it
gulp.task 'templates', ->
  gulp.src(sources.templates)
  .pipe(minifyHTML(
      empty: true
      spare: true
      quotes: true
  ))
  .pipe(html2js({moduleName: 'templates'}))
  .pipe(concat('templates.js'))
  .pipe(if isDist then uglify() else gutil.noop())
  .pipe(gulp.dest(destinations.js))

# Copy the 3rd party libs over
gulp.task 'libs', ->
  gulp.src(if isDist then libs.dist else libs.dev)
  .pipe(gulp.dest(destinations.libs))

# Injects js/css tags into index.html
gulp.task 'index', ->
  gulp.src(injectPaths, {read: false})
  .pipe(inject(sources.index, {ignorePath: distFolderName, addRootSlash: false}))
  .pipe(gulp.dest(destinations.index))

# Run tests only once with karma
gulp.task 'test', ->
  gulp.src(testFiles)
  .pipe(karma(
    configFile: 'karma.conf.coffee'
    action: 'run'
  ))

# Run karma and tell it to run the tests on filechanges
gulp.task 'test-continuous', ->
  gulp.src(testFiles)
  .pipe(karma(
      configFile: 'karma.conf.coffee'
      action: 'watch'
    ))

# Delets build/ and dist/
gulp.task 'clean', ->
  gulp.src(['dist/', 'build/'], {read: false}).pipe(clean())

# By default, we first want to build the project, then start karma runner and
# the watchers
gulp.task 'default', ->
  runSequence 'build', ['test-continuous', 'watch']

# Build the project
gulp.task 'build', ->
  runSequence 'clean', ['style', 'lint', 'scripts', 'templates', 'libs'], 'index'

# Setup watchers for the different files
gulp.task 'watch', ->
  gulp.watch sources.sass, ['style']
  gulp.watch sources.app, ['lint', 'scripts', 'index']
  gulp.watch sources.templates, ['templates']
  gulp.watch sources.index, ['index']
