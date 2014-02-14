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


function RwdObjectHalign() {
	'use strict';

	var self = this;

	this.init = function () {
		$('.rwd-object-halign, .rwd-object-valign-middle').each(function () {
			var $rwdObj = $(this);
			if (!$rwdObj.hasClass('full-width')) {
				self.halign($rwdObj);
			}
		});
	};

	this.halign = function ($rwdObj) {
		var availableWidth = $rwdObj.width(),
			totalChildrenWidth = self.getTotalChildrenWidth($rwdObj),
			containerId = parseInt($rwdObj.attr('data-halign-id'), 10),
			$container = $('[data-halign-container-id="' + containerId + '"]');

		if (totalChildrenWidth > availableWidth) {
			$rwdObj.addClass('no-side-by-side');
			if ($container.length) {
				$container.addClass('children-no-side-by-side');
			}
		} else if ((totalChildrenWidth <= availableWidth) && totalChildrenWidth + 50 > availableWidth) {
			$rwdObj.addClass('nearly-no-side-by-side side-by-side');
			if ($container.length) {
				$container.addClass('children-nearly-no-side-by-side');
			}
		} else {
			$rwdObj.addClass('side-by-side');
		}
	};

	this.getTotalChildrenWidth = function ($rwdObj) {
		var totalChildrenWidth = 0,
			halignChild;

		$rwdObj.children().each(function () {
			halignChild = $(this);
			totalChildrenWidth += halignChild.width();
			totalChildrenWidth += parseInt(halignChild.css('margin-left'), 10);
			totalChildrenWidth += parseInt(halignChild.css('margin-right'), 10);
		});

		return totalChildrenWidth;
	};
}