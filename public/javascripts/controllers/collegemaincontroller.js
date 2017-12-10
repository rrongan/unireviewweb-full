/*Review Edit Delete http://blog.shubhamsaxena.com/creating-simple-inline-editing-with-angularjs/*/
var app = angular.module('UniReviewWeb');

app.controller('collegeMainController', ['$http','$window','$rootScope','$scope','$state','$mdDialog','wikipediaFactory','$sce','moment',
	function($http, $window, $rootScope, $scope, $state, $mdDialog, wikipediaFactory, $sce, $moment) {

	$scope.icon = $state.params.image;
	$scope.check.mainpage = true;
	$scope.readOnly = true;
	$scope.rating = 0;
	$scope.show = true;
	$scope.tab = true;
	$scope.wiki = 'No Information';
	$scope.selected = {};

	$scope.addreviewrating = 1;
	$scope.comment = "";

	$scope.overviewtab = function () {
		$scope.tab = true;
		$scope.show = true;
	};

	$scope.reviewtab = function () {
		$scope.tab = false;
		$scope.show = false;
	};

	$scope.showEditDelete = function (studentid) {
		if($rootScope.currentUser)
			return $rootScope.currentUser.studentid === studentid;
		else
			return false;
	};

	$scope.editReview = function (review) {
		$scope.selected = angular.copy(review);
	};

	$scope.updateReview = function (review) {
		$http.put('/college/'+ $state.params.collegeid +'/review/'+review._id,review).then(function (data) {
			var alert = $mdDialog.alert()
				.title('Review Updated')
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
			$state.reload();
		});
	};

	$scope.deleteReview = function (ev,review) {
		var confirm = $mdDialog.confirm()
			.title('Delete Review')
			.textContent('Would you like to delete review?')
			.ariaLabel('Lucky day')
			.targetEvent(ev)
			.ok('Confirm')
			.cancel('Cancel');

		var alert = $mdDialog.alert()
			.title('Review Deleted')
			.ariaLabel('Lucky day')
			.ok('Confirm');

		$mdDialog.show(confirm).then(function() {
			$http.delete('/college/'+ $state.params.collegeid +'/review/'+review._id).then(function (data) {
				$mdDialog.show(alert);
				$state.reload();
			});
		}, function() {

		});
	};

	$scope.getTemplate = function (review) {
		if (review._id === $scope.selected._id){
			return 'edit';
		}
		else {
			return 'display';
		}
	};

	$scope.reset = function () {
		$scope.selected = {};
	};

	$http.get('/college/'+ $state.params.collegeid +'/review').then(async function (data) {
		var reviews = data.data;
		var count = 0;
		if(reviews.length > 0){
			for(var i=0; i<reviews.length;i++){
				var review = reviews[i];
				review.date = moment(review.date, moment.ISO_8601).format('YYYY-MM-DD HH:mm');
				count += review.rating;
				await $http.get('/student/'+ review.reviewer).then(function (data) {
					review.reviewerName = data.data[0].name;
				});
			}
			$scope.rating = (count/reviews.length).toFixed(1);
			$scope.reviews = reviews;
		}
	});

	$http.get('/college/'+$state.params.collegeid).then(function (data) {

		var college = data.data[0];
		$scope.college = college;

		$http.get('/googleimg/'+college.name+' campus',{cache:true}).then(function (data) {
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

	$scope.addReview = function(){
		var reviewdetails = {
			rating: $scope.addreviewrating,
			comment: $scope.comment,
			reviewer: $rootScope.currentUser.studentid,
			type: 'College'
		};
		if(reviewdetails.rating === 0){
			var alert = $mdDialog.alert()
				.title("Rate At Least 1 Star for Review")
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
		}else if(reviewdetails.comment === ""){
			var alert = $mdDialog.alert()
				.title("Comment is Required for Adding Review")
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
		}else{
			$http.post('/college/'+$state.params.collegeid+'/review',reviewdetails).then(function (data) {
				var alert = $mdDialog.alert()
					.title('Review Added')
					.ariaLabel('Lucky day')
					.ok('Confirm');
				$mdDialog.show(alert);
				$state.reload();
			});
		}
	};

	$scope.image= {
		"background-image": "url('stylesheets/images/light-bl.svg'), url('stylesheets/images/light-br.svg'), url('stylesheets/images/overlay.png')"
	}
}]);