/*jslint browser: true */
/*global $ */

(function () {
	'use strict';

	var revertElementQueries = function () {
		ElementQueriesInstance.revertApplication();
		ElementQueriesInstance = null;
	},

		applyElementQueriesAgain = function () {
			ElementQueriesInstance = new ElementQueries();
			ElementQueriesInstance.init(true);
		},

		runRwdObjectsAgain = function () {
			RwdObjectsInstance = new InitRwdObjects();
		},

		runRwdSliderAgain = function () {
			RwdObjectSliderInstance = null; // Clear slider instance first

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
		},

		resizeTimeout;

	$(window).bind('resize orientationchange', function () {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function () {
			revertElementQueries();
			applyElementQueriesAgain();
			runRwdObjectsAgain();
			runRwdSliderAgain();
		}, 100);
	});
}());