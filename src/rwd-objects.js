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
		self.checkForCollision();
	};

	this.checkForCollision = function () {
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

		self.$carouselContainer = $rwdObj;
		self.$slider = $rwdObj.find('.container');
		self.$sliderItems = self.$slider.find('.item');
		self.itemCount = self.$sliderItems.length;
		self.speed = parseInt($rwdObj.attr('data-speed'), 10) || 1000;
		self.nextBtnClass = 'next-btn';
		self.prevBtnClass = 'prev-btn';
		self.controlsMarkup = '<button class="' + this.prevBtnClass + '">Previous</button><button class="' + this.nextBtnClass + '">Next</button>';

		this.init = function () {
			self.getInfo();
			self.applyInitialStylesAndTraversing();
			self.addControls(self.controlsMarkup);
			self.bindEvents();
		};

		this.init = function () {
			self.getInfo();
			self.applyInitialStylesAndTraversing();
			self.addControls(self.controlsMarkup);
			self.bindEvents();
		};

		this.isCarouselBehaviourPossible = function () {
			return !!(self.itemCount >= 2);
		};

		this.hasCarouselTwoItems = function () {
			return !!(self.itemCount === 2);
		};

		this.getInfo = function () {
			self.itemWidth = self.$carouselContainer.width();
			self.totalItems = self.$sliderItems.length;
			self.totalWidth = self.totalItems * self.itemWidth;
		};

		this.applyInitialStylesAndTraversing = function () {
			if (self.hasCarouselTwoItems()) {
				self.$slider.css('width', self.totalWidth + self.itemWidth);
			} else {
				self.$slider.css('width', self.totalWidth);
			}
			self.$sliderItems.css('width', self.itemWidth);

			waitForImagesToLoad(self.$slider, function () {
				self.$slider.css('height', self.getFirstItemHeight());
			});

			if (self.isCarouselBehaviourPossible()) {
				self.$slider.find('.item:first').addClass('active');
				if (self.hasCarouselTwoItems()) {
					self.$slider.find('.item:first').before(self.$slider.find('.item:last').clone());
				} else {
					self.$slider.find('.item:first').before(self.$slider.find('.item:last'));
				}

				self.$slider.css('left', self.itemWidth * (-1));
			}
		};

		this.addControls = function (html) {
			if (self.isCarouselBehaviourPossible()) {
				if (self.$carouselContainer.find('.' + self.nextBtnClass).length === 0) {
					self.$carouselContainer.prepend(html);
				}
			}
		};

		this.next = function (speed, direction) {
			var currentXPos = parseInt(self.$slider.css('left'), 10),
				$activeItem = self.$slider.find('.active'),
				$nextItem = $activeItem.next();

			self.$carouselContainer.addClass('is-animated');
			self.switchActiveClass($activeItem, $nextItem);

			self.$slider.animate({
				left: currentXPos - self.itemWidth,
				height: self.getNextItemHeight($nextItem)
			}, speed, function () {
				self.animationCallback('next');
			});
		};

		this.prev = function (speed, direction) {
			var currentXPos = parseInt(self.$slider.css('left'), 10),
				$activeItem = self.$slider.find('.active'),
				$nextItem = $activeItem.prev();

			self.$carouselContainer.addClass('is-animated');
			self.switchActiveClass($activeItem, $nextItem);

			self.$slider.animate({
				left: currentXPos + self.itemWidth,
				height: self.getNextItemHeight($nextItem)
			}, speed, function () {
				self.animationCallback('prev');
			});
		};

		this.animationCallback = function (direction) {
			if (self.hasCarouselTwoItems()) {
				if (direction === 'next') {
					self.$slider.find('.item:first').remove();
					self.$slider.find('> .active').prev().clone().appendTo(self.$slider);
				} else {
					self.$slider.find('.item:last').remove();
					self.$slider.find('> .active').next().clone().prependTo(self.$slider);
				}
				self.$slider.css('left', self.itemWidth * (-1));
			} else {
				if (direction === 'next') {
					self.$slider.find('.item:last').after(self.$slider.find('.item:first'));
				} else {
					self.$slider.find('.item:first').before(self.$slider.find('.item:last'));
				}
				self.$slider.css('left', self.itemWidth * (-1));
			}

			self.$carouselContainer.removeClass('is-animated');
		};

		this.getNextItemHeight = function ($next) {
			return $next.height();
		};

		this.getFirstItemHeight = function () {
			return self.$sliderItems.first().height();
		};

		this.switchActiveClass = function ($activeItem, $nextItem) {
			$activeItem.removeClass('active');
			$nextItem.addClass('active');
		};

		this.nextBtnEvent = function () {
			$('.' + this.nextBtnClass).bind('click', function () {
				if (!self.isCarouselAnimatedRightNow()) {
					self.next(self.speed);
				}
			});
		};

		this.prevBtnEvent = function () {
			$('.' + this.prevBtnClass).bind('click', function () {
				if (!self.isCarouselAnimatedRightNow()) {
					self.prev(self.speed);
				}
			});
		};

		this.orientationChange = function () {
			$(window).bind('orientationchange', function () {
				self.init();
			});
		};

		this.isCarouselAnimatedRightNow = function () {
			return !!(self.$carouselContainer.hasClass('is-animated'));
		};

		this.bindEvents = function () {
			if (self.isCarouselBehaviourPossible()) {
				self.nextBtnEvent();
				self.prevBtnEvent();
			}
			self.orientationChange();
		};

		self.init();
	};
}


(function () {
	new RwdObjects().init();
}());