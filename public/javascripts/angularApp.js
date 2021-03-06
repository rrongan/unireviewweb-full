/* Authentication https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec*/
require('../stylesheets/style.css');
require('angular');
require('angular-route');
require('angular-aria');
require('angular-animate');
require('angular-material');
require('angular-messages');
require('angular-ui-bootstrap');
require('moment');
require('angular-moment');
require('jquery');
require('skel-framework-npm');
require('./plugin/rating.js');
require('./plugin/wikipedia.js');
require('./jquery/jquery.dropotron.min.js');
require('./jquery/jquery.scrolly.min.js');
require('./jquery/jquery.scrollgress.min.js');
require('./jquery/util.js');
require('./jquery/main.js');

var app = angular.module('UniReviewWeb', ['ui.router','ngRoute','ui.bootstrap','ngMaterial','ngMessages', 'jkAngularRatingStars', 'jtt_wikipedia', 'angularMoment'])
	.constant('USER_ROLES', {
		all : '*',
		admin : 'admin',
		student : 'student',
		guest : 'guest',
	}).constant('AUTH_EVENTS', {
		loginSuccess : 'auth-login-success',
		loginFailed : 'auth-login-failed',
		logoutSuccess : 'auth-logout-success',
		sessionTimeout : 'auth-session-timeout',
		notAuthenticated : 'auth-not-authenticated',
		notAuthorized : 'auth-not-authorized'
	});

require('./controllers/index');
require('./plugin/auth.js');
require('./plugin/googleImage.js');

app.config(['$routeProvider', 'USER_ROLES', '$sceDelegateProvider',function($routeProvider, USER_ROLES, $sceDelegateProvider) {

	// $stateProvider
	// 	.state('home', {
	// 		url:'/',
	// 		templateUrl : 'public/pages/main.ejs',
	// 		controller  : 'mainController',
	// 		data: {
	// 			authorizedRoles: [USER_ROLES.all]
	// 		}
	// 	})
	// 	.state('searchresult', {
	// 		url:'/college/search/:param',
	// 		templateUrl : 'public/pages/searchresult.ejs',
	// 		controller  : 'searchResultController',
	// 		data: {
	// 			authorizedRoles: [USER_ROLES.admin]
	// 		}
	// 	})
	// 	.state('signin', {
	// 		url:'/signin',
	// 		templateUrl : 'public/pages/signin.ejs',
	// 		controller  : 'signInController',
	// 		data: {
	// 			authorizedRoles: [USER_ROLES.all]
	// 		}
	// 	})
	// 	.state('signup', {
	// 		url:'/signup',
	// 		templateUrl : 'public/pages/signup.ejs',
	// 		controller  : 'signUpController',
	// 		data: {
	// 			authorizedRoles: [USER_ROLES.all]
	// 		}
	// 	})
	// 	.state('collegemain', {
	// 		url:'/college?collegeid&image',
	// 		templateUrl : 'public/pages/collegemain.ejs',
	// 		controller  : 'collegeMainController',
	// 		data: {
	// 			authorizedRoles: [USER_ROLES.all]
	// 		}
	// 	})
	// 	.state('allcolleges', {
	// 		url:'/colleges',
	// 		templateUrl : 'public/pages/allcolleges.ejs',
	// 		controller  : 'allCollegesController',
	// 		data: {
	// 			authorizedRoles: [USER_ROLES.all]
	// 		}
	// 	})
	// 	.state('addcollege', {
	// 		url:'/addcollege',
	// 		templateUrl : 'public/pages/addcollege.ejs',
	// 		controller  : 'addCollegeController',
	// 		data: {
	// 			authorizedRoles: [USER_ROLES.all]
	// 		}
	// 	})
	// 	.state('editcollege', {
	// 		url:'/editcollege',
	// 		templateUrl : 'public/pages/editcollege.ejs',
	// 		controller  : 'editCollegeController',
	// 		data: {
	// 			authorizedRoles: [USER_ROLES.all]
	// 		}
	// 	})
	// 	.state('studentprofile', {
	// 		url:'/studentprofile',
	// 		templateUrl : 'public/pages/studentprofile.ejs',
	// 		controller  : 'studentProfileController',
	// 		data: {
	// 			authorizedRoles: [USER_ROLES.all]
	// 		}
	// 	});

	$routeProvider
		.when('/', {
			templateUrl : 'public/pages/main.ejs',
			controller  : 'mainController',
		})
		.when('/college/search/:param', {
			templateUrl : 'public/pages/searchresult.ejs',
			controller  : 'searchResultController'
		})
		.when('/signin', {
			templateUrl : 'public/pages/signin.ejs',
			controller  : 'signInController'
		})
		.when('/signup', {
			templateUrl : 'public/pages/signup.ejs',
			controller  : 'signUpController'
		})
		.when('/college/:param', {
			templateUrl : 'public/pages/collegemain.ejs',
			controller  : 'collegeMainController'
		})
		.when('/colleges', {
			templateUrl : 'public/pages/allcolleges.ejs',
			controller  : 'allCollegesController'
		})
		.when('/addcollege', {
			templateUrl : 'public/pages/addcollege.ejs',
			controller  : 'addCollegeController'
		})
		.when('/editcollege', {
			templateUrl : 'public/pages/editcollege.ejs',
			controller  : 'editCollegeController'
		})
		.when('/studentprofile', {
			templateUrl : 'public/pages/studentprofile.ejs',
			controller  : 'studentProfileController'
		});

	$sceDelegateProvider.resourceUrlWhitelist([
		'self',
		'https://en.wikipedia.org/**'
	]);
}]);

/* Adding the auth interceptor here, to check every $http request*/
app.config(function ($httpProvider) {
	$httpProvider.interceptors.push([
		'$injector',
		function ($injector) {
			return $injector.get('AuthInterceptor');
		}
	]);
});
