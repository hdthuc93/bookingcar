'use-strict'
var app = angular.module("driverApp");

app.controller("mainCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', mainCtrl]);
function mainCtrl($scope, $rootScope, helper, $location, $http) {
    function init() {
        $scope.data = null;
    }
    init();
   



}