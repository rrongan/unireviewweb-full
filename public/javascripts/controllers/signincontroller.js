var app = angular.module('UniReviewWeb');

app.controller('signInController', ['$scope', '$state' , '$window', 'Auth', function($scope, $state, $window, Auth ) {

	$scope.check.mainpage = false;
	$scope.credentials = {};
	$scope.loginForm = {};

	$scope.submit = function() {
		if (!$scope.loginForm.$invalid) {
			$scope.login($scope.credentials);
		}
	};

	$scope.login = function(credentials) {
		Auth.login(credentials, function(user) {
			$state.go('home')
		}, function(err) {
			alert(err.data.message);
		});
	};

	if ($window.sessionStorage["userInfo"]) {
		var credentials = JSON.parse($window.sessionStorage["userInfo"]);
		$scope.login(credentials);
	}

	$scope.signup = function () {
		$state.go('signup');
	};
}]);