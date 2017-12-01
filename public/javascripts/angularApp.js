/* Authentication https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec*/
var app = angular.module('UniReviewWeb', ['ui.router','ui.bootstrap'])
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

app.config(['$stateProvider', '$urlRouterProvider', 'USER_ROLES',function($stateProvider, $urlRouterProvider, USER_ROLES) {
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
