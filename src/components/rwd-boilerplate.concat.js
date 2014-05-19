if (!("classList" in document.documentElement) && Object.defineProperty && typeof HTMLElement !== 'undefined') {
	Object.defineProperty(HTMLElement.prototype, 'classList', {
		get: function() {
			var self = this;
			function update(fn) {
				return function(value) {
					var classes = self.className.split(/\s+/),
						index = classes.indexOf(value);

					fn(classes, index, value);
					self.className = classes.join(" ");
				}
			}

			var ret = {
				add: update(function(classes, index, value) {
					~index || classes.push(value);
				}),

				remove: update(function(classes, index) {
					~index && classes.splice(index, 1);
				}),

				toggle: update(function(classes, index, value) {
					~index ? classes.splice(index, 1) : classes.push(value);
				}),

				contains: function(value) {
					return !!~self.className.split(/\s+/).indexOf(value);
				},

				item: function(i) {
					return self.className.split(/\s+/)[i] || null;
				}
			};

			Object.defineProperty(ret, 'length', {
				get: function() {
					return self.className.split(/\s+/).length;
				}
			});

			return ret;
		}
	});
}
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

			if ((values.maxW > 0 && !values.minW) && (elementWidth <= values.maxW)) {
				elements[i].classList.add(maxWSelector + values.maxW); // max width
			}
			if ((values.minW > 0 && !values.maxW) && (elementWidth >= values.minW)) {
				elements[i].classList.add(minWSelector + values.minW); // min width
			}
			if ((values.maxW > 0 && values.minW > 0) && (elementWidth <= values.maxW && elementWidth >= values.minW)) {
				elements[i].classList.add(maxWSelector + values.maxW); // max and min width used in combination
				elements[i].classList.add(minWSelector + values.minW);
			}
			if ((values.maxH > 0 && !values.minH) && (elementHeight <= values.maxH)) {
				elements[i].classList.add(maxHSelector + values.maxH); // max height
			}
			if ((values.minH > 0 && !values.maxH) && (elementHeight >= values.minH)) {
				elements[i].classList.add(minHSelector + values.minH); // min height
			}
			if ((values.maxH > 0 && values.minH > 0) && (elementHeight <= values.maxH && elementHeight >= values.minH)) {
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
		images.on('error', function () {
			callback();
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

function rwdBoilerplateHideLoading () {
	'use strict';

	$('html').removeClass('rwd-boilerplate-loading');
}

function rwdBoilerplateShowLoading () {
	'use strict';

	$('html').addClass('rwd-boilerplate-loading');
}

function rwdBoilerplateSetFixedPageWidth () {
	'use strict';

	var $body = $('body');
	$body.css('width', $body.get(0).clientWidth);
}

function rwdBoilerplateRemoveAppliedElementQueries ($context) {
	'use strict';

	$context.find('[class*="eq-max-width-"], [class*="eq-min-width-"]').each(function () {
		var $this = $(this);

		rwdBoilerplateRemoveClassesWithGivenPrefix($this, 'eq-max-width-');
		rwdBoilerplateRemoveClassesWithGivenPrefix($this, 'eq-min-width-');
	});
}

function rwdBoilerplateRemoveClassesWithGivenPrefix ($target, classPrefix) {
	'use strict';

	var classes = $target.attr("class").split(" ").filter(function (c) {
		return c.lastIndexOf(classPrefix, 0) !== 0;
	});
	$target.attr("class", classes.join(" "));
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

	this.init = function ($rwdObj) {
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
				$media.attr('data-image-ready', true);
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

	this.init = function ($rwdObj) {
		if (!$rwdObj.hasClass('no-dropdown')) {
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


function RwdObjectVnav() {
	'use strict';

	var self = this;

	this.init = function ($rwdObj) {
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

	this.init = function ($rwdObj) {
		if ($rwdObj.width() > $rwdObj.parent().width()) {
			$rwdObj.addClass('oversize');
			if (!$rwdObj.hasClass('simple-scrolling')) {
				$rwdObj.addClass('fixed-thead');
				self.equalCellHeightPerRow($rwdObj);
			}
		}
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

var RwdObjectSliderInstance;

function RwdObjectSlider() {
	'use strict';

	var self = this;

	this.init = function ($rwdObj) {
		self.$rwdObj = $rwdObj;
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
		self.startItemIndex = parseInt($rwdObj.attr('data-start-item'), 10) || 0;

		if (typeof initCallbackRwdObjectSlider === 'function') {
			initCallbackRwdObjectSlider();
		}

		self.setStyles();

		if (self.itemCount > 1) {
			self.bindEvents();
		} else {
			self.$nextButton.addClass('disabled');
			self.$prevButton.addClass('disabled');
			self.$progressBars.addClass('disabled');
		}
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

		self.$slider.css('height', self.$slider.find('> .item:nth-child(' + (self.startItemIndex + 1) + ')').outerHeight());
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

		if (typeof nextCallbackRwdObjectSlider === 'function') {
			nextCallbackRwdObjectSlider(self.$rwdObj, targetItemIndex);
		}
	};

	this.isCarouselAnimated = function ($carousel) {
		return $carousel.hasClass('is-animated');
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

			if (!self.isCarouselAnimated(self.$slider) && !$(this).hasClass('disabled')) {
				self.clearAutoPlayInterval();
				self.next(targetItemIndex * self.itemOuterWidth * -1, targetItemIndex);
			}
		});
	};

	this.eventProgressButton = function () {
		self.$progressBars.find('.progress').bind('click', function (e) {
			e.preventDefault();
			var targetItemIndex = $(this).closest('li').index();

			if (!self.isCarouselAnimated(self.$slider) && self.$slider.find('> .active').index() !== targetItemIndex) {
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
		if (self.$rwdObj.hasClass('autoplay')) {
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


function TraverseFlyoutComponents() {
	"use strict";

	var self = this,
		selectorRegExp = new RegExp(/\.(append-to-flyout|clone-to-flyout)\-(\d*)\-(slot)\-(\d*)\-(component)\-(.+)/g),
		flyoutTargetSlots = [];

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
				self.checkSelectorsForFlyoutQuery(selectorTextString);
			}
			catch(e) {
				log(stylesheetsObject[i], 'cannot be accessed'); // Dev output
			}
		}
	};

	this.checkSelectorsForFlyoutQuery = function (selectorTextString) {
		var elements = selectorTextString.split(';'),
			elementsLength = elements.length,
			selectorText = '';

		for (var i = 0; i < elementsLength; i++) {
			selectorText = (elements[i] !== undefined) ? (elements[i]) : '';
			if (selectorText.match(selectorRegExp) !== null) {
				self.selectorContainsFlyoutQueries(selectorText);
			}
		}
	};

	this.selectorContainsFlyoutQueries = function (selectorText) {
		var targets = selectorText.split(','),
			targetsLength = targets.length,
			storedTargetSelector = '';

		for (var x = 0; x < targetsLength; x++) {
			if (storedTargetSelector !== self.getTargetSelector(targets[x])) {
				self.traverseElements(document.querySelectorAll(self.getTargetSelector(targets[x])), self.getFlyoutInfoFromSelector(selectorText), selectorText);
			}
			storedTargetSelector = self.getTargetSelector(targets[x]);
		}
	};

	this.getFlyoutInfoFromSelector = function (selectorText) {
		return {
			flyoutID: self.getIntegerFromSelector('to-flyout-', selectorText),
			targetSlot: self.getIntegerFromSelector('slot-', selectorText),
			componentClass: selectorText.split('component-')[1]
		};
	};

	this.getTargetSelector = function (selectorText) {
		var selectorPosition = selectorText.search(selectorRegExp);

		selectorText = selectorText.replace(selectorRegExp, '');

		if (selectorText.indexOf(' ', selectorPosition) !== -1) {
			return selectorText.substring(0, selectorText.indexOf(' ', selectorPosition));
		} else {
			return selectorText;
		}
	};

	this.getIntegerFromSelector = function (selector, selectorText) {
		var indexOfText = selectorText.indexOf(selector),
			value = parseInt(selectorText.slice(indexOfText + selector.length, indexOfText + selector.length + 2), 10);

		return (value > 0) ? value : false;
	};

	this.traverseElements = function (elements, values, selectorText) {
		for (var i = 0; i < elements.length; i++) {
			var $component = $('<div class="component component-' + values.componentClass + '"></div>'),
				$target = (selectorText.indexOf('append-to-flyout-') !== -1) ? $(elements[i]) : $(elements[i]).clone();

			self.insertAtIndex($('[data-flyout-id="' + values.flyoutID + '"] .flyout-components'), $component.append($target), values.targetSlot);
		}
	};

	this.insertAtIndex = function($targetContainer, $element, targetSlot) {
		flyoutTargetSlots.push(targetSlot);
		flyoutTargetSlots.sort();
		targetSlot = flyoutTargetSlots.indexOf(targetSlot);

		if ($targetContainer.children().size() === 0 || targetSlot === 0) {
			$element.prependTo($targetContainer);
		} else {
			$targetContainer.find('.component:nth-child(' + targetSlot + ')').after($element);
		}
	};
}



function RwdObjectFlyout() {
	'use strict';

	var self = this;

	this.init = function ($rwdObj) {
		self.bindEvents($rwdObj);
	};

	this.bindEvents = function ($rwdObj) {
		self.eventHideAllAndShowTriggered($rwdObj);
		self.eventClose($rwdObj);
	};

	this.eventHideAllAndShowTriggered = function ($rwdObj) {
		var flyoutID = $rwdObj.data('flyout-id');

		$('[data-trigger-flyout-id="' + flyoutID + '"]').bind('click', function () {
			self.hideAllAndShowTriggered($rwdObj, flyoutID);
		});
	};

	this.eventClose = function ($rwdObj) {
		$rwdObj.find('.flyout-close').bind('click', function () {
			self.close($rwdObj);
		});
	};

	this.hideAllAndShowTriggered = function ($rwdObj, flyoutID) {
		$('[data-flyout-id]').not('[data-flyout-id="' + flyoutID + '"]').removeClass('visible');
		$rwdObj.toggleClass('visible');
		self.toggleBodyClass();
	};

	this.close = function ($rwdObj) {
		$rwdObj.removeClass('visible');
		$('body').removeClass('flyout-mode');
	};

	this.toggleBodyClass = function () {
		var $body = $('body'),
			flyoutBodyClass = 'flyout-mode';

		if ($('[data-flyout-id].visible').length) {
			$body.addClass(flyoutBodyClass);
		} else {
			$body.removeClass(flyoutBodyClass);
		}
	};
}
/*global $, ElementQueries, initCallbackRwdObjects, waitForImagesToLoad, rwdBoilerplateSetFixedPageWidth,
rwdBoilerplateRemoveAppliedElementQueries, rwdBoilerplateHideLoading, rwdBoilerplateDone */

$(document).ready(function () {
	'use strict';

	// calls the global function 'initCallbackRwdObjects()' if you want to
	// inject custom code to the DOM before the rwd-objects are initialized
	if (typeof initCallbackRwdObjects === 'function') {
		initCallbackRwdObjects();
	}

	// sets fixed page width to body tag to prevent visual bugs after resize or orientationchange
	rwdBoilerplateSetFixedPageWidth();

	// iterates over all rwd-objects and run code after all images
	// within rwd-object-halign and rwd-object-slider have been loaded
	waitForImagesToLoad($('.rwd-object-halign, .rwd-object-slider'), function () {
		$('[class*="rwd-object-"]').each(function () {
			var $rwdObj = $(this),
				classNames = $rwdObj.attr('class').split(/\s+/),
				objType = '',
				i = 0;

			for (i = 0; i < classNames.length; i += 1) {
				objType = classNames[i].split('rwd-object-')[1];
				if (objType !== undefined) {
					if (objType === 'halign') {
						new RwdObjectHalign().init($rwdObj);
					} else if (objType === 'media') {
						new RwdObjectMedia().init($rwdObj);
					} else if (objType === 'hnav') {
						new RwdObjectHnav().init($rwdObj);
					} else if (objType === 'vnav') {
						new RwdObjectVnav().init($rwdObj);
					} else if (objType.indexOf('columns-') !== -1) {
						new RwdObjectColumns().init($rwdObj);
					} else if (objType.indexOf('table') !== -1) {
						new RwdObjectTable().init($rwdObj);
					} else if (objType.indexOf('slider') !== -1) {
						new RwdObjectSlider().init($rwdObj);
					} else if (objType.indexOf('flyout') !== -1) {
						new RwdObjectFlyout().init($rwdObj);
					}
				}
			}
		});

		// after all changes to the DOM caused by the rwd-objects are complete
		// parse the stylesheets, search for flyout patterns and move nodes to flyouts
		new TraverseFlyoutComponents().init();

		// removes applied element queries and reruns element queries
		// due to DOM traversing caused by the rwd-objects code
		rwdBoilerplateRemoveAppliedElementQueries($('html'));
		new ElementQueries().init();

		// hides the loading animtion
		// --> Probably hide animation earlier, not in the callback of waitForImagesToLoad
		// --> FOUC might be better than showing the loading animation for too long
		rwdBoilerplateHideLoading();

		// you can run your code safely after rwd-boilerplate stuff is done
		// use the following callback function
		if (typeof rwdBoilerplateDone === 'function') {
			rwdBoilerplateDone();
		}
	});
});