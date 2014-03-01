/*jslint browser: true */
/*global $ */

(function () {
	'use strict';

	var resizeTimeout,
		wd = window,
		winWidth = window.innerWidth,
		winHeight = window.innerHeight;

	$(wd).bind('resize orientationchange', function () {
		var refreshPage = function () {
			$('html').addClass('rwd-boilerplate-loading'); // show loading animation
			wd.location.assign(wd.location.href); // go to the URL
			wd.location.replace(wd.location.href); // go to the URL and replace previous page in history
			wd.location.reload(); // reload page from cache
		};

		// New height and width
		var winNewWidth = window.innerWidth,
			winNewHeight = window.innerHeight;

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