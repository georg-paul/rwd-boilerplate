/*jslint browser: true, nomen: false, devel: true*/
/*global $ */

(function () {
	"use strict";
	var resizeTimeout;
	$(window).bind('resize orientationchange', function () {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function () {

			// Remove applied classes and clear object instances first
			ElementQueriesInstance.revertApplication();
			ElementQueriesInstance = null;
			//RwdObjectsInstance = null;

			// Re-run Element Queries
			ElementQueriesInstance = new ElementQueries();
			ElementQueriesInstance.init();

			// Re-run Rwd Objects
			//RwdObjectsInstance = new RwdObjects();
			//RwdObjectsInstance.init();

		}, 100);
	});
}());