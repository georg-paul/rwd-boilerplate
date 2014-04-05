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
		var $html = $('html');
		$html.addClass('rwd-boilerplate-loading');
		self.removeAppliedElementQueries();
		self.restoreRwdObjectsToInitialState();
		self.reinitializeRwdBoilerplate();
		$html.removeClass('rwd-boilerplate-loading');
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
		RwdObjectSliderInstance.clearAutoPlayInterval();

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