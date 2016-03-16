var testApp = angular.module("testApp", []);

testApp.controller("WorkersListCtrl", function($scope, $http) {
	$http.get("/workers").success(function(response) {
		$scope.workers = response;
	})
});

testApp.controller("PresencesListCtrl", function($scope, $http) {
	$http.get("/presences/all").success(function(response){
		$scope.presences = response;
	});
	$scope.test = function() {
		$scope.presences = [];
	}
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