/*jslint browser: true, nomen: false, devel: true*/
/*global $, waitForImagesToLoad */

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

var RwdObjectSliderInstance;

function RwdObjectSlider($rwdObj) {
	"use strict";

	var self = this;

	self.$slider = $rwdObj.find('> .container');
	self.$sliderItems = self.$slider.find('> .item');
	self.itemWidth = $rwdObj.width();
	self.$nextButton = $rwdObj.find('> .slider-nav .next-button');
	self.$prevButton = $rwdObj.find('> .slider-nav .prev-button');
	self.$progressBars = $rwdObj.find('> .slider-nav .progress-bar');
	self.fadeEffect = !!($rwdObj.hasClass('fade'));

	this.init = function (startItemIndex) {
		self.setStyles(startItemIndex);
		self.bindEvents();
	};

	this.setStyles = function (startItemIndex) {
		if (!self.fadeEffect) {
			self.$slider.css({
				'width': self.$sliderItems.length * self.itemWidth,
				'left': startItemIndex * self.itemWidth * -1
			});
			self.$sliderItems.css('width', self.itemWidth);
		}

		self.$sliderItems.removeClass('active');
		self.$slider.find('> .item:nth-child(' + (startItemIndex + 1) + ')').addClass('active');
		if (startItemIndex === 0) {
			self.$prevButton.addClass('disabled');
		} else if (startItemIndex === self.$sliderItems.length) {
			self.$nextButton.addClass('disabled');
		}
		self.$progressBars.each(function () {
			$(this).find('li:nth-child(' + (startItemIndex + 1) + ')').addClass('active');
		});

		waitForImagesToLoad(self.$slider, function () {
			self.$slider.css('height', self.$slider.find('> .item:nth-child(' + (startItemIndex + 1) + ')').outerHeight());
		});
	};

	this.next = function (targetXPos, targetItemIndex) {
		var $activeItem = self.$slider.find('> .active'),
			$nextItem = self.$slider.find('> .item:nth-child(' + (targetItemIndex + 1) + ')');

		self.$slider.addClass('is-animated');
		$nextItem.addClass('active').siblings().removeClass('active');
		self.toggleControlsStateClasses(targetItemIndex);

		if (self.fadeEffect) {
			self.$slider.css({ height: $nextItem.outerHeight() });
		} else {
			self.$slider.css({ left: targetXPos, height: $nextItem.outerHeight() });
		}
	};

	this.isCarouselAnimated = function () {
		return self.$slider.hasClass('is-animated');
	};

	this.toggleControlsStateClasses = function (targetItemIndex) {
		if (targetItemIndex === 0) {
			self.$prevButton.addClass('disabled');
			self.$nextButton.removeClass('disabled');
		} else if (targetItemIndex === self.$slider.find('> .item:last-child').index()) {
			self.$nextButton.addClass('disabled');
			self.$prevButton.removeClass('disabled');
		} else {
			self.$nextButton.removeClass('disabled');
			self.$prevButton.removeClass('disabled');
		}
	};

	this.eventNextAndPrevButton = function ($button) {
		$button.bind('click', function (e) {
			e.preventDefault();
			var isNextButton = $(e.target).hasClass('next-button'),
				targetItemIndex = (isNextButton) ? self.$slider.find('> .active').next().index() : self.$slider.find('> .active').prev().index();

			if (!self.isCarouselAnimated() && !$(this).hasClass('disabled')) {
				self.updateProgressBars(targetItemIndex);
				self.next(targetItemIndex * self.itemWidth * -1, targetItemIndex);
			}
		});
	};

	this.eventProgressButton = function () {
		self.$progressBars.find('.progress').bind('click', function (e) {
			e.preventDefault();
			var targetItemIndex = $(this).closest('li').index();

			if (!self.isCarouselAnimated() && self.$slider.find('> .active').index() !== targetItemIndex) {
				self.updateProgressBars(targetItemIndex);
				self.next(targetItemIndex * self.itemWidth * -1, targetItemIndex);
			}
		});
	};

	this.updateProgressBars = function (targetItemIndex) {
		self.$progressBars.each(function () {
			$(this).find('li').removeClass('active');
			$(this).find('li:nth-child(' + (targetItemIndex + 1) + ')').addClass('active');
		});
	};

	this.eventTransitionEnd = function () {
		self.$slider.bind('webkitTransitionEnd transitionend oTransitionEnd', function () {
			self.$slider.removeClass('is-animated');
		});
	};

	this.bindEvents = function () {
		self.eventNextAndPrevButton(self.$nextButton);
		self.eventNextAndPrevButton(self.$prevButton);
		self.eventProgressButton();
		self.eventTransitionEnd();
	};
}

$('.rwd-object-slider').each(function (i) {
	RwdObjectSliderInstance = new RwdObjectSlider($(this));
	RwdObjectSliderInstance.init(0);
});
