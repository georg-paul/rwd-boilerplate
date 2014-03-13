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

var interval = {
	//to keep a reference to all the intervals
	intervals : {},

	//create another interval
	make : function (fun, delay) {
		'use strict';
		//see explanation after the code
		try {
			var newInterval = setInterval.apply(
				window,
				[ fun, delay ].concat([].slice.call(arguments, 2))
			);

			this.intervals[newInterval] = true;

			return newInterval;
		} catch (e) { }
	},

	//clear a single interval
	clear : function (id) {
		'use strict';
		try {
			return clearInterval(this.intervals[id]);
		} catch (e) { }
	},

	//clear all intervals
	clearAll : function () {
		'use strict';
		try {
			var all = Object.keys(this.intervals), len = all.length;

			while (len --> 0) {
				clearInterval(all.shift());
			}
		} catch (e) { }
	}
};

function supportsTransitions() {
	'use strict';

	var b = document.body || document.documentElement,
		s = b.style,
		p = 'transition',
		v;

	if (typeof s[p] === 'string') {
		return true;
	}

	// Tests for vendor specific prop
	v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'];
	p = p.charAt(0).toUpperCase() + p.substr(1);

	for (var i = 0; i < v.length; i++) {
		if(typeof s[v[i] + p] === 'string') {
			return true;
		}
	}
	return false;
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
			totalChildrenWidth += halignChild.outerWidth(true);
		});

		return totalChildrenWidth;
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
		var $media = ($rwdObj.find('.img').length) ? $rwdObj.find('.img') : $rwdObj.find('.video'),
			mediaImage = new Image(),
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
			mediaImage.src =  ($media.find('img').length) ? $media.find('img').attr('src') : $media.attr('src');
		} else {
			if ($rwdObj.width() < $media.outerWidth(true) + mediaTextMinWidth) {
				$rwdObj.addClass('no-side-by-side');
			}
		}
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
		$rwdObj.find('.toggle').bind('click', function () {
			$rwdObj.children('ul').toggle();
		});
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
			self.columns($(this));
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

	this.init = function (startItemIndex) {
		self.startItemIndex = startItemIndex || 0;
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
		var $nextItem = self.$slider.find('> .item:nth-child(' + (targetItemIndex + 1) + ')');

		self.updateProgressBars(targetItemIndex);
		self.$slider.addClass('is-animated');
		$nextItem.addClass('active').siblings().removeClass('active');
		self.toggleControlsStateClasses(targetItemIndex);

		if (self.fadeEffect) {
			self.$slider.css({ height: $nextItem.outerHeight() });
			if (!supportsTransitions()) {
				self.$slider.trigger('jsFallbackTransition');
			}

		} else {
			self.$slider.css({ left: targetXPos, height: $nextItem.outerHeight() });
			if (!supportsTransitions()) {
				self.$slider.trigger('jsFallbackTransition');
			}
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
			var targetItemIndex = ($(e.target).hasClass('next-button')) ? self.$slider.find('> .active').next().index() : self.$slider.find('> .active').prev().index();

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
		self.$slider.bind('webkitTransitionEnd transitionend oTransitionEnd jsFallbackTransition', function () {
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
		if ($rwdObj.hasClass('autoplay')) {
			var activeItemIndex = self.$slider.find('> .active').index(),
				targetItemIndex = (activeItemIndex + 1 === self.itemCount) ? 0 : activeItemIndex + 1;

			window.setTimeout(function () {
				self.next(targetItemIndex * self.itemOuterWidth * -1, targetItemIndex);
				try {
					self.instanceInterval = interval.make(function () {
						activeItemIndex = self.$slider.find('> .active').index();
						targetItemIndex = (activeItemIndex + 1 === self.itemCount) ? 0 : activeItemIndex + 1;
						self.next(targetItemIndex * self.itemOuterWidth * -1, targetItemIndex);
					}, self.autoPlayInterval);
				} catch (e) {}
			}, self.autoPlayStart);
		}
	};

	this.clearAutoPlayInterval = function () {
		try {
			interval.clearAll();
		} catch (e) {}
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
		RwdObjectSliderInstance.init(parseInt(startItemIndex, 10));
	});
});

/*global $ */

$(document).ready(function () {
	'use strict';

	new RwdObjectHalign().init();
	new RwdObjectHnav().init();
	new RwdObjectMedia().init();
	new RwdObjectVnav().init();
	new RwdObjectColumns().init();
	new RwdObjectTable().init();
});
/*global $ */

(function () {
	'use strict';

	var resizeTimeout,
		wd = window,
		winWidth = window.innerWidth,
		winHeight = window.innerHeight;

	$(wd).bind('orientationchange', function () {
		var refreshPage = function () {
			$('html').addClass('rwd-boilerplate-loading'); // show loading animation
			wd.location.assign(wd.location.href); // go to the URL
			wd.location.replace(wd.location.href); // go to the URL and replace previous page in history
			wd.location.reload(); // reload page from cache
		};

		// New height and width
		var winNewWidth = window.innerWidth,
			winNewHeight = window.innerHeight;

		// Compare the new height and width with old one
		if (winWidth !== winNewWidth || winHeight !== winNewHeight) {
			window.clearTimeout(resizeTimeout);
			resizeTimeout = wd.setTimeout(refreshPage, 10);
		}
		// Update the width and height
		winWidth = winNewWidth;
		winHeight = winNewHeight;
	});
}());
/*global $ */

$(document).ready(function () {
	'use strict';
	$('.rwd-boilerplate-loading').removeClass('rwd-boilerplate-loading');
});