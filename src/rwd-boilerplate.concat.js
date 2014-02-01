/*global $ */

function waitForImagesToLoad($element, callback) {
	'use strict';
	var images, loaded;

	// Find the images within $element it that aren't loaded yet
	images = $element.find('img').filter(function (index, img) {
		return !this.complete;
	});

	// Find any?
	if (images.length === 0) {
		callback();
	} else {
		loaded = 0;
		images.on('load', function () {
			// callback if the last image has been loaded?
			loaded += 1;
			if (loaded === images.length) {
				callback();
			}
		});
	}
}

function getScrollBarWidth() {
	'use strict';
	var width = 0;

	if (document.body.clientHeight > $('html').height()) {
		document.body.style.overflow = 'hidden';
		width = document.body.clientWidth;
		document.body.style.overflow = 'scroll';
		width -= document.body.clientWidth;
		if (!width) {
			width = document.body.offsetWidth - document.body.clientWidth;
		}
		document.body.style.overflow = '';
	}
	return width;
}


var interval = {
	//to keep a reference to all the intervals
	intervals : {},

	//create another interval
	make : function (fun, delay) {
		//see explanation after the code
		var newInterval = setInterval.apply(
			window,
			[ fun, delay ].concat([].slice.call(arguments, 2))
		);

		this.intervals[newInterval] = true;

		return newInterval;
	},

	//clear a single interval
	clear : function (id) {
		return clearInterval(this.intervals[id]);
	},

	//clear all intervals
	clearAll : function () {
		var all = Object.keys(this.intervals), len = all.length;

		while (len --> 0) {
			clearInterval(all.shift());
		}
	}
};
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

// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function () {
	log.history = log.history || [];   // store logs to an array for reference
	log.history.push(arguments);
	if (this.console) {
		console.log(Array.prototype.slice.call(arguments));
	}
};

