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
protractor = require('gulp-protractor').protractor
connect = require 'gulp-connect'

# CONFIG -------------------------------------------

# Pass the env by using: gulp --type ENV_NAME
isDist = gutil.env.type is 'dist'

# File sources, both origin and destinations
sources =
  sass: 'src/style/*.scss'
  coffee: 'src/**/*coffee'
  app: ['src/**/*.coffee', '!src/**/*.tests.coffee']
  templates: 'src/templates/**/*.html'
  index: 'src/index.html'
  integration: 'src/tests/integration/**/*.coffee'
  assets: ['src/assets/**/*.png', 'src/assets/**/*.jpg']

distFolderName = if isDist then 'dist' else 'build'
destinations =
  css: "#{ distFolderName }/style"
  assets: "#{ distFolderName }/assets"
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
  'src/**/*.coffee',
  '!src/tests/integration/**/*.coffee'
]

# JS/CSS to inject in index.html
# Order is important when injecting them into index.html
injectPaths = [
  sources.index
  "#{ destinations.libs }/angular.#{ if isDist then 'min.' else '' }js"
  "#{ destinations.libs }/angular-ui-router.#{ if isDist then 'min.' else '' }js"
  "#{ destinations.js }/**/*.js"
  "#{ destinations.css }/*.css"
]

# TASKS ----------------------------------------------------------------------

# Allows to autoreload the page
gulp.task 'connect', connect.server(
  root: ['build'] # this is the directory the server will run
  port: 1337
  livereload: true
)

# Compiles SASS with libsass to a compressed output
gulp.task 'style', ->
  gulp.src(sources.sass)
  .pipe(sass({outputStyle: 'compressed'}))
  .pipe(gulp.dest(destinations.css))
  .pipe(connect.reload())

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

  stream.pipe(gulp.dest(destinations.js)).pipe(connect.reload())

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
  .pipe(connect.reload())

# Copy the 3rd party libs over
gulp.task 'libs', ->
  gulp.src(if isDist then libs.dist else libs.dev)
  .pipe(gulp.dest(destinations.libs))

# Copy .png and .jpg only for now
gulp.task 'assets', ->
  gulp.src(sources.assets)
  .pipe(gulp.dest(destinations.assets))
  .pipe(connect.reload())

# Injects js/css tags into index.html
gulp.task 'index', ->
  gulp.src(injectPaths, {read: false})
  .pipe(inject(sources.index, {ignorePath: distFolderName, addRootSlash: false}))
  .pipe(gulp.dest(destinations.index))
  .pipe(connect.reload())

# Run tests only once with karma
gulp.task 'karma', ->
  gulp.src(testFiles)
  .pipe(karma(
    configFile: 'karma.conf.coffee'
    action: 'run'
  ))
  # TODO: handle errors (ie tests failed) when it's merged in gulp-karma

# Run karma and tell it to run the tests on filechanges
gulp.task 'test-continuous', ->
  gulp.src(testFiles)
  .pipe(karma(
    configFile: 'karma.conf.coffee'
    action: 'watch'
  ))

# Setting up the test task
gulp.task 'protractor', ->
  gulp.src(sources.integration)
  .pipe(protractor(configFile: 'protractor.conf.js'))
  .on 'error', (e) -> throw e

gulp.task 'ci', ['karma', 'protractor']

# Deletes build/ and dist/
gulp.task 'clean', ->
  gulp.src(['dist/', 'build/'], {read: false}).pipe(clean())

# By default, we first want to build the project, then start karma runner and
# the watchers
gulp.task 'default', ->
  runSequence 'build', ['connect', 'test-continuous', 'watch']

# Build the project
gulp.task 'build', ->
  runSequence 'clean', ['style', 'assets', 'lint', 'scripts', 'templates', 'libs'], 'index'

# Setup watchers for the different files
gulp.task 'watch', ->
  gulp.watch sources.sass, ['style']
  gulp.watch sources.app, ['lint', 'scripts', 'index']
  gulp.watch sources.templates, ['templates']
  gulp.watch sources.index, ['index']
  gulp.watch sources.assets, ['assets']
