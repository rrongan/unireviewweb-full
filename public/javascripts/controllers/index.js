var app = angular.module('UniReviewWeb');

app.controller('mainController', ['$scope', '$location', '$rootScope', 'Auth', 'AUTH_EVENTS','USER_ROLES', '$window', '$mdDialog', require('./maincontroller')]);
app.controller('searchResultController', ['$scope','$http','$location','$routeParams','GoogleImageSearch', require('./searchresultcontroller')]);
app.controller('signInController', ['$scope', '$location' , '$window', 'Auth', '$mdDialog', require('./signincontroller')]);
app.controller('signUpController', ['$scope', '$http', '$rootScope', '$location', '$mdDialog', require('./signupcontroller')]);
app.controller('collegeMainController', ['$scope','$http','$rootScope', '$route','$routeParams','$mdDialog','$location','GoogleImageSearch','wikipediaFactory','$sce','moment', require('./collegemaincontroller')]);
app.controller('allCollegesController', ['$scope','$http','$location','GoogleImageSearch', require('./allcollegescontroller')]);
app.controller('addCollegeController', ['$scope','$http', '$mdDialog', '$location',require('./addcollegecontroller')]);
app.controller('editCollegeController', ['$scope','$http','$rootScope', '$route', '$location', '$mdDialog', require('./editcollegecontroller')]);
app.controller('studentProfileController', ['$scope','$http','$rootScope', '$location', '$route', '$mdDialog', 'moment', require('./studentprofilecontroller')]);