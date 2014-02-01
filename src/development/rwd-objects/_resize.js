/*jslint browser: true */
/*global $ */

(function () {
	'use strict';

	var resizeTimeout,
		wd = window;

	$(window).bind('resize orientationchange', function () {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function () {
			$('html').addClass('rwd-boilerplate-loading'); // show loading animation
			wd.location.assign(wd.location.href); // go to the URL
			wd.location.replace(wd.location.href); // go to the URL and replace previous page in history
			wd.location.reload(false); // reload page from cache
		}, 100);
	});
}());