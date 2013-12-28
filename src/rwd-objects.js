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

function RwdObjects() {
	"use strict";

	var self = this;

	this.init = function () {
		$('[class*="rwd-object"]').each(function () {
			var $rwdObj = $(this),
				classNames = $rwdObj.attr('class').split(/\s+/),
				objType = '',
				i = 0;

			for (i = 0; i < classNames.length; i += 1) {
				objType = classNames[i].split('rwd-object-')[1];
				if (objType !== undefined) {
					if (objType === 'halign' || objType === 'valign-middle') {
						self.halign($rwdObj);
					} else if (objType === 'media') {
						self.media($rwdObj);
					} else if (objType === 'hnav') {
						self.hnav($rwdObj);
					} else if (objType === 'vnav') {
						self.vnav($rwdObj);
					} else if (objType.indexOf('columns-') !== -1) {
						self.columns($rwdObj);
					} else if (objType === 'slider') {
						self.carousel($rwdObj);
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
			if ($rwdObj.width() < $media.outerWidth() + mediaTextMinWidth) {
				$rwdObj.addClass('no-side-by-side');
			}
		}
	};

	this.hnav = function ($rwdObj) {
		var $rootUL = $rwdObj.find('> ul'),
			totalWidth = 0,
			clickEventType = (document.ontouchstart !== null) ? 'click' : 'touchstart',
			$listItem;

		$rootUL.find('> li').each(function () {
			$listItem = $(this);
			totalWidth += $listItem.outerWidth();
		});

		// rounding bug?!
		if (totalWidth > $rootUL.width() + 3) {
			$rwdObj.addClass('breakpoint-small');
			$rwdObj.closest('.rwd-object-hnav-container').addClass('hnav-breakpoint-small');
		}

		if (!$rwdObj.hasClass('no-dropdown')) {
			$rwdObj.addClass('dropdown');
		}

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
		var $columnsParent = $rwdObj.parent(),
			breakpoint = $rwdObj.attr('data-breakpoint') || 0,
			availableWidth = $columnsParent.width();

		// If the breakpoint is reached and the columns are stacked
		if (breakpoint > availableWidth) {
			$rwdObj.addClass('stacked-columns');
			self.moveContentWithinColumns($rwdObj);
		}
	};

	this.moveContentWithinColumns = function ($rwdObj) {
		$rwdObj.find('[data-move-down]').each(function () {
			var $elementToMove = $(this),
				columnIndex = $elementToMove.closest('.column').index() + 1,
				targetColumn = columnIndex + parseInt($elementToMove.attr('data-move-down'), 10);

			$elementToMove.appendTo($rwdObj.children(':nth-child(' + targetColumn + ')'));
		});
		$rwdObj.find('[data-move-up]').each(function () {
			var $elementToMove = $(this),
				columnIndex = $elementToMove.closest('.column').index() + 1,
				targetColumn = columnIndex - parseInt($elementToMove.attr('data-move-up'), 10);

			$elementToMove.appendTo($rwdObj.children(':nth-child(' + targetColumn + ')'));
		});
	};

	this.carousel = function ($rwdObj) {
		var self = this;

		self.$slider = $rwdObj.find('.container');
		self.$sliderItems = self.$slider.find('.item');
		self.itemWidth = $rwdObj.width();
		self.$nextButton = $rwdObj.find('.next');
		self.$prevButton = $rwdObj.find('.prev');

		this.init = function () {
			self.setStyles();
			self.bindEvents();
		};

		this.setStyles = function () {
			self.$slider.css('width', self.$sliderItems.length * self.itemWidth);
			self.$sliderItems.css('width', self.itemWidth);
			self.$sliderItems.first().addClass('active');
			self.$prevButton.addClass('disabled');
			$rwdObj.find('.progress:first').closest('li').addClass('active');

			waitForImagesToLoad(self.$slider, function () {
				self.$slider.css('height', self.$sliderItems.first().height());
			});
		};

		this.next = function (targetXPos, targetItemIndex) {
			var $activeItem = self.$slider.find('.active'),
				$nextItem = self.$slider.find('.item:nth-child(' + (targetItemIndex + 1) + ')');

			self.$slider.addClass('is-animated');
			$activeItem.removeClass('active');
			$nextItem.addClass('active');

			if (targetItemIndex === 0) {
				self.$prevButton.addClass('disabled');
				self.$nextButton.removeClass('disabled');
			} else if (targetItemIndex === self.$slider.find('.item:last-child').index()) {
				self.$nextButton.addClass('disabled');
				self.$prevButton.removeClass('disabled');
			} else {
				self.$nextButton.removeClass('disabled');
				self.$prevButton.removeClass('disabled');
			}

			self.$slider.css({
				left: targetXPos,
				height: $nextItem.height()
			});
		};

		this.isCarouselAnimated = function () {
			return self.$slider.hasClass('is-animated');
		};

		this.eventNextButton = function () {
			self.$nextButton.bind('click', function (e) {
				e.preventDefault();
				if (!self.isCarouselAnimated() && !$(this).hasClass('disabled')) {
					self.next(parseInt(self.$slider.css('left'), 10) - self.itemWidth, self.$slider.find('.active').next().index());
				}
			});
		};

		this.eventPrevButton = function () {
			self.$prevButton.bind('click', function (e) {
				e.preventDefault();
				if (!self.isCarouselAnimated() && !$(this).hasClass('disabled')) {
					self.next(parseInt(self.$slider.css('left'), 10) + self.itemWidth, self.$slider.find('.active').prev().index());
				}
			});
		};

		this.eventProgressButton = function () {
			$('.progress').bind('click', function (e) {
				var $progressButtonListItem = $(this).closest('li'),
					targetItemIndex = $progressButtonListItem.index();

				if (!self.isCarouselAnimated() && self.$slider.find('.active').index() !== targetItemIndex) {
					$progressButtonListItem.siblings().removeClass('active');
					$progressButtonListItem.addClass('active');
					self.next(targetItemIndex * self.itemWidth * -1, targetItemIndex);
				}
			});
		};

		this.eventTransitionEnd = function () {
			self.$slider.bind('webkitTransitionEnd transitionend oTransitionEnd', function () {
				self.$slider.removeClass('is-animated');
			});
		};

		this.bindEvents = function () {
			self.eventNextButton();
			self.eventPrevButton();
			self.eventProgressButton();
			self.eventTransitionEnd();
		};

		self.init();
	};
}


(function () {
	new RwdObjects().init();
}());