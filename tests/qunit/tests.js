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
		equal(fixture.getTargetSelector('.rwd-object-hnav.breakpoint-small>ul.append-to-flyout-1-slot-3-component-foo'), '.rwd-object-hnav.breakpoint-small>ul');
		equal(fixture.getTargetSelector('.demo-hero h1.clone-to-flyout-1-slot-1-component-foo'), '.demo-hero h1');
		equal(fixture.getTargetSelector('.demo-header .append-to-flyout-1-slot-2-component-foo.right'), '.demo-header .right');

		equal(fixture.getTargetSelector('.eq-rwd-table-container.eq-max-width-400 .foo.append-to-flyout-1-slot-1-component-foo'), '.eq-rwd-table-container.eq-max-width-400 .foo');
		equal(fixture.getTargetSelector('DIV.csc-textpic.eq-max-width-6401123 .foo.bar.append-to-flyout-1-slot-1-component-foo'), 'DIV.csc-textpic.eq-max-width-6401123 .foo.bar');
		equal(fixture.getTargetSelector('.l-facts header.eq-max-width-220 + ul.append-to-flyout-1-slot-1-component-foo'), '.l-facts header.eq-max-width-220 + ul');
		equal(fixture.getTargetSelector('.news-list .eq-object-column.eq-max-width-410:nth-child(1) + .eq-object-column.append-to-flyout-1-slot-1-component-foo'), '.news-list .eq-object-column.eq-max-width-410:nth-child(1) + .eq-object-column');
		equal(fixture.getTargetSelector('.eq-max-width-480#extended-header .eq-delimiter .facts.append-to-flyout-1-slot-1-component-foo'), '.eq-max-width-480#extended-header .eq-delimiter .facts');
		equal(fixture.getTargetSelector('.l-element-queries .demo-text.eq-max-width-400.eq-min-width-100 p.append-to-flyout-1-slot-1-component-foo'), '.l-element-queries .demo-text.eq-max-width-400.eq-min-width-100 p');

		equal(fixture.getTargetSelector('.eq-rwd-table-container.eq-max-width-400 .foo.clone-to-flyout-1-slot-1-component-foo'), '.eq-rwd-table-container.eq-max-width-400 .foo');
		equal(fixture.getTargetSelector('DIV.csc-textpic.eq-max-width-6401123 .foo.bar.clone-to-flyout-1-slot-1-component-foo'), 'DIV.csc-textpic.eq-max-width-6401123 .foo.bar');
		equal(fixture.getTargetSelector('.l-facts header.eq-max-width-220 + ul.clone-to-flyout-1-slot-1-component-foo'), '.l-facts header.eq-max-width-220 + ul');
		equal(fixture.getTargetSelector('.news-list .eq-object-column.eq-max-width-410:nth-child(1) + .eq-object-column.clone-to-flyout-1-slot-1-component-foo'), '.news-list .eq-object-column.eq-max-width-410:nth-child(1) + .eq-object-column');
		equal(fixture.getTargetSelector('.eq-max-width-480#extended-header .eq-delimiter .facts.clone-to-flyout-1-slot-1-component-foo'), '.eq-max-width-480#extended-header .eq-delimiter .facts');
		equal(fixture.getTargetSelector('.l-element-queries .demo-text.eq-max-width-400.eq-min-width-100 p.clone-to-flyout-1-slot-1-component-foo'), '.l-element-queries .demo-text.eq-max-width-400.eq-min-width-100 p');
	});


	module("misc");

	test("loading animation has disappeared as expected", function () {
		equal($('html.rwd-boilerplate-loading').length, 0);
	});



	QUnit.done(function (results) {
		window.global_test_results = results;
	});

}(window));