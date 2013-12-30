/*jslint browser: true, nomen: false, devel: true*/
/*global $ */

(function () {
	"use strict";
	var resizeTimeout;
	$(window).bind('resize orientationchange', function () {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function () {

			// Clear object instances first
			ElementQueriesInstance = null;
			RwdObjectsInstance = null;

			// Restore the inital state of the body element
			$('body').html($bodySnaphot.html());

			// Re-run Element Queries
			ElementQueriesInstance = new ElementQueries();
			ElementQueriesInstance.init();

			// Re-run Rwd Objects
			RwdObjectsInstance = new RwdObjects();
			RwdObjectsInstance.init();
		}, 100);
	});
}());