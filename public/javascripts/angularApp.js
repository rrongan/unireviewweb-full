/* Authentication https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec*/
var app = angular.module('UniReviewWeb', ['ui.router','ui.bootstrap','ngMaterial','ngMessages', 'jkAngularRatingStars', 'jtt_wikipedia', 'angularMoment'])
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

app.config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES', '$sceDelegateProvider',function($stateProvider, $urlRouterProvider, USER_ROLES, $sceDelegateProvider) {
	$urlRouterProvider.otherwise("/");

	$stateProvider
		.state('home', {
			url:'/',
			templateUrl : '../pages/main.ejs',
			controller  : 'mainController',
			data: {
				authorizedRoles: [USER_ROLES.all]
			}
		})
		.state('searchresult', {
			url:'/college/search/:param',
			templateUrl : '../pages/searchresult.ejs',
			controller  : 'searchResultController',
			data: {
				authorizedRoles: [USER_ROLES.admin]
			}
		})
		.state('signin', {
			url:'/signin',
			templateUrl : '../pages/signin.ejs',
			controller  : 'signInController',
			data: {
				authorizedRoles: [USER_ROLES.all]
			}
		})
		.state('signup', {
			url:'/signup',
			templateUrl : '../pages/signup.ejs',
			controller  : 'signUpController',
			data: {
				authorizedRoles: [USER_ROLES.all]
			}
		})
		.state('collegemain', {
			url:'/college?collegeid&image',
			templateUrl : '../pages/collegemain.ejs',
			controller  : 'collegeMainController',
			data: {
				authorizedRoles: [USER_ROLES.all]
			}
		})
		.state('allcolleges', {
		url:'/colleges',
		templateUrl : '../pages/allcolleges.ejs',
		controller  : 'allCollegesController',
		data: {
			authorizedRoles: [USER_ROLES.all]
		}
	})
	.state('addcollege', {
		url:'/addcollege',
		templateUrl : '../pages/addcollege.ejs',
		controller  : 'addCollegeController',
		data: {
			authorizedRoles: [USER_ROLES.all]
		}
	})
	.state('editcollege', {
		url:'/editcollege',
		templateUrl : '../pages/editcollege.ejs',
		controller  : 'editCollegeController',
		data: {
			authorizedRoles: [USER_ROLES.all]
		}
	})
	.state('studentprofile', {
		url:'/studentprofile',
		templateUrl : '../pages/studentprofile.ejs',
		controller  : 'studentProfileController',
		data: {
			authorizedRoles: [USER_ROLES.all]
		}
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
