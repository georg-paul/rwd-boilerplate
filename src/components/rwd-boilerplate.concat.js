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
			$rwdObj.data('old-state', $rwdObj.get(0).outerHTML);
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
			var $rwdObj = $(this);
			$rwdObj.data('old-state', $rwdObj.get(0).outerHTML);
			self.media($rwdObj);
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
			$rwdObj.data('old-state', $rwdObj.get(0).outerHTML);
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
			var $rwdObj = $(this);
			$rwdObj.data('old-state', $rwdObj.get(0).outerHTML);
			self.vnav($rwdObj);
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
			var $rwdObj = $(this);
			$rwdObj.data('old-state', $rwdObj.get(0).outerHTML);
			self.columns($rwdObj);
		});
	};

	this.columns = function ($rwdObj) {
		var availableWidth = $rwdObj.parent().width();

		if (self.getBreakpoint($rwdObj, availableWidth) > availableWidth || (self.areStackedColumnsCausedByElementQueries($rwdObj.find('> .column')) && !$rwdObj.hasClass('fixed-width'))) {
			$rwdObj.addClass('stacked-columns');
			self.moveContentWithinColumns($rwdObj);
			self.convertToSliderItems($rwdObj);
		}
	};

	this.areStackedColumnsCausedByElementQueries = function ($columns) {
		var areThey = false,
			positionTop = $columns.first().position().top;

		$columns.each(function () {
			if ($(this).position().top > positionTop) {
				areThey = true;
			}
		});
		return areThey;
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
		if ($rwdObj.hasClass('convert-columns-to-slider-items')) {
			$rwdObj.find('> .column').each(function () {
				var $newSliderItem = $(this).children().wrapAll('<div class="item"></div>');
				$newSliderItem.parent().prependTo($(this).closest('.container'));
			});
			$rwdObj.closest('.item').remove();
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

	this.init = function () {
		$('.rwd-object-table').each(function () {
			var $rwdObj = $(this);
			$rwdObj.data('old-state', $rwdObj.get(0).outerHTML);

			if ($rwdObj.width() > $rwdObj.parent().width()) {
				$rwdObj.addClass('oversize');
				if (!$rwdObj.hasClass('simple-scrolling')) {
					$rwdObj.addClass('fixed-thead');
					self.equalCellHeightPerRow($rwdObj);
				}
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


function RwdObjectSliderInstances() {
	'use strict';

	var self = this;

	self.init = function () {
		var $slider,
			startItemIndex = 0;

		$('.rwd-object-slider').each(function () {
			$slider = $(this);
			$slider.data('old-state', $slider.get(0).outerHTML);
			startItemIndex = $slider.attr('data-start-item') || 0;
			RwdObjectSliderInstance = new RwdObjectSlider($slider);
			RwdObjectSliderInstance.init(parseInt(startItemIndex, 10));
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

function RwdObjects() {
	'use strict';

	var self = this;

	self.init = function () {
		new RwdObjectHalign().init();
		new RwdObjectHnav().init();
		new RwdObjectMedia().init();
		new RwdObjectVnav().init();
		new RwdObjectColumns().init();
		new RwdObjectTable().init();
		new RwdObjectSliderInstances().init();

		rwdBoilerplateHideLoading();
	};
}


$(document).ready(function () {
	'use strict';

	new RwdObjects().init();
});
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

function WindowResize() {
	'use strict';

	var self = this;

	self.resizeTimeout = null;
	self.wd = window;
	self.winWidth = window.innerWidth;
	self.winHeight = window.innerHeight;

	self.init = function () {
		$(self.wd).bind('resize', function () {
			var winNewWidth = window.innerWidth,
				winNewHeight = window.innerHeight;

			// Compare the new height and width with old one
			if (self.winWidth !== winNewWidth || self.winHeight !== winNewHeight) {
				window.clearTimeout(self.resizeTimeout);
				self.resizeTimeout = self.wd.setTimeout(self.refreshPage, 100);
			}
			// Update the width and height
			self.winWidth = winNewWidth;
			self.winHeight = winNewHeight;
		});
	};

	self.refreshPage = function () {
		rwdBoilerplateShowLoading();
		self.removeAppliedElementQueries();
		self.restoreRwdObjectsToInitialState();
		self.reinitializeRwdBoilerplate();
	};

	self.removeAppliedElementQueries = function () {
		$('[class*="eq-max-width-"], [class*="eq-min-width-"]').each(function () {
			var $this = $(this),
				prefix = "eq-max-width-",
				classes = $this.attr("class").split(" ").filter(function (c) {
					return c.lastIndexOf(prefix, 0) !== 0;
				});
			$this.attr("class", classes.join(" "));

			prefix = "eq-min-width-";
			classes = $this.attr("class").split(" ").filter(function (c) {
				return c.lastIndexOf(prefix, 0) !== 0;
			});
			$this.attr("class", classes.join(" "));
		});
	};

	self.restoreRwdObjectsToInitialState = function () {
		if (typeof RwdObjectSliderInstance !== 'undefined') {
			RwdObjectSliderInstance.clearAutoPlayInterval();
		}
		$('[class*="rwd-object-"]').each(function () {
			$(this).replaceWith($(this).data('old-state'));
		});
	};

	self.reinitializeRwdBoilerplate = function () {
		new ElementQueries().init();
		new RwdObjects().init();
	};
}

$(document).ready(function () {
	'use strict';

	new WindowResize().init();
});