var webdriver = require('wd');

var browser = webdriver.remote('hub.browserstack.com', 80);

var desired = {
	browserName: 'chrome',
	version: '22.0',
	platform: 'WINDOWS',
	name: 'Element queries test cases',
	'browserstack.user': '',
	'browserstack.key': ''
};

var waitForCounter = 0;

var quitBrowser = function (i, limit) {
	if (limit === i) {
		waitForCounter = 0;
		browser.quit();
	}
};

browser.init(desired, function () {
	browser.get('http://georg-paul.github.io/rwd-boilerplate/', function () {
		browser.waitForElementByCss('.demo-text-1.eq-max-width-2000', 5000, function (err, el) {
			if (err === null) {
				console.log('PASS: max-width');
			} else {
				console.log('FAIL: max-width');
			}
			waitForCounter += 1;
			quitBrowser(waitForCounter, 3);
		});
		browser.waitForElementByCss('.demo-text-2.eq-min-width-600', 5000, function (err, el) {
			if (err === null) {
				console.log('PASS: min-width');
			} else {
				console.log('FAIL: min-width');
			}
			waitForCounter += 1;
			quitBrowser(waitForCounter, 3);
		});
		browser.waitForElementByCss('.demo-text-3.eq-min-width-600.eq-max-width-2000', 5000, function (err, el) {
			if (err === null) {
				console.log('PASS: max-width and min-width');
			} else {
				console.log('FAIL: max-width and min-width');
			}
			waitForCounter += 1;
			quitBrowser(waitForCounter, 3);
		});
	});
});