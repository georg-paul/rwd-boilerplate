module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({

		//Read the package.json (optional)
		pkg: grunt.file.readJSON('package.json'),

		// Metadata.
		meta: {
			srcPath: 'src/development/',
			srcPathElementQueries: 'element-queries/element-queries.js',
			deployPath: 'src/'
		},

		banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
			'<%= grunt.template.today("yyyy-mm-dd") %>\n' +
			'* Copyright (c) <%= grunt.template.today("yyyy") %> ',

		// Task configuration.
		uglify: {
			files: {
				src: '<%= meta.deployPath %>rwd-boilerplate.concat.js',  // source files mask
				dest: '<%= meta.deployPath %>',    // destination folder
				expand: true,    // allow dynamic building
				flatten: true,   // remove all unnecessary nesting
				ext: '.min.js'   // replace .js to .min.js
			}
		},

		watch: {
			css: {
				files: ['styles/config/project.scss', 'styles/rwd-boilerplate.scss'],
				tasks: ['sass']
			},
			js:  {
				files: ['<%= meta.srcPath %>*.js', '<%= meta.srcPathElementQueries %>'],
				tasks: ['jshint', 'concat', 'uglify']
			}
		},

		concat: {
			options: {
				stripBanners: true
			},
			dist: {
				src: [
					'<%= meta.srcPath %>utilities.js',
					'<%= meta.srcPathElementQueries %>',
					'<%= meta.srcPath %>rwd-objects.js',
					'<%= meta.srcPath %>rwd-object-slider.js',
					'<%= meta.srcPath %>resize-orientationchange.js',
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
					'styles/rwd-boilerplate.css': 'styles/rwd-boilerplate.scss'
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
			all: ['src/development/*.js']
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Default task
	grunt.registerTask('default', ['sass', 'jshint', 'concat', 'uglify', 'watch']);

};