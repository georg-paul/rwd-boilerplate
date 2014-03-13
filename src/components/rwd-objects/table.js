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


function RwdObjectTable() {
	'use strict';

	var self = this;

	this.init = function () {
		$('.rwd-object-table').each(function () {
			var $rwdObj = $(this);

			if ($rwdObj.width() > $rwdObj.parent().width()) {
				$rwdObj.addClass('oversize');
				self.equalCellHeightPerRow($rwdObj);
			}
		});
	};

	this.equalCellHeightPerRow = function ($rwdObj) {
		$rwdObj.find('th, td').each(function () {
			$(this).css('min-height', self.getArrayOfMaxHeightValues($rwdObj)[$(this).index()]);
		});
	};

	this.getArrayOfMaxHeightValues = function ($rwdObj) {
		var maxCellHeights = [],
			columnCount = $rwdObj.find('tr').first().children().length;

		for (var i = 1; i <= columnCount; i++) {
			maxCellHeights.push(self.getMaxHeightPerRow($rwdObj, i));
		}
		return maxCellHeights;
	};

	this.getMaxHeightPerRow = function ($rwdObj, iterator) {
		var tdHeight,
			maxHeight = 0;

		$rwdObj.find('tr > :nth-child(' + iterator + ')').each(function () {
			tdHeight = $(this).height();
			maxHeight = (tdHeight > maxHeight) ? tdHeight : maxHeight;
		});
		return maxHeight;
	};
}