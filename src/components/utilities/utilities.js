/*jslint browser: true, nomen: false, devel: true*/
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