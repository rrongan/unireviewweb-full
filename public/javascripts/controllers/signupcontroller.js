var app = angular.module('UniReviewWeb');

app.controller('signUpController', ['$scope', '$http', '$state', function($scope, $http, $state) {

	$scope.check.mainpage = false;

	$scope.signin = function () {
		$state.go('signin')
	};

	$scope.submit = function() {
		if (!$scope.loginForm.$invalid) {
			$scope.credentials.name = $scope.credentials.fname + ' '+$scope.credentials.lname;
			$scope.register($scope.credentials);
		} else {
			$scope.error = true;
		}
	};

	$scope.register = function(credentials) {
		$http.post('/student',credentials).then(function (data) {
			alert(data.data.message);
			$state.go('signin')
		},function (err) {
			var msg = err.data.message;
			msg = msg.toString().replace("email:","");
			msg = msg.toString().replace("username:","");
			alert(msg);
		});
	};
}]);