'use-strict'
var app = angular.module("driverApp");

app.controller("driverCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', '$firebaseObject', '$firebaseArray', '$interval', driverCtrl]);
function driverCtrl($scope, $rootScope, helper, $location, $http, $firebaseObject, $firebaseArray, $interval) {
    function init() {
        $scope.data = null;
    }
    init();
    //Tao tai xe 
    var ref = firebase.database().ref("drivers");
    var currentDriver = $firebaseArray(ref.orderByChild("id").equalTo($rootScope.userData.car_id));
    $scope.position = {
        // lat: parseFloat("10.756"+ Math.floor(1000000 * Math.random())),
        // lng: parseFloat("106.67"+ Math.floor(100000 * Math.random())),
        lat: parseFloat("10.76" + Math.floor(1000000 * Math.random())),
        lng: parseFloat("106.65333" + Math.floor(100000 * Math.random())),
    }

    var myCenter = new google.maps.LatLng($scope.position.lat, $scope.position.lng);
    var mapCanvas = document.getElementById("driverMap");
    var mapOptions = { center: myCenter, zoom: 16 };
    var map = new google.maps.Map(mapCanvas, mapOptions);


    //Khi load duoc 1 driver
    currentDriver.$loaded().then(function () {
        angular.forEach(currentDriver, function (value, key) {
            $scope.id  = value.$id;
            ref.child(value.$id).update({
                id: $rootScope.userData.car_id,
                toa_do: JSON.stringify($scope.position),
                status: 0,
                ten_nv: $rootScope.userData.name
            });
        });
        // $scope.thisDriverData = ref.push();
        // $scope.thisDriverData.set({
        //     id: $rootScope.userData.car_id,
        //     toa_do: JSON.stringify($scope.position),
        //     status: 0,
        //     ten_nv: $rootScope.userData.name
        // }).then(function(cb){
        //     console.log(99999, cb)
        // });

        //Gui vi tri moi 5s
        $interval(function () {
            // $scope.thisDriverData.update({
            //     id: $rootScope.userData.car_id,
            //     toa_do: JSON.stringify($scope.position),
            //     //status: 0,
            //     ten_nv: $rootScope.userData.name
            // });
            ref.child($scope.id).update({
                toa_do: JSON.stringify($scope.position),
            });
        }, 5000)
    });


    function driverMap() {

        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true, polylineOptions: { strokeColor: "orange" } });
        directionsDisplay.setMap(map);

        //Tai xe
        var markerDriver = new google.maps.Marker(
            {
                map: map,
                icon: "/img/car.png",
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: $scope.position
            });
        markerDriver.setMap(map);

        google.maps.event.addListener(markerDriver, 'dragend', function () {
            $scope.position = {
                lat: markerDriver.getPosition().lat(),
                lng: markerDriver.getPosition().lng()
            }
            //UPDATE DRIVER
            ref.child($scope.id).update({
                toa_do: JSON.stringify($scope.position),
            });
            if($scope.customer){
                directionsService.route({
                    origin: new google.maps.LatLng($scope.position.lat, $scope.position.lng),
                    destination: new google.maps.LatLng(JSON.parse($scope.customer.xuat_phat_toa_do).lat, JSON.parse($scope.customer.xuat_phat_toa_do).lng),
                    optimizeWaypoints: true,
                    travelMode: 'DRIVING'
                }, function (response, status) {
                    if (status === 'OK') {
                        directionsDisplay.setDirections(response);
                    } else {
                        helper.popup.info({ title: "Lỗi", message: "Không thể hiển thị lộ trình", close: function () { return; } });
                    }
                });
            }
        });

        //Khach hang
        var refClosestCustomer = firebase.database().ref("booking").orderByChild("tai_xe").equalTo($rootScope.userData.car_id).limitToFirst(1);
        $scope.closestCust = $firebaseArray(refClosestCustomer);//real time
        $scope.closestCust.$loaded().then(function () {
            if ($scope.closestCust.length) {
                $scope.customer = $scope.closestCust[0];
                $scope.markerCustomer = new google.maps.Marker(
                    {
                        map: map,
                        icon: ($scope.customer.status!=3)?"/img/client.png":" ",
                        draggable: false,
                        animation: google.maps.Animation.DROP,
                        position: JSON.parse($scope.customer.xuat_phat_toa_do)
                    });
                $scope.markerCustomer.setMap(map);
                directionsService.route({
                    origin: new google.maps.LatLng($scope.position.lat, $scope.position.lng),
                    destination: new google.maps.LatLng(JSON.parse($scope.customer.xuat_phat_toa_do).lat, JSON.parse($scope.customer.xuat_phat_toa_do).lng),
                    optimizeWaypoints: true,
                    travelMode: 'DRIVING'
                }, function (response, status) {
                    if (status === 'OK') {
                        directionsDisplay.setDirections(response);
                    } else {
                        helper.popup.info({ title: "Lỗi", message: "Không thể hiển thị lộ trình", close: function () { return; } });
                    }
                });
            }
        })
    }

    driverMap();

    $scope.running = function(){
        if($scope.customer){
            firebase.database().ref("booking").child($scope.customer.$id).update({
                status: 3 //xe nhan
            }).then(function(){
                $scope.markerCustomer.setMap(null);
            })
        }
    }

    $scope.done = function(){
        if($scope.customer){
            firebase.database().ref("booking").child($scope.customer.$id).update({
                status: 4, //Hoan thanh chuyen di
                tai_xe: ""
            }).then(function(){
                ref.child($scope.id).update({
                    status: 0,
                    toa_do: JSON.stringify($scope.position),
                }).then(function(){
                    helper.popup.info({ title: "Thông báo", message: "Chuyến đi thành công tốt đẹp", close: function () { return; } });                                    
                });
            })
        }
    }
}