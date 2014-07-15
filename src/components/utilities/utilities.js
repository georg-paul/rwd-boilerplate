/*jslint browser: true, nomen: false, devel: true*/
/*global $ */

function waitForImagesToLoad($element, callback) {
	'use strict';
	var $images = $element.find('img'),
		$image,
		loaded,
		error404;

	// IE 9/10 prevents the onload event from firing for cached images
	// Work around this nasty behaviour
	// http://garage.socialisten.at/2013/06/how-to-fix-the-ie9-image-onload-bug/
	// http://css-tricks.com/snippets/jquery/fixing-load-in-ie-for-cached-images/
	// If this solution turns out to have drawbacks for the implemented use cases
	// I will switch to https://github.com/desandro/imagesloaded
	$images.each(function () {
		$image = $(this);
		$image.attr('src', $image.attr('src'));
	});

	// Find the images within $element it that aren't loaded yet
	$images = $element.find('img').filter(function (index, img) {
		return !this.complete;
	});

	// Find any?
	if ($images.length === 0) {
		callback();
	} else {
		loaded = 0;
		error404 = 0;

		$images.on('load', function () {
			loaded += 1;
			if (loaded + error404 === $images.length) {
				callback();
			}
		});
		$images.on('error', function () {
			error404 += 1;
			if (loaded + error404 === $images.length) {
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