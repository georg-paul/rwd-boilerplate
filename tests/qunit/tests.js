/*global $ */

// rwd-object-halign
test("getTotalChildrenWidth returns correct px value", function () {
	var $halignTestObject = $('#halign-test-1');

	var HalignTestInstance = new RwdObjectHalign();
	equal(HalignTestInstance.getTotalChildrenWidth($halignTestObject), 1100);
});

test("no-side-by-side classes are applied correct", function () {
	var $halignTestObject = $('#halign-test-1');

	var HalignTestInstance = new RwdObjectHalign();
	HalignTestInstance.init();

	ok($halignTestObject.hasClass('no-side-by-side'), true);
	ok($('[data-halign-container-id="' + parseInt($halignTestObject.attr('data-halign-id'), 10) + '"]').hasClass('children-no-side-by-side'), true);
});