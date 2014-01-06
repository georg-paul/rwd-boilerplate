/*jslint browser: true, nomen: false, devel: true*/
/*global $ */

/*
 The MIT License (MIT)

 Copyright (c) 2013 georg-paul

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

var RwdObjectsInstance;

function RwdObjects() {
	"use strict";

	var self = this;

	this.init = function (revert) {
		$('[class*="rwd-object"]').each(function () {
			var $rwdObj = $(this),
				classNames = $rwdObj.attr('class').split(/\s+/),
				objType = '',
				i;

			for (i = 0; i < classNames.length; i += 1) {
				objType = classNames[i].split('rwd-object-')[1];
				if (objType !== undefined) {
					if (objType === 'halign' || objType === 'valign-middle') {
						if (!revert) {
							self.halign($rwdObj);
						} else {
							$rwdObj.removeClass('no-side-by-side');
							$rwdObj.removeClass('nearly-no-side-by-side');
							$rwdObj.closest('.rwd-object-halign-container').removeClass('children-no-side-by-side');
							$rwdObj.closest('.rwd-object-halign-container').removeClass('children-nearly-no-side-by-side');
						}
					} else if (objType === 'media') {
						if (!revert) {
							self.media($rwdObj);
						} else {
							$rwdObj.removeClass('no-side-by-side');
						}
					} else if (objType === 'hnav') {
						if (!revert) {
							if (!$rwdObj.hasClass('no-dropdown')) {
								self.hnav($rwdObj);
							}
						} else {
							$rwdObj.removeClass('breakpoint-small');
							$rwdObj.closest('.rwd-object-hnav-container').removeClass('hnav-breakpoint-small');
							$rwdObj.find('> ul').css('display', '');
							$rwdObj.find('*').unbind();
						}
					} else if (objType === 'vnav') {
						if (!revert) {
							self.vnav($rwdObj);
						} else {
							$rwdObj.find('*').unbind();
						}
					} else if (objType.indexOf('columns-') !== -1) {
						if (!revert) {
							self.columns($rwdObj);
						} else {
							$rwdObj.removeClass('stacked-columns');
							self.moveContentWithinColumns($rwdObj, true);
						}
					}
				}
			}
		});
	};

	this.halign = function ($rwdObj) {
		var totalChildrenWidth = 0,
			availableWidth = $rwdObj.width(),
			halignChild;

		if ($rwdObj.hasClass('full-width')) {
			return;
		}

		$rwdObj.children().each(function () {
			halignChild = $(this);
			totalChildrenWidth += halignChild.width();
			totalChildrenWidth += parseInt(halignChild.css('margin-left'), 10);
			totalChildrenWidth += parseInt(halignChild.css('margin-right'), 10);
		});

		if (totalChildrenWidth > availableWidth) {
			$rwdObj.addClass('no-side-by-side');
			$rwdObj.closest('.rwd-object-halign-container').addClass('children-no-side-by-side');
		} else if (totalChildrenWidth + 50 > availableWidth) {
			$rwdObj.addClass('nearly-no-side-by-side side-by-side');
			$rwdObj.closest('.rwd-object-halign-container').addClass('children-nearly-no-side-by-side');
		} else {
			$rwdObj.addClass('side-by-side');
		}
	};

	this.media = function ($rwdObj) {
		var $media = ($rwdObj.find('.img').length) ? $rwdObj.find('.img') : $rwdObj.find('.video'),
			mediaImage = new Image(),
			imageSrc = ($media.find('img').length) ? $media.find('img').attr('src') : $media.attr('src'),
			mediaObjectIsHidden = false,
			$bd = $rwdObj.children('.bd'),
			mediaTextMinWidth = ($bd.css('min-width') !== undefined) ? parseInt($bd.css('min-width'), 10) : 0;

		if ($media.hasClass('img')) {
			mediaImage.onload = function () {
				mediaObjectIsHidden = ($rwdObj.width() <= 0);
				if (!mediaObjectIsHidden && ($rwdObj.width() < this.width + parseInt($media.css('margin-left'), 10) + parseInt($media.css('margin-right'), 10) + mediaTextMinWidth)) {
					$rwdObj.addClass('no-side-by-side');
				}
				$media.css('max-width', this.width);
			};
			mediaImage.src =  imageSrc;
		} else {
			if ($rwdObj.width() < $media.outerWidth(true) + mediaTextMinWidth) {
				$rwdObj.addClass('no-side-by-side');
			}
		}
	};

	this.hnav = function ($rwdObj) {
		var $rootUL = $rwdObj.find('> ul'),
			firstLevelItems = $rootUL.find('> li'),
			firstTopValue = firstLevelItems.first().position().top,
			clickEventType = (document.ontouchstart !== null) ? 'click' : 'touchstart';

		firstLevelItems.each(function () {
			if ($(this).position().top > firstTopValue) {
				$rwdObj.addClass('breakpoint-small');
				$rwdObj.closest('.rwd-object-hnav-container').addClass('hnav-breakpoint-small');
				return false;
			}
		});

		$rwdObj.find('.toggle').bind(clickEventType, function () {
			$rootUL.toggle();
			$(this).toggleClass('open');
		});
	};

	this.vnav = function ($rwdObj) {
		$rwdObj.find('.toggle').bind('click', function () {
			$rwdObj.children('ul').toggle();
		});
	};

	this.columns = function ($rwdObj) {
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
}

$(document).ready(function () {
	"use strict";

	RwdObjectsInstance = new RwdObjects();
	RwdObjectsInstance.init(false);
});