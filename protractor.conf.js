require('coffee-script').register();

exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  chromeOnly: false,
  capabilities: {
    browserName: 'firefox'
  },
  specs: ['src/tests/integration/**/*.coffee'],
  baseUrl: 'http://localhost:8001',
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    reporter: 'list'
  }
};
