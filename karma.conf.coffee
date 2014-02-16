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
