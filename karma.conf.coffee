module.exports = (config) ->
  config.set
    frameworks: ['mocha', 'chai-sinon']
    browsers: ['Firefox']
    plugins: [
      'karma-mocha',
      'karma-firefox-launcher',
      'karma-coffee-preprocessor',
      'karma-phantomjs-launcher',
      'karma-chai-sinon'
    ]
    files: [
      'libs/angular/angular.js',
      'libs/angular-ui-router/release/angular-ui-router.js',
      'libs/angular-mocks/angular-mocks.js',
      'build/src/templates.js',
      'src/**/*.coffee',
    ]
    exclude: [
      'src/tests/integration/**/*.coffee'
    ]
