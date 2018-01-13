'use-strict'
var app = angular.module("bookingCar");

app.controller("locatePendingCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', '$firebaseObject', '$firebaseArray', locatePendingCtrl]);
function locatePendingCtrl($scope, $rootScope, helper, $location, $http, $firebaseObject, $firebaseArray) {
    function init() {
        $scope.data = null;
    }
    init();

    // var ref = firebase.database().ref().orderByChild("name").equalTo("Phong2", "name");
    // 0: chua đv, 1: đv roi, 2: co xe nhận, 3: đang di chuyển, 4: hoàn thành, 5: không có xe
    var ref = firebase.database().ref("booking").orderByChild("status").equalTo(0);
    // var ref = firebase.database().ref("booking");

    // download the data into a local object
    $scope.data = angular.extend($firebaseArray(ref));
    $scope.data.sort(function (a, b) {
        console.log(parseInt(b.tg_dat), parseInt(a.tg_dat));
        return parseInt(b.tg_dat) - parseInt(a.tg_dat);
    })
    console.log(22222, $scope.data)

    // for(var i = 0 ; i<9; i++){
    //     var newData = ref.push();
    //     newData.set({
    //         status: 0,
    //         ma_xe: "",
    //         dt_kh: "090978656"+i,
    //         xuat_phat: 9*i+10+" Nguyễn Trãi, Quận 5, Hồ Chí Minh",
    //         xuat_phat_toa_do: "",
    //         tg_dat: Date.now()
    //     })
    // }

    $scope.convertDate = function (ts) {
        var date = new Date(ts);
        return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    $scope.waitingList = {
        minRowsToShow: 15,
        enableSorting: false,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            {
                field: 'action', displayName: '', width: 30,
                cellTemplate: '<div class="ui-grid-cell-contents"><button title="Sửa tọa độ" type="button" style="padding: 0px 5px;" class="btn btn-default" ng-click="grid.appScope.locate(row)"><i class="fa fa-map-marker"></i></button></div>'
            },
            {
                field: 'xuat_phat', displayName: 'Địa chỉ đón', minWidth: 140,
                cellTooltip: function (row, col) {
                    return row.entity.xuat_phat;
                }
            },
            {
                field: 'tg_dat', displayName: 'Đặt lúc', minWidth: 150, sort: {
                    direction: "desc",
                    priority: 0,
                }, cellTemplate: '<div class="ui-grid-cell-contents text-center" >{{grid.appScope.convertDate(row.entity.tg_dat)}}</div>'
            }
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $scope.waitingList.data = $scope.data;

    $scope.locate = function (row) {
        console.log(row);
        $location.path('locate/'+row.entity.$id);
    }

}