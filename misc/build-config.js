
// Will get/set all variables needed in the grunt task
// Putting config in its own file allows to have a simpler Gruntfile that can
// only focus on the tasks
var getConfig = function(grunt) {

	// Getting some info from package.json
  var pkg = grunt.file.readJSON("package.json");
  var config = {};

  // META INFO ---------------------------------------------------------------
  config.banner = '/**\n' +
  ' * ' + pkg.name + ' - v' + pkg.version + ' - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
  ' * By ' + pkg.author + '\n' +
  ' */\n';


  // BUILD INFO --------------------------------------------------------------

  //Directories
  config.buildDirectory = 'build/';
  config.releaseDirectory = 'release/';
  config.miscDirectory = 'misc/';
  config.assetsDirectory = 'src/assets/';

  // Output paths
  config.convertedTemplatesPath = config.buildDirectory + 'templates.js';
  config.releaseLibsMinPath = config.releaseDirectory + 'scripts/libs.js';
  config.releaseAppMinPath = config.releaseDirectory + 'scripts/app.js';
  config.releaseCssPath = config.releaseDirectory + 'style/app.css';

  // Compass setup
  config.sassDirectory = 'src/style';
  config.cssDirectory = config.buildDirectory + 'style';
  config.compassConfigFile = config.miscDirectory + 'compass.rb';

  // File filters
  config.sourceFileFilter = ['src/**/*.coffee', '!src/**/*.tests.coffee'];
  config.testFileFilter = ['src/**/*.tests.coffee'];
  config.templateFileFilter = ['src/templates/**/*.html', 'src/common/**/*.html'];
  config.sassFileFilter = [config.sassDirectory + '/**/*.scss'];
  config.indexFileFilter = ['src/index.html'];
  config.ownJsToMinifyFilter = [
    config.buildDirectory + 'src/**/*.js',
    config.convertedTemplatesPath
  ];
  config.assetsFilter = ['src/assets/**'];
  config.cssFilter = [config.cssDirectory + '/**'];

  // Path to 3rd party js (both normal and minified)/css (installed via bower)
  config.libs = {
    js: [
      'libs/angular/angular.js',
      'libs/angular-ui-router/release/angular-ui-router.js',
    ],
    jsMin: [
      'libs/angular/angular.min.js',
      'libs/angular-ui-router/release/angular-ui-router.min.js',
    ],
    css: []
  };

  // Index paths (path from which the index task will insert html/js)
  config.indexTask = {};

  // ORDER MATTERS : libs need to be first, then your app
  config.indexTask.dev = [
    config.libs.js,
    config.libs.css,
    config.convertedTemplatesPath,
    config.buildDirectory + 'src/**/*.js',
    config.cssDirectory + '/*.css'
  ];

  config.indexTask.release = [
    config.releaseLibsMinPath,
    config.releaseAppMinPath,
    config.releaseCssPath
  ];

  // KARMA --------------------------------------------------------------------

  // Files to be loaded by karma
  config.karmaFiles = config.libs.js;

  // Can't use array in karma files so we need to get by index
  config.karmaFiles = config.karmaFiles.concat([
    config.convertedTemplatesPath,
    'libs/chai/chai.js',
    config.miscDirectory + 'chai-asserts.js',
    'libs/sinonjs/sinon.js',
    'libs/angular-mocks/angular-mocks.js',
    config.sourceFileFilter[0],
    config.testFileFilter[0]
  ]);

  return config;
};

module.exports = getConfig;
