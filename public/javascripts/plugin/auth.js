var app = angular.module('UniReviewWeb');

app.factory('Auth', [ '$http', '$rootScope', '$window', 'Session', 'AUTH_EVENTS',
	function($http, $rootScope, $window, Session, AUTH_EVENTS) {
		var authService = {};

		//the login function
		authService.login = function (user, success, error) {
			$http.post('/auth/login', user).then(function (data) {
				var users = data.data.users;
				if(users.studentid)
					user.userRole = "student";
				$window.sessionStorage["userInfo"] = JSON.stringify(user);
				Session.create(users);
				$rootScope.currentUser = users;

				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
				success(users);
			}, function (err) {
				$rootScope.$broadcast(AUTH_EVENTS.loginFailed);
				error(err);
			});
		};

		authService.isAuthenticated = function () {
			return !!Session.user;
		};

		authService.isAuthorized = function (authorizedRoles) {
			if (!angular.isArray(authorizedRoles)) {
				authorizedRoles = [authorizedRoles];
			}
			return (authService.isAuthenticated() &&
				authorizedRoles.indexOf(Session.userRole) !== -1);
		};

		authService.logout = function () {
			Session.destroy();
			$window.sessionStorage.removeItem("userInfo");
			$rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
		};

		return authService;
	}
]);

app.factory('AuthInterceptor', [ '$rootScope', '$q', 'Session', 'AUTH_EVENTS',
	function($rootScope, $q, Session, AUTH_EVENTS) {
		return {
			responseError : function(response) {
				$rootScope.$broadcast({
					401 : AUTH_EVENTS.notAuthenticated,
					403 : AUTH_EVENTS.notAuthorized,
					419 : AUTH_EVENTS.sessionTimeout,
					440 : AUTH_EVENTS.sessionTimeout
				}[response.status], response);
				return $q.reject(response);
			}
		};
	}
]);

app.run(function($rootScope, $window, $state, Auth, AUTH_EVENTS) {

	$rootScope.$on('$stateChangeStart', function (event, next) {
		var authorizedRoles = next.data.authorizedRoles;
		if (!Auth.isAuthorized(authorizedRoles)) {
			event.preventDefault();
			if (Auth.isAuthenticated()) {
				// user is not allowed
				$rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
			} else {
				$rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
			}
		}
	});

	if ($window.sessionStorage["userInfo"] && !$rootScope.currentUser) {
		var credentials = JSON.parse($window.sessionStorage["userInfo"]);
		Auth.login(credentials,function (user) {});
	}

	$rootScope.getClass = function(path) {
		if ($state.current.name == path) {
			return "active";
		} else {
			return "";
		}
	};

	$rootScope.logout = function(){
		Auth.logout();
	};

});

app.service('Session', function($rootScope, USER_ROLES) {

	this.create = function(user) {
		this.user = user;
		this.userRole = user.userRole;
	};
	this.destroy = function() {
		this.user = null;
		this.userRole = null;
	};
	return this;
});