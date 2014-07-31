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
            'vendor/angular.js',
            'vendor/ui-router.js',
            'vendor/angular-mocks.js',
            'vendor/lodash.js',
            'vendor/restangular.js',
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