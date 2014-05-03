module.exports = function(config) {

  config.set({
    frameworks: ['mocha', 'chai-sinon'],
    browsers: ['Firefox'],
    plugins: [
        'karma-mocha',
        'karma-firefox-launcher',
        'karma-typescript-preprocessor',
        'karma-phantomjs-launcher',
        'karma-chai-sinon'
    ],
    files: [
        'vendor/angular/angular.js',
        'vendor/angular-ui-router/release/angular-ui-router.js',
        'vendor/angular-mocks/angular-mocks.js',
        'vendor/lodash/dist/lodash.js',
        'vendor/restangular/dist/restangular.js',
        'build/src/templates.js',
        'src/**/*.js'
    ],
    exclude: ['src/tests/integration/**/*.js'],
    preprocessors: {
      '**/*.ts': ['typescript']
    }
  });

};