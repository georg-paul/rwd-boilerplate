/*jslint browser: true */
/*global $ */

var RwdObjectsInstance;

function InitRwdObjects() {
	'use strict';

	var RwdObjectsInstance,
		RwdObjectHalignInstance,
		RwdObjectHnavInstance,
		RwdObjectMediaInstance,
		RwdObjectVnavInstance,
		RwdObjectColumnsInstance;

	RwdObjectHalignInstance = new RwdObjectHalign();
	RwdObjectHalignInstance.init();

	RwdObjectHnavInstance = new RwdObjectHnav();
	RwdObjectHnavInstance.init();

	RwdObjectMediaInstance = new RwdObjectMedia();
	RwdObjectMediaInstance.init();

	RwdObjectVnavInstance = new RwdObjectVnav();
	RwdObjectVnavInstance.init();

	RwdObjectColumnsInstance = new RwdObjectColumns();
	RwdObjectColumnsInstance.init();
}

$(document).ready(function () {
	'use strict';

	RwdObjectsInstance = new InitRwdObjects();
});