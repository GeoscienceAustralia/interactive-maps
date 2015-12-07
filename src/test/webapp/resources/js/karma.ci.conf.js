var baseConfig = require('./karma.conf.js');

module.exports = function (config) {
    // Load base config
    baseConfig(config);

    // Override base config
    config.set({
        singleRun: true,
        autoWatch: false,
        reporters: [ 'progress', 'junit' ],
        browsers: [ 'PhantomJS' ],
        plugins: [ 'karma-jasmine', 'karma-phantomjs-launcher', 'karma-junit-reporter' ],
        junitReporter: {
            outputFile: "target/surefire-reports/js-test-results.xml",
            suite: "jasmine-tests"
        }
    });
};