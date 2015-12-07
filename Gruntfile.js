module.exports = function (grunt) {
    var gulp = require('gulp');
    var useref = require('gulp-useref');
    var gulpif = require('gulp-if');
    var uglify = require('gulp-uglify');
    var minifyCss = require('gulp-minify-css');
    var outputPath = grunt.option('bundle_output_path') || 'build/webapp/';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
        'modules-graph': {
            options: {
                externalDependenciesColor:'red'
            },
            debug: {
                files: {
                    'angular-dependency-graph.dot': ['src/main/webapp/resources/**/*.js']
                }
            }
        },
        graphviz: {
            dependencies: {
                files: {
                    'angular-dependency-graph.png': 'angular-dependency-graph.dot'
                }
            }
        },
        gulp: {
            'bundle': function () {
                var assets = useref.assets();
                return gulp.src('src/main/webapp/index.html')
                    .pipe(assets)
                    .pipe(gulpif('*.js', uglify()))
                    .pipe(gulpif('*.css', minifyCss()))
                    .pipe(assets.restore())
                    .pipe(useref())
                    .pipe(gulp.dest(outputPath));
            },
            'bundle-embedded': function () {
                var assets = useref.assets();
                return gulp.src('src/main/webapp/embedded.html')
                    .pipe(assets)
                    .pipe(gulpif('*.js', uglify()))
                    .pipe(gulpif('*.css', minifyCss()))
                    .pipe(assets.restore())
                    .pipe(useref())
                    .pipe(gulp.dest(outputPath));
            },
            'copy-webshims': function () {
                var assets = useref.assets();
                return gulp.src('src/main/webapp/bower_components/webshim/js-webshim/minified/**/*')
                    .pipe(gulp.dest(outputPath + 'lib/js/'));
            },
            'copy-openlayers-theme': function () {
                var assets = useref.assets();
                return gulp.src('src/main/webapp/bower_components/OpenLayers-2.13.1/theme/**/*')
                    .pipe(gulp.dest(outputPath + 'lib/js/theme'));
            },
            'copy-openlayers-img': function () {
                var assets = useref.assets();
                return gulp.src('src/main/webapp/bower_components/OpenLayers-2.13.1/img/**/*')
                    .pipe(gulp.dest(outputPath + 'lib/js/img'));
            },
            'copy-bootstrap-fonts': function () {
                var assets = useref.assets();
                return gulp.src('src/main/webapp/bower_components/bootstrap/dist/fonts/**/*')
                    .pipe(gulp.dest(outputPath + 'lib/fonts'));
            }
        }
	});

    grunt.loadNpmTasks('grunt-graphviz');
    grunt.loadNpmTasks('grunt-angular-modules-graph');
	grunt.loadNpmTasks('grunt-ngdocs');
    grunt.loadNpmTasks('grunt-gulp');
    grunt.registerTask('prepare-war', ['gulp:bundle', 'gulp:bundle-embedded', 'gulp:copy-webshims', 'gulp:copy-openlayers-theme', 'gulp:copy-openlayers-img', 'gulp:copy-bootstrap-fonts']);
	grunt.registerTask('default',[]);
    //Required graphviz installed and dot.exe on the PATH -> http://www.graphviz.org/
    grunt.registerTask('depgraph', ['modules-graph','graphviz']);
};