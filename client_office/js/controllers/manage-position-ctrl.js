'use-strict'
var app = angular.module("bookingCar");

app.controller("managePositionCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', '$firebaseArray', managePositionCtrl]);
function managePositionCtrl($scope, $rootScope, helper, $location, $http, $firebaseArray) {
    function init() {
        $scope.data = null;
    }
    init();

    // var ref = firebase.database().ref().orderByChild("name").equalTo("Phong2", "name");
    // 0: chua đv, 1: đv roi, 2: co xe nhận, 3: đang di chuyển, 4: hoàn thành, 5: không có xe
    var ref = firebase.database().ref("booking").orderByChild("status").startAt().endAt('');
    // var ref = firebase.database().ref("booking");

    // download the data into a local object
    $scope.data = angular.extend($firebaseArray(ref));
    $scope.data.sort(function (a, b) {
        console.log(parseInt(b.tg_dat), parseInt(a.tg_dat));
        return parseInt(b.tg_dat) - parseInt(a.tg_dat);
    })

    $scope.convertDate = function (ts) {
        var date = new Date(ts);
        return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    $scope.statusText = ["Chờ định vị", "Đã định vị", "Chờ xe", "Di chuyển", "Hoàn thành", "Không có xe"]

    $scope.bookingList = {
        minRowsToShow: 15,
        enableSorting: true,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            {
                field: 'action', displayName: '', minWidth: 30, maxWidth: 50,
                cellTemplate: '<div ng-if="row.entity.status == 0" class="ui-grid-cell-contents text-center"><button title="Sửa tọa độ" type="button" style="padding: 0px 5px;" class="btn btn-default" ng-click="grid.appScope.locate(row)"><i class="fa fa-map-marker"></i></button></div>'
            },
            {
                field: 'xuat_phat', displayName: 'Địa chỉ đón', minWidth: 160,
                cellTooltip: function (row, col) {
                    return row.entity.xuat_phat;
                }
            },
            {
                field: 'status', displayName: 'Trạng thái', minWidth: 90, maxWidth: 110,
                cellTooltip: function (row, col) {
                    return $scope.statusText[row.entity.status];
                },
                cellTemplate: '<div class="ui-grid-cell-contents">{{grid.appScope.statusText[row.entity.status]}}</div>'                
            },
            {
                field: 'tg_dat', displayName: 'Đặt lúc', minWidth: 150, maxWidth: 200, sort: {
                    direction: "desc",
                    priority: 0,
                }, cellTemplate: '<div class="ui-grid-cell-contents" >{{grid.appScope.convertDate(row.entity.tg_dat)}}</div>'
            }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $scope.bookingList.data = $scope.data;

    $scope.locate = function (row) {
        console.log(row);
        $location.path('locate/'+row.entity.$id);
    }
}