var app = angular.module('UniReviewWeb');

app.controller('signInController', ['$scope', '$state' , '$window', 'Auth', '$mdDialog', function($scope, $state, $window, Auth, $mdDialog) {

	$scope.check.mainpage = false;
	$scope.credentials = {};
	$scope.loginForm = {};

	$scope.submit = function() {
		if (!$scope.loginForm.$invalid) {
			$scope.login($scope.credentials);
		}
	};

	$scope.login = function(credentials) {
		Auth.login(credentials, function() {
			if(!$scope.check.mainpage)
				$scope.check.mainpage = true;
			$window.history.back();
		}, function(err) {
			var alert = $mdDialog.alert()
				.title(err.data.message)
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
		});
	};

	if ($window.sessionStorage['userInfo']) {
		var credentials = JSON.parse($window.sessionStorage['userInfo']);
		$scope.login(credentials);
	}

	$scope.signup = function () {
		$state.go('signup');
	};
}]);