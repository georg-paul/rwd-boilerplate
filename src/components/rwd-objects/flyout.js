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


function TraverseFlyoutComponents() {
	"use strict";

	var self = this,
		selectorRegExp = new RegExp(/\.(append-to-flyout|clone-to-flyout)\-(\d*)\-(slot)\-(\d*)\-(component)\-(.+)/g);

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
		var flyoutID = values.flyoutID,
			targetSlot = values.targetSlot,
			componentClass = values.componentClass,
			elementsLength = elements.length;

		if (elementsLength === 0) {
			return;
		}

		for (var i = 0; i < elementsLength; i++) {
			var $component = $('<div class="component component-' + componentClass + '"></div>'),
				$target = (selectorText.indexOf('append-to-flyout-') !== -1) ? $(elements[i]) : $(elements[i]).clone();

			self.insertAtIndex($('[data-flyout-id="' + flyoutID + '"] .flyout-components'), $component.append($target), targetSlot);
		}
	};

	this.insertAtIndex = function($target, $element, index) {
		var lastIndex = $target.children().size();

		$element.appendTo($target);
		// TODO: insert at correct index
	};
}



function RwdObjectFlyout() {
	'use strict';

	var self = this;

	this.init = function () {
		$('.rwd-object-flyout').each(function () {
			self.bindEvents($(this));
		});
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