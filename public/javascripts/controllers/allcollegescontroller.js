var app = angular.module('UniReviewWeb');

app.controller('searchResultController', ['$http','$window','$rootScope','$state','$scope','$stateParams','GoogleImageSearch', function($http, $window, $rootScope, $state, $scope, $stateParams,GoogleImageSearch) {

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
			// 	var images = data.data;
			// 	for(var j=0; j<images.length;j++){
			// 		if(images[j].width<200){
			// 			$scope.results[i].image = images[j].url;
			// 			break;
			// 		}
			// 	}
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