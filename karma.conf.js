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
            'vendor/ui-router/release/angular-ui-router.js',
            'vendor/angular-mocks/angular-mocks.js',
            'build/src/templates.js',
            'src/app/**/module.ts',
            'src/app/**/!(module).ts',
            'src/tests/unit/**/*.js'
        ],
        exclude: ['src/tests/integration/**/*.js'],
        preprocessors: {
            '**/*.ts': ['typescript']
        }
    });

};
