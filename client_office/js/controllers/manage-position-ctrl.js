'use-strict'
var app = angular.module("bookingCar");

app.controller("managePositionCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', managePositionCtrl]);
function managePositionCtrl($scope, $rootScope, helper, $location, $http) {
    function init() {
        $scope.data = null;
    }
    init();

    $scope.positionList = {
        minRowsToShow: 15,
        enableSorting: false,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            { field: 'no', displayName: 'STT', width: 40 },
            { field: 'no', displayName: 'STT', width: 40 },
            { field: 'no', displayName: 'STT', width: 40 }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.selection.on.rowSelectionChanged($scope, function (row) {
                if (row.isSelected) {
                    $scope.selectedRow = row.entity;
                } else {
                    $scope.selectedRow = null;
                }
            });
        }
    };


}