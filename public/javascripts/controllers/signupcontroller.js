var app = angular.module('UniReviewWeb');

function signUpController($scope, $http, $rootScope, $location, $mdDialog) {

	$scope.check.mainpage = false;

	$scope.signin = function () {
		$location.path('/signin');
	};

	if($rootScope.currentUser){
		$scope.check.mainpage = true;
		$location.path('/');
	}

	$scope.submit = function() {
		if (!$scope.loginForm.$invalid && $scope.credentials.password === $scope.credentials.cpassword) {
			$scope.credentials.name = $scope.credentials.fname + ' '+$scope.credentials.lname;
			$scope.register($scope.credentials);
		} else {
			var alert = $mdDialog.alert()
				.title('Invalid Password')
				.textContent('Password not equal')
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
		}
	};

	$scope.register = function(credentials) {
		$http.post('/student',credentials).then(function () {
			var alert = $mdDialog.alert()
				.title('Register Successfully')
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
			$location.path('/signin');
		},function (err) {
			var msg = err.data.message;
			msg = msg.toString().replace('email:','');
			msg = msg.toString().replace('username:','');
			var alert = $mdDialog.alert()
				.title('Registration Failed')
				.textContent(msg)
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
		});
	};
}

module.exports = signUpController;