function ElementQueries() {
	"use strict";

	var self = this,
		eqSelectorRegExp = new RegExp(/\.(eq)\-(max|min)\-(width|height)\-(\d*)/g),
		maxWSelector = 'eq-max-width-',
		minWSelector = 'eq-min-width-',
		maxHSelector = 'eq-max-height-',
		minHSelector = 'eq-min-height-',
		storedElements = [];

	this.init = function () {
		self.parseStylesheets();
	};

	this.parseStylesheets = function () {
		var selectorTextString = '',
			crossRules,
			crossRulesLength,
			rule = '',
			stylesheetsObject = document.styleSheets;

		for (var i = 0; i < stylesheetsObject.length; i++) {
			try {
				crossRules = stylesheetsObject[i].rules || stylesheetsObject[i].cssRules;
				crossRulesLength = crossRules.length;
				for (var x = 0; x < crossRulesLength; x++) {
					rule = crossRules[x].selectorText;
					selectorTextString += rule + ';';
				}
				self.checkSelectorsForElementQuery(selectorTextString);
			}
			catch(e) {
				log(stylesheetsObject[i], 'cannot be accessed'); // Dev output
			}
		}
	};

	this.checkSelectorsForElementQuery = function (selectorTextString) {
		var elements = selectorTextString.split(';'),
			elementsLength = elements.length,
			selectorText = '';

		for (var i = 0; i < elementsLength; i++) {
			selectorText = (elements[i] !== undefined) ? (elements[i]) : '';
			if (selectorText.match(eqSelectorRegExp) !== null) {
				self.selectorContainsElementQueries(selectorText);
			}
		}
	};

	this.selectorContainsElementQueries = function (selectorText) {
		var targets = selectorText.split(','),
			targetsLength = targets.length,
			storedTargetSelector = '';

		for (var x = 0; x < targetsLength; x++) {
			if (storedTargetSelector !== self.getTargetSelector(targets[x])) {
				self.applyElementQueries(document.querySelectorAll(self.getTargetSelector(targets[x])), self.getWidthAndHeightFromSelector(selectorText));
			}
			storedTargetSelector = self.getTargetSelector(targets[x]);
		}
	};

	this.getWidthAndHeightFromSelector = function (selectorText) {
		return {
			maxW: self.getLengthFromSelector(maxWSelector, selectorText),
			minW: self.getLengthFromSelector(minWSelector, selectorText),
			maxH: self.getLengthFromSelector(maxHSelector, selectorText),
			minH: self.getLengthFromSelector(minHSelector, selectorText)
		};
	};

	this.getTargetSelector = function (selectorText) {
		var selectorPosition = selectorText.search(eqSelectorRegExp);

		selectorText = selectorText.replace(eqSelectorRegExp, '');

		if (selectorText.indexOf(' ', selectorPosition) !== -1) {
			return selectorText.substring(0, selectorText.indexOf(' ', selectorPosition));
		} else {
			return selectorText;
		}
	};

	this.getLengthFromSelector = function (selector, selectorText) {
		var indexOfText = selectorText.indexOf(selector),
			value = parseInt(selectorText.slice(indexOfText + selector.length, indexOfText + selector.length + 4), 10);

		return (value > 0) ? value : false;
	};

	this.applyElementQueries = function (elements, values) {
		var elementWidth,
			elementHeight,
			elementsLength = elements.length;

		if (elementsLength === 0) {
			return;
		} else {
			storedElements.push(elements);
		}

		for (var i = 0; i < elementsLength; i++) {
			elementWidth = elements[i].offsetWidth;
			elementHeight = elements[i].offsetHeight;

			if ((values.maxW > 0 && !values.minW) && (elementWidth < values.maxW)) {
				elements[i].classList.add(maxWSelector + values.maxW); // max width
			}
			if ((values.minW > 0 && !values.maxW) && (elementWidth >= values.minW)) {
				elements[i].classList.add(minWSelector + values.minW); // min width
			}
			if ((values.maxW > 0 && values.minW > 0) && (elementWidth < values.maxW && elementWidth >= values.minW)) {
				elements[i].classList.add(maxWSelector + values.maxW); // max and min width used in combination
				elements[i].classList.add(minWSelector + values.minW);
			}
			if ((values.maxH > 0 && !values.minH) && (elementHeight < values.maxH)) {
				elements[i].classList.add(maxHSelector + values.maxH); // max height
			}
			if ((values.minH > 0 && !values.maxH) && (elementHeight > values.minH)) {
				elements[i].classList.add(minHSelector + values.minH); // min height
			}
			if ((values.maxH > 0 && values.minH > 0) && (elementHeight < values.maxH && elementHeight > values.minH)) {
				elements[i].classList.add(maxHSelector + values.maxH);// max and min height used in combination
				elements[i].classList.add(minHSelector + values.minH);
			}
		}
	};

	this.revertApplication = function () {
		for (var i = 0; i < storedElements.length; i++) {
			for (var j = 0; j < storedElements[i].length; j++) {
				storedElements[i][j].className = (storedElements[i][j].className.replace(' ', '.')).replace(eqSelectorRegExp, '');
			}
		}
	};
}

if (typeof $ === 'undefined' && typeof DomReady !== 'undefined') {
	DomReady.ready(function() {
		'use strict';
		var ElementQueriesInstance = new ElementQueries();
		ElementQueriesInstance.init();
	});
} else {
	$(document).ready(function () {
		'use strict';
		var ElementQueriesInstance = new ElementQueries();
		ElementQueriesInstance.init();
	});
}
/*global $, waitForImagesToLoad */

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
				waitForImagesToLoad($rwdObj, function () {
					self.halign($rwdObj);
				});
			}
		});
	};

	this.halign = function ($rwdObj) {
		self.revertDomChanges($rwdObj);

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

	this.revertDomChanges = function ($rwdObj) {
		var containerId = parseInt($rwdObj.attr('data-halign-id'), 10);
		if (containerId >= 0) {
			$('[data-halign-container-id="' + containerId + '"]').removeClass('children-no-side-by-side').removeClass('children-nearly-no-side-by-side');
		}
		$rwdObj.removeClass('side-by-side').removeClass('no-side-by-side').removeClass('nearly-no-side-by-side');
	};
}
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


