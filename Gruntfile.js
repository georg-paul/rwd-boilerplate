module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({

		//Read the package.json (optional)
		pkg: grunt.file.readJSON('package.json'),

		// Metadata.
		meta: {
			srcPath: 'src/development/',
			deployPath: 'src/'
		},

		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> ',

		// Task configuration.
		uglify: {
			options: {
				report: 'gzip'
			},
			files: {
				src: '<%= meta.deployPath %>rwd-boilerplate.concat.js',  // source files mask
				dest: '<%= meta.deployPath %>',    // destination folder
				expand: true,    // allow dynamic building
				flatten: true,   // remove all unnecessary nesting
				ext: '.min.js'   // replace .js to .min.js
			}
		},

		connect: {
			server: {
				options: {
					base: '',
					port: 9999
				}
			}
		},

		watch: {
			css: {
				files: ['**/*.scss'],
				tasks: ['sass']
			},
			js:  {
				files: ['<%= meta.srcPath %>**/*.js', 'element-queries/element-queries.js', 'tests/qunit/tests.js'],
				tasks: ['jshint', 'concat', 'uglify', 'qunit']
			}
		},

		concat: {
			options: {
				stripBanners: true
			},
			dist: {
				src: [
					'<%= meta.srcPath %>utilities.js',
					'element-queries/minimal-classList-shim.js',
					'element-queries/element-queries.js',
					'<%= meta.srcPath %>rwd-objects/halign.js',
					'<%= meta.srcPath %>rwd-objects/media.js',
					'<%= meta.srcPath %>rwd-objects/hnav.js',
					'<%= meta.srcPath %>rwd-objects/vnav.js',
					'<%= meta.srcPath %>rwd-objects/columns.js',
					'<%= meta.srcPath %>rwd-objects/slider.js',
					'<%= meta.srcPath %>rwd-objects/_init.js',
					'<%= meta.srcPath %>rwd-objects/_resize.js',
					'<%= meta.srcPath %>hide-loading.js'
				],
				dest: '<%= meta.deployPath %>rwd-boilerplate.concat.js'
			}
		},

		sass: {
			dist: {
				options: {
					style: 'compressed'
				},
				files: {
					'demo/demo.css': 'demo/demo.scss'
				}
			}
		},

		jshint: {
			options: {
				browser: true,
				globals: {
					jQuery: true,
					$: true
				}
			},
			all: ['src/development/**/*.js']
		},

		qunit: {
			all: [
				'tests/qunit/**/*.html',
				'element-queries/Tests/Unit/QUnit/**/*.html'
			]
		},

		'saucelabs-qunit': {
			all: {
				options: {
					//username: '',
					//key: '',
					urls: ['http://localhost:9999/tests/qunit/tests-with-jquery.html', 'http://localhost:9999/tests/qunit/tests-with-zepto.html'],
					build: '0.1.0',
					tunnelTimeout: 5,
					testname: 'QUnit Tests',
					browsers: [
						{
							"browserName": "googlechrome",
							"platform": "OS X 10.9",
							"version": "31"
						},
						{
							"browserName": "iphone",
							"platform": "OS X 10.9",
							"version": "7"
						},
						{
							"browserName": "firefox",
							"platform": "Windows 7",
							"version": "26"
						},
						{
							"browserName": "internet explorer",
							"platform": "Windows 7",
							"version": "10"
						}
					]
				}
			}
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-saucelabs');

	// Default task
	grunt.registerTask('default', ['sass', 'jshint', 'concat', 'uglify', 'qunit', 'watch']);
	grunt.registerTask('test', ['connect', 'saucelabs-qunit']);
};