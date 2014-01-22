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


function RwdObjectColumns() {
	'use strict';

	var self = this;

	this.init = function () {
		$('[class*="rwd-object-columns-"]').each(function () {
			self.columns($(this));
		});
	};

	this.columns = function ($rwdObj) {
		self.revertDomChanges($rwdObj);

		var columnWidthFixed = $rwdObj.hasClass('fixed-width'),
			fluidWidthWhenFixedAndStacked = $rwdObj.hasClass('fluid-if-stacked'),
			$columnsParent = $rwdObj.parent(),
			availableWidth = $columnsParent.width(),
			breakpoint = 0,
			firstTopPosition = 0;

		// Column widths are fixed and should always stay fixed, do nothing
		if (columnWidthFixed && !fluidWidthWhenFixedAndStacked) {
			return;
		}
		// Columns widths are fixed and should be fluid
		// if the columns have not enough space side by side
		else if (columnWidthFixed && fluidWidthWhenFixedAndStacked) {
			firstTopPosition = $rwdObj.find('> .column').first().position().top;
			$rwdObj.find('> .column').each(function () {
				if ($(this).position().top > firstTopPosition) {
					breakpoint = availableWidth + 1;
				}
			});
		}
		// Column widths are relative and the data-breakpoint attribute contains the breakpoint
		else {
			breakpoint = $rwdObj.attr('data-breakpoint') || 0;
		}

		// If the breakpoint is reached and the columns are stacked
		if (breakpoint > availableWidth) {
			$rwdObj.addClass('stacked-columns');
			self.moveContentWithinColumns($rwdObj, false);
		}
	};

	this.moveContentWithinColumns = function ($rwdObj, revert) {
		$rwdObj.find('[data-move-down]').each(function () {
			var $elementToMove = $(this),
				columnIndex = $elementToMove.closest('.column').index() + 1,
				targetColumn = (revert) ? columnIndex - parseInt($elementToMove.attr('data-move-down'), 10) : columnIndex + parseInt($elementToMove.attr('data-move-down'), 10);

			$elementToMove.appendTo($rwdObj.children(':nth-child(' + targetColumn + ')'));
		});
		$rwdObj.find('[data-move-up]').each(function () {
			var $elementToMove = $(this),
				columnIndex = $elementToMove.closest('.column').index() + 1,
				targetColumn = (revert) ? columnIndex + parseInt($elementToMove.attr('data-move-up'), 10) : columnIndex - parseInt($elementToMove.attr('data-move-up'), 10);

			$elementToMove.appendTo($rwdObj.children(':nth-child(' + targetColumn + ')'));
		});
	};

	this.revertDomChanges = function ($rwdObj) {
		$rwdObj.removeClass('stacked-columns');
		self.moveContentWithinColumns($rwdObj, true);
	};
}