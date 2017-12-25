'use-strict'
var app = angular.module("bookingCar");

app.controller("managePositionCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', managePositionCtrl]);
function managePositionCtrl($scope, $rootScope, helper, $location, $http) {
    function init() {
        $scope.data = null;
    }
    init();
   



}