/*jslint browser: true */
/*global $ */

(function () {
	'use strict';

	var resizeTimeout,
		wd = window,
		winWidth = $(wd).width(),
		winHeight = $(wd).height();

	$(wd).bind('resize orientationchange', function () {
		var refreshPage = function () {
			wd.location.assign(wd.location.href); // go to the URL
			wd.location.replace(wd.location.href); // go to the URL and replace previous page in history
			wd.location.reload(); // reload page from cache
		};

		// New height and width
		var winNewWidth = $(wd).width(),
			winNewHeight = $(wd).height();

		// Compare the new height and width with old one
		if (winWidth !== winNewWidth || winHeight !== winNewHeight) {
			window.clearTimeout(resizeTimeout);
			resizeTimeout = wd.setTimeout(refreshPage, 10);
		}
		// Update the width and height
		winWidth = winNewWidth;
		winHeight = winNewHeight;
	});
}());