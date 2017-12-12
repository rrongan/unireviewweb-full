var chai = require('chai');
var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');
var expect = chai.expect;
var until = webdriver.until;

var driver;
var mochaTimeOut = 30000;

var pageSelector ;

test.describe('College Main page', function() {
	this.timeout(mochaTimeOut);
	test.before( function() {
		driver = new webdriver.Builder()
			.withCapabilities( webdriver.Capabilities.chrome() )
			.build();
		pageSelector = webdriver.By.id('collegebanner');
		driver.get('http://localhost:3000/#!/college/undefined');
		driver.wait(until.elementLocated(pageSelector), 2000);
	} );
	test.it('shows the main body', function() {
		driver.findElement(pageSelector)
			.then(function(element) {
				expect(element).to.not.equal(null );
			});
	});
	test.it( 'shows the rating', function() {
		driver.findElement(webdriver.By.className('my-custom-stars'))
			.then(function(element) {
				expect(element).to.not.equal(null );
			});
	} );
	test.it('shows the college tab-group and check elements inside', function() {
		var tabgroup = driver.findElement(webdriver.By.className('tab-group-college'));
		tabgroup.then(function(element) {
			expect(element).to.not.equal(null );
		});
		tabgroup.findElements(webdriver.By.tagName('li'))
			.then(function(elements) {
				expect(elements).to.not.equal(null );
				elements[0].getText()
					.then(function(text) {
						expect(text).to.equal('Overview');
					} )  ;
				elements[1].getText()
					.then(function(text) {
						expect(text).to.equal('Review');
					} )  ;
			});
	});
	test.after(function() {
		driver.quit();
	});
});