var app = angular.module('UniReviewWeb');

app.controller('searchResultController', ['$http','$scope','$stateParams', function($http, $scope, $stateParams) {

	$scope.check.mainpage = false;
	$scope.keyword = 'Search Result: '+ $stateParams.param;

	var params = {
		key:["name"],
		value: $stateParams.param
	};

	$http.post('/college/search',params).then(function (data) {
		$scope.results = data.data;
	}, function (err) {
		$scope.keyword = 'Result Not Found, Please Try Again'
	});

	$scope.go = function(college) {
		console.log(college._id);
	}
}]);