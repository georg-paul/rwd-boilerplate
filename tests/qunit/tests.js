/*jslint browser: true, nomen: false, devel: true*/
/*global $, QUnit, module, test, equal, strictEqual, ok */

(function (win) {
	"use strict";

	module("rwd-object-halign");

	test("getTotalChildrenWidth returns correct px value", function () {
		var HalignTestInstance = new RwdObjectHalign();

		equal(HalignTestInstance.getTotalChildrenWidth($('#halign-test-1')), 1184);
		equal(HalignTestInstance.getTotalChildrenWidth($('#halign-test-2')), 1140);
		equal(HalignTestInstance.getTotalChildrenWidth($('#halign-test-3')), 700);
	});

	test("no-side-by-side and side-by-side classes are applied correct", function () {
		ok($('#halign-test-1').hasClass('no-side-by-side'), true);
		ok($('[data-halign-container-id="' + parseInt($('#halign-test-1').attr('data-halign-id'), 10) + '"]').hasClass('children-no-side-by-side'), true);

		ok(!$('#halign-test-3').hasClass('no-side-by-side'), true);
		ok($('#halign-test-3').hasClass('side-by-side'), true);

		ok($('#halign-test-4').hasClass('no-side-by-side'), true);
		ok(!$('#halign-test-4').hasClass('side-by-side'), true);
	});



	module("rwd-object-columns");

	test("getBreakpoint returns correct value for fixed width columns", function () {
		var ColumnsTestInstance = new RwdObjectColumns();

		strictEqual(ColumnsTestInstance.getBreakpoint($('<div class="rwd-object-columns-2 fixed-width"></div>'), 999), 0);
	});

	test("columns are stacked after reaching a breakpoint", function () {
		ok($('#columns-test-1').hasClass('stacked-columns'), true);
	});

	test("columns are stacked when css mixin stacked-columns was used", function () {
		ok($('#columns-test-2').hasClass('stacked-columns'), true);
	});


	module("rwd-object-slider");

	test("isCarouselAnimated returns false if no animation is currently running", function () {
		ok(new RwdObjectSlider().isCarouselAnimated($('<div class="container"></div>')) === false);
	});

	test("isCarouselAnimated returns true if slider is animated currently", function () {
		ok(new RwdObjectSlider().isCarouselAnimated($('<div class="container is-animated"></div>')));
	});


	module("rwd-object-table");

	test("oversize class is applied when table width exceeds available space", function () {
		ok($('#table-test-1').hasClass('oversize'), true);
		ok(!$('#table-test-2').hasClass('oversize'), true);
	});

	module("rwd-object-flyout");

	test('getTargetSelector returns the correct target', function () {
		var fixture = new TraverseFlyoutComponents();
		equal(fixture.getTargetSelector('.demo-header .append-to-flyout-1-slot-2-component-secondary-nav.right'), '.demo-header .right');
	});


	module("misc");

	test("loading animation has disappeared as expected", function () {
		equal($('html.rwd-boilerplate-loading').length, 0);
	});



	QUnit.done(function (results) {
		window.global_test_results = results;
	});

}(window));