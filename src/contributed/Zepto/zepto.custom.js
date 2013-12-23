/*global $ */

$.fn.width = function () {
	"use strict";
	return this[0].clientWidth - parseInt(getComputedStyle(this[0]).paddingLeft, 10) - parseInt(getComputedStyle(this[0]).paddingRight, 10);
};

$.fn.outerWidth = function () {
	"use strict";
	return this[0].offsetWidth + parseInt(getComputedStyle(this[0]).marginLeft, 10) + parseInt(getComputedStyle(this[0]).marginRight, 10);
};