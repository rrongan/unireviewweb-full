var app = angular.module('UniReviewWeb');

app.controller('allCollegesController', ['$http','$window','$state','$scope','GoogleImageSearch', function($http, $window, $state, $scope, GoogleImageSearch) {

	$scope.check.mainpage = false;

	$scope.getFiltered= function(result, idx){
		result._index = idx;
		return !(result._index % 3 )
	};

	$http.get('/college').then(async function (data) {
		$scope.results = data.data;
		for(var i=0; i<$scope.results.length;i++){
			await GoogleImageSearch.searchImage($scope.results[i].name+' logo').then((res) => {
				$scope.results[i].image = res[0];
			});
		}
		var image = $scope.results[i].image;
	});

	$scope.go = function(college,image) {
		$state.go('collegemain',{'collegeid':college._id, 'image':image});
	}
}]);