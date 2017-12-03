var app = angular.module('UniReviewWeb');

app.controller('collegeMainController', ['$http','$scope', '$state', 'wikipediaFactory', '$sce', function($http, $scope, $state, wikipediaFactory, $sce) {

	$scope.icon = $state.params.image;
	$scope.check.mainpage = true;
	$scope.readOnly = true;
	$scope.rating = 0;
	$scope.wiki = 'No Information';
	$http.get('/college/'+ $state.params.collegeid +'/review').then(function (data) {
		var reviews = data.data;
		var count = 0;
		if(reviews.length > 0){
			for(var i=0; i<reviews.length;i++){
				var review = reviews[i];
				count += review.rating;
			}
			$scope.rating = (count/reviews.length).toFixed(1);
		}
	});

	$http.get('/college/'+$state.params.collegeid).then(function (data) {

		var college = data.data[0];
		$scope.college = college;

		$http.get('/googleimg/'+college.name+' campus').then(function (data) {
			var images = data.data;
			var imagepath;
			for(var i=0; i<images.length;i++){
				if(images[i].width>1920){
					imagepath = images[i].url;
					break;
				}
			}

			wikipediaFactory.getArticle({
				term: college.name
			}).then(function (data) {
				$scope.wiki = $sce.trustAsHtml(data.data.query.pages[0].extract);
			});

			$scope.image= {
				"background-image": "url('stylesheets/images/light-bl.svg'), url('stylesheets/images/light-br.svg'), url('stylesheets/images/overlay.png'), url('"+ imagepath +"')"
			}
		});
	});

	$scope.image= {
		"background-image": "url('stylesheets/images/light-bl.svg'), url('stylesheets/images/light-br.svg'), url('stylesheets/images/overlay.png')"
	}
}]);