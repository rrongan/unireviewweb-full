var chai = require('chai');
var test = require('selenium-webdriver/testing');
var webdriver = require('selenium-webdriver');
var expect = chai.expect;
var until = webdriver.until;

var driver;
var mochaTimeOut = 30000;

var pageSelector ;

test.describe('Sign In Sign Up Pages', function() {
	this.timeout(mochaTimeOut);
	test.before( function() {
		driver = new webdriver.Builder()
			.withCapabilities( webdriver.Capabilities.chrome() )
			.build();
		pageSelector = webdriver.By.id('main');
		driver.get('http://localhost:3000/#!/signup');
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
						expect(text).to.equal('Sign Up');
					} )  ;
				elements[1].getText()
					.then(function(text) {
						expect(text).to.equal('Log In');
					} )  ;
			});
	});
	test.it('shows sign up input boxes and submit button', function() {
		var form = driver.findElement(webdriver.By.tagName('form'));
		form.findElements(webdriver.By.tagName('label'))
			.then(function(elements) {
				expect(elements).to.not.equal(null );
				elements[0].getText()
					.then(function(text) {
						expect(text).to.equal('First Name*');
					} )  ;
				elements[1].getText()
					.then(function(text) {
						expect(text).to.equal('Last Name*');
					} )  ;
				elements[2].getText()
					.then(function(text) {
						expect(text).to.equal('Email Address*');
					} )  ;
				elements[3].getText()
					.then(function(text) {
						expect(text).to.equal('Username*');
					} )  ;
				elements[4].getText()
					.then(function(text) {
						expect(text).to.equal('Set A Password*');
					} )  ;
				elements[5].getText()
					.then(function(text) {
						expect(text).to.equal('Confirm Password*');
					} )  ;
			});
		form.findElements(webdriver.By.tagName('input'))
			.then(function(elements) {
				expect(elements).to.not.equal(null );
				expect(elements).to.have.length(6);
			});
		form.findElement(webdriver.By.tagName('button'))
			.then(function(element) {
				element.getText()
					.then(function(text) {
						expect(text).to.equal('GET STARTED');
					} )  ;
			});
	});
	test.it('shows the header', function() {
		var tabgroup = driver.findElement(webdriver.By.className('tab-group'));
		driver.findElement(webdriver.By.tagName('h2'))
			.then(function(element) {
				element.getAttribute("textContent")
					.then(function(text) {
						expect(text).to.equal('Sign Up for Free');
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
						expect(text).to.equal('Welcome Back!');
					} )
			});
	});
	test.it('shows sign in input boxes and submit button', function() {
		var form = driver.findElement(webdriver.By.tagName('form'));
		form.findElements(webdriver.By.tagName('label'))
			.then(function(elements) {
				expect(elements).to.not.equal(null );
				elements[0].getText()
					.then(function(text) {
						expect(text).to.equal('Username*');
					} )  ;
				elements[1].getText()
					.then(function(text) {
						expect(text).to.equal('Password*');
					} )  ;
			});
		form.findElements(webdriver.By.tagName('input'))
			.then(function(elements) {
				expect(elements).to.not.equal(null );
				expect(elements).to.have.length(2);
			});

		form.findElement(webdriver.By.tagName('button'))
			.then(function(element) {
				element.getText()
					.then(function(text) {
						expect(text).to.equal('LOG IN');
					} )  ;
			});
	});
	test.after(function() {
		driver.quit();
	});
});