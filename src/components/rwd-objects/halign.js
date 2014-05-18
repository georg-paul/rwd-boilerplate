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

	this.init = function ($rwdObj) {
		var element = {};
		element.$element = $rwdObj;
		element.availableWidth = $rwdObj.width();
		element.totalChildrenWidth = self.getTotalChildrenWidth($rwdObj);
		element.$container = $('[data-halign-container-id="' + parseInt($rwdObj.attr('data-halign-id'), 10) + '"]');

		self.calculateDimensionsAndConditionallyAddProperClasses(element);
	};

	this.calculateDimensionsAndConditionallyAddProperClasses = function (element) {
		if (element.totalChildrenWidth >= element.availableWidth) {
			self.addClasses(element, 'no-side-by-side');
		} else if (element.totalChildrenWidth + 50 > element.availableWidth) {
			self.addClasses(element, 'nearly-no-side-by-side');
			self.addClasses(element, 'side-by-side');
		} else {
			self.addClasses(element, 'side-by-side');
		}
	};

	this.addClasses = function (element, mode) {
		element.$element.addClass(mode);
		if (element.$container.length) {
			element.$container.addClass('children-' + mode);
		}
	};

	this.getTotalChildrenWidth = function ($rwdObj) {
		var totalChildrenWidth = 0;

		$rwdObj.children().each(function () {
			totalChildrenWidth += $(this).outerWidth(true);
		});

		return totalChildrenWidth;
	};
}