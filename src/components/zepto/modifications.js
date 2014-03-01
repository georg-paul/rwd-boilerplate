/*global $ */

$.fn.width = function () {
	"use strict";
	return this[0].clientWidth - parseInt(getComputedStyle(this[0]).paddingLeft, 10) - parseInt(getComputedStyle(this[0]).paddingRight, 10);
};

$.fn.outerWidth = function (includingMargins) {
	"use strict";
	var margins = parseInt(getComputedStyle(this[0]).marginLeft, 10) + parseInt(getComputedStyle(this[0]).marginRight, 10),
		offsetW = this[0].offsetWidth;

	return (includingMargins) ? (offsetW + margins) : offsetW;
};

$.fn.height = function () {
	"use strict";
	return this[0].clientHeight - parseInt(getComputedStyle(this[0]).paddingTop, 10) - parseInt(getComputedStyle(this[0]).paddingBottom, 10);
};

$.fn.outerHeight = function (includingMargins) {
	"use strict";
	var margins = parseInt(getComputedStyle(this[0]).marginTop, 10) + parseInt(getComputedStyle(this[0]).marginBottom, 10),
		offsetH = this[0].offsetHeight;

	return (includingMargins) ? (offsetH + margins) : offsetH;
};