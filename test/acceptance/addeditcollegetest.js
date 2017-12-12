var chai = require('chai');
var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');
var expect = chai.expect;
var until = webdriver.until;

var driver;
var mochaTimeOut = 30000;

var pageSelector ;

test.describe('Add Edit College Pages', function() {
	this.timeout(mochaTimeOut);
	test.before( function() {
		driver = new webdriver.Builder()
			.withCapabilities( webdriver.Capabilities.chrome() )
			.build();
		pageSelector = webdriver.By.id('main');
		driver.get('http://localhost:3000/#!/addcollege');
		driver.wait(until.elementLocated(pageSelector), 2000);
	} );
	test.it('shows the main body', function() {
		driver.findElement(pageSelector)
			.then(function(element) {
				expect(element).to.not.equal(null );
			});
	});
	test.it('shows the form', function() {
		driver.findElement(webdriver.By.className('form'))
			.then(function(element) {
				expect(element).to.not.equal(null );
			});
	});
	test.it('shows the tab-group and check elements inside', function() {
		var tabgroup = driver.findElement(webdriver.By.className('tab-group'));
		tabgroup.then(function(element) {
			expect(element).to.not.equal(null );
		});
		tabgroup.findElements(webdriver.By.tagName('li'))
			.then(function(elements) {
				expect(elements).to.not.equal(null );
				elements[0].getText()
					.then(function(text) {
						expect(text).to.equal('Add College');
					} )  ;
				elements[1].getText()
					.then(function(text) {
						expect(text).to.equal('Edit/Delete College');
					} )  ;
			});
	});
	test.it('shows add college input boxes and submit button', function() {
		var form = driver.findElement(webdriver.By.tagName('form'));
		form.findElements(webdriver.By.tagName('label'))
			.then(function(elements) {
				expect(elements).to.not.equal(null );
				elements[0].getText()
					.then(function(text) {
						expect(text).to.equal('College Name*');
					} )  ;
				elements[1].getText()
					.then(function(text) {
						expect(text).to.equal('Contact Number*');
					} )  ;
				elements[2].getText()
					.then(function(text) {
						expect(text).to.equal('Email Address*');
					} )  ;
				elements[3].getText()
					.then(function(text) {
						expect(text).to.equal('Address*');
					} )  ;
			});
		form.findElements(webdriver.By.tagName('input'))
			.then(function(elements) {
				expect(elements).to.not.equal(null );
				expect(elements).to.have.length(4);
			});
		form.findElement(webdriver.By.tagName('button'))
			.then(function(element) {
				element.getText()
					.then(function(text) {
						expect(text).to.equal('SUBMIT');
					} )  ;
			});
	});
	test.it('shows the header', function() {
		var tabgroup = driver.findElement(webdriver.By.className('tab-group'));
		driver.findElement(webdriver.By.tagName('h2'))
			.then(function(element) {
				element.getAttribute("textContent")
					.then(function(text) {
						expect(text).to.equal('Add College');
					} )
			});
		tabgroup.findElements(webdriver.By.tagName('li'))
			.then(function(elements) {
				elements[1].findElement(webdriver.By.tagName('a')).then(function (element) {
					element.click();
				})
			});
		driver.findElement(webdriver.By.tagName('h2'))
			.then(function(element) {
				element.getAttribute("textContent")
					.then(function(text) {
						expect(text).to.equal('Edit/Delete College');
					} )
			});
	});
	test.after(function() {
		driver.quit();
	});
});