function RwdObjectMedia() {
	'use strict';

	var self = this;

	this.init = function () {
		$('.rwd-object-media').each(function () {
			self.media($(this));
		});
	};

	this.media = function ($rwdObj) {
		self.revertDomChanges($rwdObj);

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

	this.revertDomChanges = function ($rwdObj) {
		$rwdObj.removeClass('no-side-by-side');
	};
}
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

	this.init = function () {
		$('.rwd-object-hnav').each(function () {
			var $rwdObj = $(this);
			if (!$rwdObj.hasClass('no-dropdown')) {
				self.hnav($rwdObj);
			}
		});
	};

	this.hnav = function ($rwdObj) {
		self.revertDomChanges($rwdObj);

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
	};

	this.revertDomChanges = function ($rwdObj) {
		$rwdObj.removeClass('breakpoint-small');
		$rwdObj.closest('.rwd-object-hnav-container').removeClass('hnav-breakpoint-small');
		$rwdObj.find('> ul').css('display', '');
		$rwdObj.find('.toggle').unbind();
	};
}
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


function RwdObjectVnav() {
	'use strict';

	var self = this;

	this.init = function () {
		$('.rwd-object-vnav').each(function () {
			self.vnav($(this));
		});
	};

	this.vnav = function ($rwdObj) {
		self.revertDomChanges($rwdObj);

		$rwdObj.find('.toggle').bind('click', function () {
			$rwdObj.children('ul').toggle();
		});
	};

	this.revertDomChanges = function ($rwdObj) {
		$rwdObj.find('*').unbind();
	};
}
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
			var $rwdObj = $(this);
			self.revertDomChanges($rwdObj);
			self.columns($rwdObj);
		});
	};

	this.columns = function ($rwdObj) {
		var availableWidth = $rwdObj.parent().width();

		if (self.getBreakpoint($rwdObj, availableWidth) > availableWidth) {
			$rwdObj.addClass('stacked-columns');
			self.moveContentWithinColumns($rwdObj, false);
		}
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
			// Column widths are relative and the data-breakpoint attribute contains the breakpoint
			breakpoint = $rwdObj.attr('data-breakpoint') || 0;
		}

		return breakpoint;
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
/*global $, waitForImagesToLoad */

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

var RwdObjectSliderInstance;

