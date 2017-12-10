var app = angular.module('UniReviewWeb');

app.controller('addCollegeController', ['$http', '$scope', '$state', '$mdDialog', function($http, $scope, $state, $mdDialog) {

	$scope.check.mainpage = false;
	$scope.credentials = {};
	$scope.loginForm = {};

	$scope.submit = function() {
		if (!$scope.loginForm.$invalid) {
			$scope.addcollege($scope.credentials);
		}
	};

	$scope.addcollege = function (credentials) {
		$http.post('/college',credentials).then(function () {
			var alert = $mdDialog.alert()
				.title('College Added')
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
			$state.go('home');
		},function (err) {
			var msg = err.data.message;
			msg = msg.toString().replace('email:','');
			msg = msg.toString().replace('username:','');
			var alert = $mdDialog.alert()
				.title('Failed to Add College')
				.textContent(msg)
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
		});
	};

	$scope.edit = function () {
		$state.go('editcollege');
	};
}]);