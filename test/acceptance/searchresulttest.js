var chai = require('chai');
var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');
var expect = chai.expect;
var until = webdriver.until;

var driver;
var mochaTimeOut = 30000;

var pageSelector ;

test.describe('Search Page', function() {
	this.timeout(mochaTimeOut);
	test.before( function() {
		driver = new webdriver.Builder()
			.withCapabilities( webdriver.Capabilities.chrome() )
			.build();
		pageSelector = webdriver.By.id('main');
		driver.get('http://localhost:3000/#!/college/search/w');
		driver.wait(until.elementLocated(pageSelector), 2000);
	} );
	test.it('shows the main body', function() {
		driver.findElement(pageSelector)
			.then(function(element) {
				expect(element).to.not.equal(null );
			});
	});
	test.it('shows the header', function() {
		driver.findElement(webdriver.By.tagName('h2'))
			.then(function(element) {
				expect(element).to.not.equal(null );
			});
	});
	test.after(function() {
		driver.quit();
	});
});