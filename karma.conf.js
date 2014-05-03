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
        'libs/angular/angular.js',
        'libs/angular-ui-router/release/angular-ui-router.js',
        'libs/angular-mocks/angular-mocks.js',
        'libs/lodash/dist/lodash.js',
        'libs/restangular/dist/restangular.js',
        'build/src/templates.js',
        'src/**/*.js'
    ],
    exclude: ['src/tests/integration/**/*.js'],
    preprocessors: {
      '**/*.ts': ['typescript']
    }
  });

};