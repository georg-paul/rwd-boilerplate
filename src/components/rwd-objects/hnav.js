/*jslint browser: true */
/*global $ */

/*
 The MIT License (MIT)

 Copyright (c) 2014 georg-paul

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */


function RwdObjectHnav() {
	'use strict';

	var self = this;

	this.init = function ($rwdObj) {
		if (!$rwdObj.hasClass('no-dropdown')) {
			var $rootUL = $rwdObj.find('> ul'),
				firstLevelItems = $rootUL.find('> li'),
				clickEventType = (document.ontouchstart !== null) ? 'click' : 'touchstart';

			firstLevelItems.each(function () {
				if ($(this).position().top > firstLevelItems.first().position().top) {
					$rwdObj.addClass('breakpoint-small');
					$rwdObj.closest('.rwd-object-hnav-container').addClass('hnav-breakpoint-small');
					return false;
				}
			});

			$rwdObj.find('.toggle').bind(clickEventType, function () {
				$rootUL.toggle();
				$(this).toggleClass('open');
			});
		}
	};
}