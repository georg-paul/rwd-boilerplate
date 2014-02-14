/*jslint browser: true, nomen: false, devel: true*/
/*global $ */

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
		if(typeof s[v[i] + p] == 'string') { return true; }
	}
	return false;
}
