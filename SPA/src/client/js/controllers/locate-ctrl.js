'use-strict'
var app = angular.module("bookingCar");

app.controller("locateCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', locateCtrl]);
function locateCtrl($scope, $rootScope, helper, $location, $http) {
    function init() {
        $scope.data = null;
    }
    init();
   



}