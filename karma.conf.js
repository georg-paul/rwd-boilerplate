module.exports = function (config) {
	config.set({

		frameworks: ['qunit'],

		basePath: '',

		files: [
			'src/contributed/jQuery/jquery-2.0.0.min.js',
			'src/contributed/Zepto/zepto.min.js',
			'src/development/**/*.js',
			'element-queries/*.js',
			'tests/qunit/tests.js',
			'element-queries/Tests/Unit/QUnit/element-queriesTest.js'
		],

		exclude: [
		],

		reporters: ['progress'],

		port: 9876,

		runnerPort: 9100,

		colors: true,

		logLevel: config.LOG_INFO,

		autoWatch: true,

		browsers: ['Firefox', 'Chrome'],

		captureTimeout: 5000,

		singleRun: false,

		reportSlowerThan: 500
	});
};
