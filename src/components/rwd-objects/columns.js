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

	this.init = function ($rwdObj) {
		var availableWidth = $rwdObj.parent().width(),
			$columns = $rwdObj.find('> .column');

		if (self.getBreakpoint($rwdObj, availableWidth) > availableWidth) {
			self.stackColumnsAndTraverseMarkup($rwdObj);
		} else if (self.areStackedColumnsCausedByElementQueries($rwdObj) && !$rwdObj.hasClass('fixed-width')) {
			if (self.areColumnsNestedWithinOtherColumns($rwdObj)) {
				rwdBoilerplateRemoveAppliedElementQueries(self.getFirstParentColumnsOfNestedColumns($rwdObj));
				new ElementQueries().init();
				if (self.areStackedColumnsCausedByElementQueries($rwdObj)) {
					self.stackColumnsAndTraverseMarkup($rwdObj);
				}
				self.resetSliderHeight($rwdObj);
			} else {
				self.stackColumnsAndTraverseMarkup($rwdObj);
			}
		}
	};

	this.areColumnsNestedWithinOtherColumns = function ($rwdObj) {
		return (self.getFirstParentColumnsOfNestedColumns($rwdObj).length) ? true : false;
	};

	this.getFirstParentColumnsOfNestedColumns = function ($rwdObj) {
		return $rwdObj.parents('[class*="rwd-object-columns-"]').first();
	};

	this.stackColumnsAndTraverseMarkup = function ($rwdObj) {
		$rwdObj.addClass('stacked-columns');
		self.moveContentWithinColumns($rwdObj);
		self.convertToSliderItems($rwdObj);
	};

	this.areStackedColumnsCausedByElementQueries = function ($rwdObj) {
		return (parseInt($rwdObj.css('margin-left'), 10) === 0) ? true : false;
	};

	this.getBreakpoint = function ($rwdObj, availableWidth) {
		var columnWidthFixed = $rwdObj.hasClass('fixed-width'),
			fluidWidthWhenFixedAndStacked = $rwdObj.hasClass('fluid-if-stacked'),
			breakpoint = 0,
			firstTopPosition = 0;

		if (columnWidthFixed && !fluidWidthWhenFixedAndStacked) {
			// Column widths are fixed and should always stay fixed
			breakpoint = 0;
		} else if (columnWidthFixed && fluidWidthWhenFixedAndStacked) {
			// Columns widths are fixed and should be fluid if the columns have not enough space side by side
			firstTopPosition = $rwdObj.find('> .column').first().position().top;
			$rwdObj.find('> .column').each(function () {
				if ($(this).position().top > firstTopPosition) {
					breakpoint = availableWidth + 1;
				}
			});
		} else {
			// Column widths are percentage based and the data-breakpoint attribute contains the breakpoint
			breakpoint = $rwdObj.attr('data-breakpoint') || 0;
		}

		return breakpoint;
	};


	this.moveContentWithinColumns = function ($rwdObj) {
		var $elementsToMove = $rwdObj.find('[data-move-to]');

		if ($elementsToMove.length) {
			$elementsToMove.each(function () {
				var $this = $(this),
					$targetColumn = $rwdObj.children(':nth-child(' + parseInt($this.attr('data-move-to'), 10) + ')');

				if (self.shouldElementBeMovedToSpecificDomNode($this)) {
					self.moveContentToSpecificDomNode($this, $targetColumn);
				} else {
					$this.appendTo($targetColumn);
				}
			});
		}
	};

	this.convertToSliderItems = function ($rwdObj) {
		var $parentSlider = $rwdObj.closest('.rwd-object-slider');

		if ($rwdObj.hasClass('convert-columns-to-slider-items') && $parentSlider.length) {
			$rwdObj.find('> .column').each(function () {
				var $newSliderItem = $(this).children().wrapAll('<div class="item"></div>');
				$newSliderItem.parent().appendTo($(this).closest('.container'));
			});
			$rwdObj.closest('.item').remove();
			new RwdObjectSlider().init($parentSlider);
		}
	};

	this.resetSliderHeight = function ($rwdObj) {
		var $parentSlider = $rwdObj.closest('.rwd-object-slider');

		if ($parentSlider.length) {
			$parentSlider.css('height', $parentSlider.find('.item:nth-child(1)').outerHeight());
		}
	};

	this.shouldElementBeMovedToSpecificDomNode = function ($elementToMove) {
		return !!((!!$elementToMove.attr('data-insert-before') || $elementToMove.attr('data-insert-after')));
	};

	this.moveContentToSpecificDomNode = function ($elementToMove, $targetColumn) {
		var attributeInsertBefore = $elementToMove.attr('data-insert-before'),
			provisionalSelector = (!!attributeInsertBefore) ? attributeInsertBefore : $elementToMove.attr('data-insert-after'),
			$targetNode = $targetColumn.find(self.getValidSelector(provisionalSelector)).first();

		if ($targetNode) {
			if ($elementToMove.attr('data-insert-before')) {
				$elementToMove.insertBefore($targetNode);
			} else {
				$elementToMove.insertAfter($targetNode);
			}
		}
	};

	this.getValidSelector = function (dataAttributeValue) {
		var targetSelector = '';

		if (dataAttributeValue.indexOf('tag-') === 0) {
			targetSelector = dataAttributeValue.replace('tag-', '');
		} else if (dataAttributeValue.indexOf('class-') === 0) {
			targetSelector = dataAttributeValue.replace('class-', '.');
		} else if (dataAttributeValue.indexOf('id-') === 0) {
			targetSelector = dataAttributeValue.replace('id-', '#');
		}

		return targetSelector;
	};
}