/*jslint browser: true, nomen: false, devel: true*/
/*global $, QUnit, module, test, equal, strictEqual, ok */

(function (win) {
	"use strict";


	module("rwd-object-halign");

	test("getTotalChildrenWidth returns correct px value", function () {
		var $halignTestObject = $('#halign-test-1'),
			HalignTestInstance = new RwdObjectHalign();

		equal(HalignTestInstance.getTotalChildrenWidth($halignTestObject), 1100);
	});

	test("no-side-by-side classes are applied correct", function () {
		var $halignTestObject = $('#halign-test-1'),
			HalignTestInstance = new RwdObjectHalign();

		HalignTestInstance.init();
		ok($halignTestObject.hasClass('no-side-by-side'), true);
		ok($('[data-halign-container-id="' + parseInt($halignTestObject.attr('data-halign-id'), 10) + '"]').hasClass('children-no-side-by-side'), true);
	});


	module("rwd-object-columns");

	test("getBreakpoint returns correct value for fixed width columns", function () {
		var ColumnsTestInstance = new RwdObjectColumns();

		strictEqual(ColumnsTestInstance.getBreakpoint($('<div class="rwd-object-columns-2 fixed-width"></div>'), 999), 0);
	});

	test("columns are stacked after reaching a breakpoint", function () {
		var $columsTestObject = $('#columns-test-1'),
			ColumnsTestInstance = new RwdObjectColumns();

		ColumnsTestInstance.init();
		ok($columsTestObject.hasClass('stacked-columns'), true);
	});


	module("misc");

	test("loading animation has disappeared as expected", function () {
		equal($('.rwd-boilerplate-loading').length, 0);
	});



	QUnit.done(function (results) {
		window.global_test_results = results;
	});

}(window));