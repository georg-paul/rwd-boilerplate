/*global $, QUnit */

test("halign: getTotalChildrenWidth returns correct px value", function () {
	var $halignTestObject = $('#halign-test-1');

	var HalignTestInstance = new RwdObjectHalign();
	equal(HalignTestInstance.getTotalChildrenWidth($halignTestObject), 1100);
});

test("halign: no-side-by-side classes are applied correct", function () {
	var $halignTestObject = $('#halign-test-1');

	var HalignTestInstance = new RwdObjectHalign();
	HalignTestInstance.init();

	ok($halignTestObject.hasClass('no-side-by-side'), true);
	ok($('[data-halign-container-id="' + parseInt($halignTestObject.attr('data-halign-id'), 10) + '"]').hasClass('children-no-side-by-side'), true);
});

test("columns: getBreakpoint returns correct value for fixed width columns", function () {
	var t = new RwdObjectColumns();

	strictEqual(t.getBreakpoint($('<div class="rwd-object-columns-2 fixed-width"></div>'), 999), 0);
});

test("columns: columns are stacked after reaching a breakpoint", function () {
	var $columsTestObject = $('#columns-test-1');

	var ColumnsTestInstance = new RwdObjectColumns();
	ColumnsTestInstance.init();

	ok($columsTestObject.hasClass('stacked-columns'), true);
});

test("Misc: loading animation has disappeared as expected", function () {
	equal($('.rwd-boilerplate-loading').length, 0);
});

QUnit.done(function (results) {
	window.global_test_results = results;
});