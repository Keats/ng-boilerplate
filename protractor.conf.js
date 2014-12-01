exports.config = {
    chromeOnly: false,
    capabilities: {
        browserName: 'firefox'
    },
    specs: ['src/tests/integration/**/*.js'],
    baseUrl: 'http://localhost:8001',
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        reporter: 'list',
        enableTimeouts: false
    }
};
