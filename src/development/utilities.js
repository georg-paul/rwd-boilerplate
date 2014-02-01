/*jslint browser: true, nomen: false, devel: true*/
/*global $ */

function waitForImagesToLoad($element, callback) {
	'use strict';
	var images, loaded;

	// Find the images within $element it that aren't loaded yet
	images = $element.find('img').filter(function (index, img) {
		return !this.complete;
	});

	// Find any?
	if (images.length === 0) {
		callback();
	} else {
		loaded = 0;
		images.on('load', function () {
			// callback if the last image has been loaded?
			loaded += 1;
			if (loaded === images.length) {
				callback();
			}
		});
	}
}

var interval = {
	//to keep a reference to all the intervals
	intervals : {},

	//create another interval
	make : function (fun, delay) {
		//see explanation after the code
		var newInterval = setInterval.apply(
			window,
			[ fun, delay ].concat([].slice.call(arguments, 2))
		);

		this.intervals[newInterval] = true;

		return newInterval;
	},

	//clear a single interval
	clear : function (id) {
		return clearInterval(this.intervals[id]);
	},

	//clear all intervals
	clearAll : function () {
		var all = Object.keys(this.intervals), len = all.length;

		while (len --> 0) {
			clearInterval(all.shift());
		}
	}
};