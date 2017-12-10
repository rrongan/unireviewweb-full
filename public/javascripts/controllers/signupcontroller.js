var app = angular.module('UniReviewWeb');

app.controller('signUpController', ['$scope', '$rootScope', '$http', '$state', '$mdDialog', function($scope, $rootScope, $http, $state, $mdDialog) {

	$scope.check.mainpage = false;

	$scope.signin = function () {
		$state.go('signin')
	};

	if($rootScope.currentUser){
		$scope.check.mainpage = true;
		$state.go('home');
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
		$http.post('/student',credentials).then(function (data) {
			var alert = $mdDialog.alert()
				.title('Register Successfully')
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
			$state.go('signin')
		},function (err) {
			var msg = err.data.message;
			msg = msg.toString().replace("email:","");
			msg = msg.toString().replace("username:","");
			var alert = $mdDialog.alert()
				.title('Registration Failed')
				.textContent(msg)
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
		});
	};
}]);