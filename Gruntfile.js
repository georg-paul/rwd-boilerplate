module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({

		//Read the package.json (optional)
		pkg: grunt.file.readJSON('package.json'),

		// Metadata.
		meta: {
			srcPath: 'src/components/',
			deployPath: 'dist/'
		},

		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> ',

		// Task configuration.
		uglify: {
			options: {
				//report: 'gzip'
			},
			rwdBoilerplateStandalone: {
				src: '<%= meta.deployPath %>rwd-boilerplate.concat.js',
				dest: '<%= meta.deployPath %>',    // destination folder
				expand: true,    // allow dynamic building
				flatten: true,   // remove all unnecessary nesting
				ext: '.min.js'   // replace .js to .min.js
			},
			rwdBoilerplateJquery: {
				src: '<%= meta.deployPath %>jquery/edge/rwd-boilerplate.jquery.concat.js',
				dest: '<%= meta.deployPath %>jquery/edge/',    // destination folder
				expand: true,    // allow dynamic building
				flatten: true,   // remove all unnecessary nesting
				ext: '.jquery.min.js'   // replace .js to .min.js
			},
			rwdBoilerplateJqueryLegacy: {
				src: '<%= meta.deployPath %>jquery/legacy/rwd-boilerplate.jquery-1.11.1.concat.js',
				dest: '<%= meta.deployPath %>jquery/legacy/',    // destination folder
				expand: true,    // allow dynamic building
				flatten: true,   // remove all unnecessary nesting
				ext: '.jquery-1.11.1.min.js'   // replace .js to .min.js
			},
			rwdBoilerplateZepto: {
				src: '<%= meta.deployPath %>zepto/rwd-boilerplate.zepto.concat.js',
				dest: '<%= meta.deployPath %>zepto/',
				expand: true,
				flatten: true,
				ext: '.zepto.min.js'
			}
		},

		connect: {
			dev: {
				options: {
					hostname: '',
					base: '',
					port: 9999,
					keepalive: true
				}
			}
		},

		watch: {
			css: {
				files: ['**/*.scss'],
				tasks: ['sass']
			},
			js:  {
				files: ['<%= meta.srcPath %>**/*.js', 'tests/qunit/tests.js'],
				tasks: ['jshint', 'concat', 'copy', 'uglify', 'qunit']
			},
			html: {
				files: ['tests/qunit/**/*.html'],
				tasks: ['qunit']
			}
		},

		concat: {
			options: {
				stripBanners: true
			},
			rwdBoilerplate: {
				src: [
					'bower_components/element-queries/minimal-classList-shim.js',
					'bower_components/element-queries/element-queries.js',
					'<%= meta.srcPath %>utilities/utilities.js',
					'<%= meta.srcPath %>rwd-objects/halign.js',
					'<%= meta.srcPath %>rwd-objects/media.js',
					'<%= meta.srcPath %>rwd-objects/hnav.js',
					'<%= meta.srcPath %>rwd-objects/vnav.js',
					'<%= meta.srcPath %>rwd-objects/columns.js',
					'<%= meta.srcPath %>rwd-objects/table.js',
					'<%= meta.srcPath %>rwd-objects/slider.js',
					'<%= meta.srcPath %>rwd-objects/flyout.js',
					'<%= meta.srcPath %>init.js'
				],
				dest: '<%= meta.deployPath %>rwd-boilerplate.concat.js'
			},
			distJquery: {
				src: [
					'bower_components/jquery/dist/jquery.min.js',
					'<%= meta.deployPath %>rwd-boilerplate.concat.js'
				],
				dest: '<%= meta.deployPath %>jquery/edge/rwd-boilerplate.jquery.concat.js'
			},
			distJqueryLegacy: {
				src: [
					'bower_components/jquery-legacy/dist/jquery.min.js',
					'<%= meta.deployPath %>rwd-boilerplate.concat.js'
				],
				dest: '<%= meta.deployPath %>jquery/legacy/rwd-boilerplate.jquery-1.11.1.concat.js'
			},
			zeptoCustomBuild: {
				src: [
					'bower_components/zepto/zepto.min.js',
					'<%= meta.srcPath %>zepto/modules/selector.js',
					'<%= meta.srcPath %>zepto/modifications.js'
				],
				dest: '<%= meta.deployPath %>zepto/zepto.customized.js'
			},
			distZepto: {
				src: [
					'<%= meta.deployPath %>zepto/zepto.customized.js',
					'<%= meta.deployPath %>rwd-boilerplate.concat.js'
				],
				dest: '<%= meta.deployPath %>zepto/rwd-boilerplate.zepto.concat.js'
			}
		},

		copy: {
			jQuery: {
				src: 'bower_components/jquery/dist/jquery.min.js',
				dest: '<%= meta.deployPath %>jquery/edge/jquery.min.js'
			},
			jQueryLegacy: {
				src: 'bower_components/jquery-legacy/dist/jquery.min.js',
				dest: '<%= meta.deployPath %>jquery/legacy/jquery-1.11.1.min.js'
			},
			html5shiv: {
				src: 'bower_components/html5shiv/dist/html5shiv.min.js',
				dest: '<%= meta.deployPath %>jquery/legacy/html5shiv.min.js'
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
			all: ['<%= meta.srcPath %>rwd-objects/*.js', '<%= meta.srcPath %>utilities/*.js']
		},

		qunit: {
			all: [
				'tests/qunit/**/*.html'
			]
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
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default task
	grunt.registerTask('default', ['sass', 'jshint', 'concat', 'copy', 'uglify', 'qunit', 'watch']);
	grunt.registerTask('connect-keep-alive', ['connect:dev']);
};