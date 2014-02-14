/*jslint browser: true */
/*global $ */

$(window).load(function () {
	'use strict';

	new RwdObjectHalign().init();
	new RwdObjectHnav().init();
	new RwdObjectMedia().init();
	new RwdObjectVnav().init();
	new RwdObjectColumns().init();
});