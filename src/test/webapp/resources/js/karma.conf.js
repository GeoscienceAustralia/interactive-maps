// Karma configuration
// Generated on Wed Mar 19 2014 12:48:17 GMT+1100 (AUS Eastern Daylight Time)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../../../../../',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [ 'jasmine' ],

        // list of files / patterns to load in the browser
        files: [
            'src/main/webapp/bower_components/OpenLayers-2.13.1/OpenLayers.js',
            'src/main/webapp/bower_components/jquery/dist/jquery.js',
            'src/main/webapp/bower_components/angular/angular.js',
            'src/main/webapp/bower_components/angular-route/angular-route.js',
            'src/main/webapp/bower_components/angular-mocks/angular-mocks.js',
            'src/main/webapp/bower_components/modernizr/modernizr.js',
            'src/main/webapp/bower_components/webshim/js-webshim/minified/polyfiller.js',
            'src/main/webapp/bower_components/webshim/js-webshim/minified/shims/range-ui.js',
            'src/main/webapp/bower_components/bootstrap/dist/js/bootstrap.min.js',
            'src/main/webapp/bower_components/jquery-ui/jquery-ui.js',
            'src/main/webapp/bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
            'src/main/webapp/bower_components/angular-ui-utils/ui-utils.js',
            'src/main/webapp/bower_components/geo-web-toolkit/dist/geo-web-toolkit-min.js',
            'http://maps.google.com/maps/api/js?.js',
            'src/main/webapp/resources/jsnomin/ol.js',
            'src/main/webapp/resources/jsnomin/Cesium/Cesium.js',
            'src/main/webapp/resources/jsnomin/ol3cesium.js',
            'src/main/webapp/resources/**/*.js',
            'src/test/webapp/resources/js/**/*.js'],

        // list of files to exclude
        exclude: [
            'src/test/**/karma*.js'
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/main/webapp/resources/js/**/*.js': [ 'coverage' ]
        },
        coverageReporter: {
            type: 'lcov',
            dir: 'coverage/'
        },

        reporters: [ 'progress', 'coverage' ],

        htmlReporter: {
            outputDir: 'target/karma-reports'
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG || config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [ 'PhantomJS' ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        plugins: [ 'karma-jasmine',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-ie-launcher',
            'karma-html-reporter',
            'karma-coverage' ]
    });
};