function RwdObjectSlider($rwdObj) {
	'use strict';

	var self = this;

	self.$slider = $rwdObj.find('> .container');
	self.$sliderItems = self.$slider.find('> .item');
	self.itemCount = self.$sliderItems.length;
	self.itemWidth = $rwdObj.width();
	self.itemMargin = parseInt(self.$sliderItems.first().css('margin-right'), 10);
	self.itemOuterWidth = self.itemWidth + self.itemMargin;
	self.$nextButton = $rwdObj.find('> .slider-nav .next-button');
	self.$prevButton = $rwdObj.find('> .slider-nav .prev-button');
	self.$progressBars = $rwdObj.find('> .slider-nav .progress-bar');
	self.fadeEffect = !!($rwdObj.hasClass('fade'));
	self.autoPlayInterval = $rwdObj.attr('data-autoplay-interval') || 5000;
	self.autoPlayStart = $rwdObj.attr('data-autoplay-start') || 2000;

	this.init = function (startItemIndex, triggeredByResize) {
		self.startItemIndex = startItemIndex || 0;
		self.triggeredByResize = triggeredByResize || false;
		self.setStyles();
		self.bindEvents();
	};

	this.setStyles = function () {
		if (!self.fadeEffect) {
			self.$slider.css({
				'width': self.itemCount * self.itemOuterWidth,
				'left': self.startItemIndex * self.itemOuterWidth * -1
			});
			self.$sliderItems.css('width', self.itemWidth);
		}

		self.$sliderItems.removeClass('active');
		self.$slider.find('> .item:nth-child(' + (self.startItemIndex + 1) + ')').addClass('active');
		if (self.startItemIndex === 0) {
			self.$prevButton.addClass('disabled');
		} else if (self.startItemIndex === self.itemCount) {
			self.$nextButton.addClass('disabled');
		}
		self.$progressBars.each(function () {
			$(this).find('li:nth-child(' + (self.startItemIndex + 1) + ')').addClass('active');
		});

		waitForImagesToLoad(self.$slider, function () {
			self.$slider.css('height', self.$slider.find('> .item:nth-child(' + (self.startItemIndex + 1) + ')').outerHeight());
		});
	};

	this.next = function (targetXPos, targetItemIndex) {
		var $activeItem = self.$slider.find('> .active'),
			$nextItem = self.$slider.find('> .item:nth-child(' + (targetItemIndex + 1) + ')');

		self.updateProgressBars(targetItemIndex);
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
				self.clearAutoPlayInterval();
				self.next(targetItemIndex * self.itemOuterWidth * -1, targetItemIndex);
			}
		});
	};

	this.eventProgressButton = function () {
		self.$progressBars.find('.progress').bind('click', function (e) {
			e.preventDefault();
			var targetItemIndex = $(this).closest('li').index();

			if (!self.isCarouselAnimated() && self.$slider.find('> .active').index() !== targetItemIndex) {
				self.clearAutoPlayInterval();
				self.next(targetItemIndex * self.itemOuterWidth * -1, targetItemIndex);
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
		self.autoplay();
	};

	this.autoplay = function () {
		if ($rwdObj.hasClass('autoplay') && !self.triggeredByResize) {
			var activeItemIndex = self.$slider.find('> .active').index(),
				targetItemIndex = (activeItemIndex + 1 === self.itemCount) ? 0 : activeItemIndex + 1;

			window.setTimeout(function () {
				self.next(targetItemIndex * self.itemOuterWidth * -1, targetItemIndex);
				self.instanceInterval = interval.make(function () {
					activeItemIndex = self.$slider.find('> .active').index();
					targetItemIndex = (activeItemIndex + 1 === self.itemCount) ? 0 : activeItemIndex + 1;
					self.next(targetItemIndex * self.itemOuterWidth * -1, targetItemIndex);
				}, self.autoPlayInterval);
			}, self.autoPlayStart);
		}
	};

	this.clearAutoPlayInterval = function () {
		interval.clearAll();
	};
}

$(document).ready(function () {
	'use strict';

	var $slider,
		startItemIndex = 0;

	$('.rwd-object-slider').each(function () {
		$slider = $(this);
		startItemIndex = $slider.attr('data-start-item') || 0;
		RwdObjectSliderInstance = new RwdObjectSlider($slider);
		RwdObjectSliderInstance.init(parseInt(startItemIndex), false);
	});
});

/*global $ */

var RwdObjectsInstance;

function InitRwdObjects() {
	'use strict';

	var RwdObjectsInstance,
		RwdObjectHalignInstance,
		RwdObjectHnavInstance,
		RwdObjectMediaInstance,
		RwdObjectVnavInstance,
		RwdObjectColumnsInstance;

	RwdObjectHalignInstance = new RwdObjectHalign();
	RwdObjectHalignInstance.init();

	RwdObjectHnavInstance = new RwdObjectHnav();
	RwdObjectHnavInstance.init();

	RwdObjectMediaInstance = new RwdObjectMedia();
	RwdObjectMediaInstance.init();

	RwdObjectVnavInstance = new RwdObjectVnav();
	RwdObjectVnavInstance.init();

	RwdObjectColumnsInstance = new RwdObjectColumns();
	RwdObjectColumnsInstance.init();
}

$(document).ready(function () {
	'use strict';

	RwdObjectsInstance = new InitRwdObjects();
});
/*global $ */

(function () {
	'use strict';

	var resizeTimeout,
		wd = window;

	$(window).bind('resize orientationchange', function () {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(function () {
			document.querySelector('html').classList.add('rwd-boilerplate-loading'); // show loading animation
			wd.location.assign(wd.location.href); // go to the URL
			wd.location.replace(wd.location.href); // go to the URL and replace previous page in history
			wd.location.reload(false); // reload page from cache
		}, 100);
	});
}());
/*global $ */

$(document).ready(function () {
	'use strict';
	document.querySelector('html').classList.remove('rwd-boilerplate-loading');
});