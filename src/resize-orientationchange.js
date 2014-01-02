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

			RwdObjectsInstance.init(true);
			RwdObjectsInstance = null;

			//RwdObjectSliderInstance.init(true);
			//RwdObjectSliderInstance = null;

			// Re-run Element Queries
			ElementQueriesInstance = new ElementQueries();
			ElementQueriesInstance.init();

			// Re-run Rwd Objects
			RwdObjectsInstance = new RwdObjects();
			RwdObjectsInstance.init();

			// Re-run Rwd Objects
			RwdObjectSliderInstance = new RwdObjectSlider();
			RwdObjectSliderInstance.init();

		}, 100);
	});
}());