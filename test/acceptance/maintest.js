var chai = require('chai');
var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');
var expect = chai.expect;
var until = webdriver.until;

var driver;
var mochaTimeOut = 30000;

var pageSelector ;

test.describe('Home page', function() {
	this.timeout(mochaTimeOut);
	test.before( function() {
		driver = new webdriver.Builder()
			.withCapabilities( webdriver.Capabilities.chrome() )
			.build();
		pageSelector = webdriver.By.id('banner');
		driver.get('http://localhost:3000');
		driver.wait(until.elementLocated(pageSelector), 2000);
	} );
	test.it('shows the main body', function() {
		driver.findElement(pageSelector)
			.then(function(element) {
				expect(element).to.not.equal(null );
			});
	});
	test.it( 'shows the nav bar', function() {
		var navBarSelector = webdriver.By.tagName('nav');
		driver.findElement(navBarSelector)
			.then(function(element) {
				expect(element).to.not.equal(null );
			});
	} );
	test.it( 'shows the buttons', function() {
		driver.findElements(webdriver.By.className('button'))
			.then(function(elements) {
				expect(elements).to.not.equal(null );
				elements[0].getText()
					.then(function(text) {
						expect(text).to.equal('SIGN IN');
					} )  ;
				elements[1].getText()
					.then(function(text) {
						expect(text).to.equal('SIGN UP');
					} )  ;
			});
	} );
	test.it( 'shows the inner', function() {
		var innerSelector = webdriver.By.className('inner');
		driver.findElement(innerSelector)
			.then(function(element) {
				expect(element).to.not.equal(null );
			});
	} );
	test.it( 'shows the elements in inner', function() {
		var inner = driver.findElement(webdriver.By.className('inner'));
		var header = inner.findElement(webdriver.By.tagName('header'));
		var footer = inner.findElement(webdriver.By.tagName('footer'));
		var div = inner.findElement(webdriver.By.tagName('div'));
		var ul = footer.findElement(webdriver.By.tagName('ul'));
		var li = ul.findElement(webdriver.By.tagName('li'));
		header.findElement(webdriver.By.tagName('h2'))
			.then(function(element) {
				element.getAttribute('textContent')
					.then(function(text) {
						expect(text).to.equal('Academ Review');
					} )  ;
			});
		inner.findElement(webdriver.By.tagName('h3'))
			.then(function(element) {
				element.getAttribute('textContent')
					.then(function(text) {
						expect(text).to.equal('Find a college for you');
					} )  ;
			});
		div.findElement(webdriver.By.tagName('input')).then(function(element) {
			expect(element).to.not.equal(null );
		});
		li.findElement(webdriver.By.tagName('button')).then(function(element) {
			element.getAttribute('textContent')
				.then(function(text) {
					expect(text).to.equal('Search');
				} );
		});
	} );
	test.it( 'search college', function() {
		var inner = driver.findElement(webdriver.By.className('inner'));
		var div = inner.findElement(webdriver.By.tagName('div'));
		var footer = inner.findElement(webdriver.By.tagName('footer'));
		var ul = footer.findElement(webdriver.By.tagName('ul'));
		var li = ul.findElement(webdriver.By.tagName('li'));
		div.findElement(webdriver.By.tagName('input')).then(function(element) {
			element.sendKeys('W');
		});
		li.findElement(webdriver.By.tagName('button')).then(function(element) {
			element.click();
		}).then(function() {
			driver.wait(until.elementLocated(webdriver.By.className('content')), 20000);
			driver.findElements(webdriver.By.tagName('table'))
				.then(function(element) {
					expect(element).to.not.equal(null );
				});
		});
	} );
	test.it( 'shows the footer', function() {
		var footerSelector = webdriver.By.tagName('footer');
		driver.findElement(footerSelector)
			.then(function(element) {
				expect(element).to.not.equal(null );
			});
	} );
	test.after(function() {
		driver.quit();
	});
});