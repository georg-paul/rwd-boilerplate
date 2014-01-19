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
			js:  {
				files: ['<%= meta.srcPath %>*.js', '<%= meta.srcPathElementQueries %>'],
				tasks: ['concat', 'uglify']
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
		}
	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');

	// Default task
	grunt.registerTask('default', ['concat', 'uglify', 'watch']);

};