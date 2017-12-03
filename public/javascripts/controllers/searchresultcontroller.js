var app = angular.module('UniReviewWeb');

app.controller('searchResultController', ['$http', '$state','$scope','$stateParams','GoogleImageSearch', function($http, $state, $scope, $stateParams,GoogleImageSearch) {

	$scope.check.mainpage = false;
	$scope.keyword = 'Search Result: '+ $stateParams.param;

	var params = {
		key:["name"],
		value: $stateParams.param
	};

	$http.post('/college/search',params).then(async function (data) {
		$scope.results = data.data;
		for(var i=0; i<$scope.results.length;i++){
			// await $http.get('/googleimg/'+$scope.results[i].name+' logo').then(function (data) {
			// 	$scope.results[i].image = data.data[0].url;
			// });
			await GoogleImageSearch.searchImage($scope.results[i].name+' logo').then((res) => {
				$scope.results[i].image = res[0];
			});
		}
		var image = $scope.results[i].image;
	}, function (err) {
		$scope.keyword = 'Result Not Found, Please Try Again'
	});

	$scope.go = function(college,image) {
		$state.go('collegemain',{'collegeid':college._id, 'image':image});
	}
}]);