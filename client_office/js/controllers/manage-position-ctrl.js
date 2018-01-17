'use-strict'
var app = angular.module("bookingCar");

app.controller("managePositionCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', '$firebaseArray', '$timeout', managePositionCtrl]);
function managePositionCtrl($scope, $rootScope, helper, $location, $http, $firebaseArray, $timeout) {
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
        console.log(date)
        return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    }

    $scope.statusText = ["Chờ định vị", "Đã định vị", "Chờ xe", "Di chuyển", "Hoàn thành", "Không có xe", "Đang định vị"]

    $scope.bookingList = {
        minRowsToShow: 15,
        enableSorting: true,
        enableRowSelection: true,
        multiSelect: false,
        enableColumnResizing: true,
        selectionRowHeaderWidth: 35,
        columnDefs: [
            {
                field: 'action', displayName: '', minWidth: 80, maxWidth: 100,
                cellTemplate: '<div class="ui-grid-cell-contents text-center"><button ng-if="row.entity.status == 0"  title="Sửa tọa độ" type="button" style="padding: 0px 5px;" class="btn btn-default" ng-click="grid.appScope.locate(row)"><i class="fa fa-map-marker"></i></button><button ng-if="row.entity.status != 0&&row.entity.status != 6&&row.entity.status != 5&&row.entity.status != 4"  title="Xem đường đi" type="button" style="padding: 0px 5px;" class="btn btn-default" ng-click="grid.appScope.locate(row)"><i class="fa fa-eye"></i></button></div>'
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
                    //priority: 0,
                }, cellTemplate: '<div class="ui-grid-cell-contents" >{{row.entity.tg_dat | date:"dd-MM-yyyy HH:mm"}}</div>'
            },
            {
                field: 'ten_tai_xe', displayName: 'Tài xế', minWidth: 150, maxWidth: 200}
        ],
        onRegisterApi: function (gridApi) {
            $scope.gridApi = gridApi;
        }
    };

    $scope.bookingList.data = $scope.data;

    $scope.locate = function (row) {
        if(row.entity.status==6){
            helper.popup.info({ title: "Lỗi", message: "Đã có người khác làm thay bạn", close: function () { return; } });            
        }
        
        if(row.entity.status==0){
            firebase.database().ref("booking").child(row.entity.$id).update({
                status: 6, //dang dinh vi
            }).then(function () {
                $timeout(function(){
                    $location.path('locate/'+row.entity.$id);                
                }, 500)
            }).catch(function (error) {
                helper.popup.info({ title: "Lỗi", message: "Có lỗi xảy ra, vui lòng tải lại trang", close: function () { location.reload(); return; } });
            });
        }

        //Xem duong di
        if(row.entity.status==1||row.entity.status==2||row.entity.status==3){
            $location.path('locate/'+row.entity.$id);                            
        }
    }
}