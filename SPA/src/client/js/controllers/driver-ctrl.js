'use-strict'
var app = angular.module("bookingCar");

app.controller("driverCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', driverCtrl]);
function driverCtrl($scope, $rootScope, helper, $location, $http) {
    function init() {
        $scope.data = null;
    }
    init();
   



}