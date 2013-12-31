/*global $ */

$.fn.width = function () {
	"use strict";
	return this[0].clientWidth - parseInt(getComputedStyle(this[0]).paddingLeft, 10) - parseInt(getComputedStyle(this[0]).paddingRight, 10);
};

$.fn.outerWidth = function () {
	"use strict";
	return this[0].offsetWidth + parseInt(getComputedStyle(this[0]).marginLeft, 10) + parseInt(getComputedStyle(this[0]).marginRight, 10);
};

$.fn.height = function () {
	"use strict";
	return this[0].clientHeight - parseInt(getComputedStyle(this[0]).paddingTop, 10) - parseInt(getComputedStyle(this[0]).paddingBottom, 10);
};

$.fn.outerHeight = function () {
	"use strict";
	return this[0].offsetHeight + parseInt(getComputedStyle(this[0]).marginTop, 10) + parseInt(getComputedStyle(this[0]).marginBottom, 10);
};