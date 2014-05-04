module.exports = function (config) {

    config.set({
        frameworks: ['mocha', 'chai-sinon'],
        browsers: ['PhantomJS'],
        plugins: [
            'karma-mocha',
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
            'src/app/**/*.ts',
            'src/tests/unit/**/*.js',
        ],
        exclude: ['src/tests/integration/**/*.js'],
        preprocessors: {
            '**/*.ts': ['typescript']
        }
    });

};