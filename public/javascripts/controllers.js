var testApp = angular.module("testApp", []);

testApp.controller("WorkersListCtrl", function($scope, $http) {
	$http.get("/get_students").success(function(response){
		$scope.workers = response;
	})
});

testApp.controller("PresencesListCtrl", function($scope, $http) {
	$http.get("/get_presences").success(function(response){
		$scope.presences = response;
	})
});

// var phonecatApp = angular.module('phonecatApp', []);

// phonecatApp.controller('PhoneListCtrl', function ($scope) {
//   $scope.phones = [
//     {'name': 'Nexus S',
//      'snippet': 'Fast just got faster with Nexus S.'},
//     {'name': 'Motorola XOOM™ with Wi-Fi',
//      'snippet': 'The Next, Next Generation tablet.'},
//     {'name': 'MOTOROLA XOOM™',
//      'snippet': 'The Next, Next Generation tablet.'}
//   ];
// });