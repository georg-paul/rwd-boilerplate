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
			RwdObjectSliderInstance = null;

			// Re-run Element Queries
			ElementQueriesInstance = new ElementQueries();
			ElementQueriesInstance.init();

			// Re-run Rwd Objects
			RwdObjectsInstance = new RwdObjects();
			RwdObjectsInstance.init();

			// Re-run Rwd Object Slider
			var $slider;
			$('.rwd-object-slider').each(function (i) {
				$slider = $(this);
				$slider.find('> .slider-nav .progress').unbind();
				$slider.find('> .slider-nav .next-button').unbind();
				$slider.find('> .slider-nav .prev-button').unbind();
				var RwdObjectSliderInstance = new RwdObjectSlider($slider);
				RwdObjectSliderInstance.init($slider.find('> .container').find('> .active').index(), true);
				if ($slider.hasClass('autoplay')) {
					RwdObjectSliderInstance.clearAutoPlayInterval();
				}
			});

		}, 100);
	});
}());