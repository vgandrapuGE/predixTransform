// An example configuration file.
exports.config = {
  directConnect: false,

  chromeOnly: false,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'phantomjs'
  },

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine',

  // Spec patterns are relative to the current working directory when
  // protractor is called.
  specs: ['test/e2e/**/*.js'],

  seleniumServerJar: './node_modules/selenium-standalone-jar/bin/selenium-server-standalone-2.48.2.jar',

  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    defaultTimeoutInterval: 50000
  }
};
