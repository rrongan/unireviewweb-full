var app = angular.module('UniReviewWeb');

app.controller('mainController', ['$scope', '$state', '$rootScope', '$uibModal', 'Auth', 'AUTH_EVENTS','USER_ROLES', '$window', '$mdDialog',
	function($scope, $state, $rootScope, $uibModal, Auth, AUTH_EVENTS, USER_ROLES, $window, $mdDialog) {

		$scope.check = {};
		$scope.check.mainpage = true;
		$scope.$on('$stateChangeStart', function() {
			$scope.check.mainpage = true;
		});
		function search() {
			if ($scope.college.length > 0) {
				$state.go('searchresult', {'param': $scope.college});
			}
		}
		$scope.searchCollege = function () {
			search();
		};
		$scope.pressenter = function ($event) {
			if($event.keyCode === 13)
				search();
		};
		$scope.signin = function () {
			$state.go('signin');
		};
		$scope.signup = function () {
			$state.go('signup');
		};
		$scope.home = function () {
			if(!$scope.check.mainpage)
				$scope.check.mainpage = true;
		};

		var showLoginPage = function() {
			$state.go('signin');
		};

		var backHomePage = function() {
			$window.location.reload();
		};

		var setCurrentUser = function(){
			$scope.currentUser = $rootScope.currentUser;
		};

		var showNotAuthorized = function(){
			var alert = $mdDialog.alert()
				.title('Not Authorized')
				.ariaLabel('Lucky day')
				.ok('Confirm');
			$mdDialog.show(alert);
		};

		$scope.currentUser = null;
		$scope.userRoles = USER_ROLES;
		$scope.isAuthorized = Auth.isAuthorized;

		//listen to events of unsuccessful logins, to run the login dialog
		$rootScope.$on(AUTH_EVENTS.notAuthorized, showNotAuthorized);
		$rootScope.$on(AUTH_EVENTS.notAuthenticated, showLoginPage);
		$rootScope.$on(AUTH_EVENTS.sessionTimeout, backHomePage);
		$rootScope.$on(AUTH_EVENTS.logoutSuccess, backHomePage);
		$rootScope.$on(AUTH_EVENTS.loginSuccess, setCurrentUser);
	}]);