/*jslint browser: true, nomen: false, devel: true*/
/*global $ */

function waitForImagesToLoad($element, callback) {
	"use strict";
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

function getScrollBarWidth() {
	"use strict";
	var width = 0;

	if (document.body.clientHeight > $('html').height()) {
		document.body.style.overflow = 'hidden';
		width = document.body.clientWidth;
		document.body.style.overflow = 'scroll';
		width -= document.body.clientWidth;
		if (!width) {
			width = document.body.offsetWidth - document.body.clientWidth;
		}
		document.body.style.overflow = '';
	}
	return width;
}