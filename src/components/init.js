/*jslint browser: true */
/*global $, ElementQueries, initCallbackRwdObjects, waitForImagesToLoad, rwdBoilerplateSetFixedPageWidth,
rwdBoilerplateRemoveAppliedElementQueries, rwdBoilerplateHideLoading, rwdBoilerplateDone */

$(document).ready(function () {
	'use strict';

	// calls the global function 'initCallbackRwdObjects()' if you want to
	// inject custom code to the DOM before the rwd-objects are initialized
	if (typeof initCallbackRwdObjects === 'function') {
		initCallbackRwdObjects();
	}

	// sets fixed page width to body tag to prevent visual bugs after resize or orientationchange
	rwdBoilerplateSetFixedPageWidth();

	// iterates over all rwd-objects and run code after all images
	// within rwd-object-halign and rwd-object-slider have been loaded
	waitForImagesToLoad($('.rwd-object-halign, .rwd-object-slider'), function () {
		$('[class*="rwd-object-"]').each(function () {
			var $rwdObj = $(this),
				classNames = $rwdObj.attr('class').split(/\s+/),
				objType = '',
				i = 0;

			for (i = 0; i < classNames.length; i += 1) {
				objType = classNames[i].split('rwd-object-')[1];
				if (objType !== undefined) {
					if (objType === 'halign') {
						new RwdObjectHalign().init($rwdObj);
					} else if (objType === 'media') {
						new RwdObjectMedia().init($rwdObj);
					} else if (objType === 'hnav') {
						new RwdObjectHnav().init($rwdObj);
					} else if (objType === 'vnav') {
						new RwdObjectVnav().init($rwdObj);
					} else if (objType.indexOf('columns-') !== -1) {
						new RwdObjectColumns().init($rwdObj);
					} else if (objType.indexOf('table') !== -1) {
						new RwdObjectTable().init($rwdObj);
					} else if (objType.indexOf('slider') !== -1) {
						new RwdObjectSlider().init($rwdObj);
					} else if (objType.indexOf('flyout') !== -1) {
						new RwdObjectFlyout().init($rwdObj);
					}
				}
			}
		});

		// after all changes to the DOM caused by the rwd-objects are complete
		// parse the stylesheets, search for flyout patterns and move nodes to flyouts
		new TraverseFlyoutComponents().init();

		// removes applied element queries and reruns element queries
		// due to DOM traversing caused by the rwd-objects code
		rwdBoilerplateRemoveAppliedElementQueries($('html'));
		new ElementQueries().init();

		// hides the loading animtion
		// --> Probably hide animation earlier, not in the callback of waitForImagesToLoad
		// --> FOUC might be better than showing the loading animation for too long
		rwdBoilerplateHideLoading();

		// you can run your code safely after rwd-boilerplate stuff is done
		// use the following callback function
		if (typeof rwdBoilerplateDone === 'function') {
			rwdBoilerplateDone();
		}
	});
});