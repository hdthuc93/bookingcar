'use-strict'
var app = angular.module("bookingCar");

app.controller("locateCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', '$firebaseObject', '$firebaseArray', '$stateParams', '$interval', locateCtrl]);
function locateCtrl($scope, $rootScope, helper, $location, $http, $firebaseObject, $firebaseArray, $stateParams, $interval) {
    var id = $stateParams.id;
    var mapCanvas = document.getElementById("locateMap");
    var map = new google.maps.Map(mapCanvas);

    google.maps.event.addListenerOnce(map, 'idle', function () {
        if (id) {
            var ref = firebase.database().ref("booking").child(id).once('value').then(function (snapshot) {
                var data = snapshot.val();
                var xuat_phat = data.xuat_phat;
                $scope.curAddress = data.xuat_phat;
                $scope.status = data.status;
                $scope.$apply();
                //Status = 0 , Tu dong dinh vi
                if (data.status == 0||data.status == 6) {
                    var geocoder = new google.maps.Geocoder();
                    geocoder.geocode({ 'address': xuat_phat }, function (results, status) {
                        if (status == google.maps.GeocoderStatus.OK) {
                            $scope.position = {
                                lat: results[0].geometry.location.lat(),
                                lng: results[0].geometry.location.lng()
                            }
                            var myCenter = new google.maps.LatLng($scope.position.lat, $scope.position.lng);

                            var mapOptions = { center: myCenter, zoom: 16 };
                            map = new google.maps.Map(mapCanvas, mapOptions);
                            $scope.markerCustomer = new google.maps.Marker(
                                {
                                    map: map,
                                    draggable: true,
                                    animation: google.maps.Animation.DROP,
                                    position: $scope.position
                                });
                            $scope.markerCustomer.setMap(map);

                            var infowindow = new google.maps.InfoWindow({
                                content: 'Di chuyển để định vị'
                            });
                            infowindow.open(map, $scope.markerCustomer);

                            google.maps.event.addListener($scope.markerCustomer, 'dragend', function () {
                                geocodePosition($scope.markerCustomer.getPosition());
                            });

                            function geocodePosition(pos) {
                                geocoder = new google.maps.Geocoder();
                                geocoder.geocode
                                    ({
                                        latLng: pos
                                    },
                                    function (results, status) {
                                        if (status == google.maps.GeocoderStatus.OK) {

                                            $scope.curAddress = results[0].formatted_address;
                                            $scope.position = {
                                                lat: results[0].geometry.location.lat(),
                                                lng: results[0].geometry.location.lng()
                                            }
                                            //console.log(JSON.stringify($scope.position))
                                            $scope.$apply();
                                        }
                                        else {
                                            helper.popup.info({ title: "Lỗi", message: "Không thể xác định tọa độ", close: function () { return; } })
                                        }
                                    }
                                    );
                            }
                        } else {
                            helper.popup.info({ title: "Lỗi", message: "Địa chỉ không hợp lệ", close: function () { return; } });
                            //đưa sang status 5: không có xe
                            firebase.database().ref("booking").child(id).update({
                                xuat_phat_toa_do: JSON.stringify($scope.position),
                                status: 5
                            })
                        }
                    });

                    // XAY DUNG TAI XE
                    var refDriver = firebase.database().ref("drivers").orderByChild("status").equalTo(0).limitToFirst(10);//limitToFirst: lay n dua dau tien, toLast lay n dua cuoi cung
                    $scope.driverList = $firebaseArray(refDriver);//real time

                    $scope.driverList.$loaded().then(function () {
                        $scope.markerDrivers = [10];

                        for (var i = 0; i < $scope.driverList.length; i++) {
                            $scope.markerDrivers[i] = new google.maps.Marker(
                                {
                                    map: map,
                                    icon: "/img/car.png",
                                    label: { text: $scope.driverList[i].ten_nv, color: "white", fontWeight: "bold" },
                                    draggable: false,
                                    animation: google.maps.Animation.DROP,
                                    position: JSON.parse($scope.driverList[i].toa_do)
                                });
                            $scope.markerDrivers[i].setMap(map);
                        }
                        $interval(function () {//console.log($scope.driverList);
                            var list = $scope.driverList;
                            for (var i = 0; i < $scope.driverList.length; i++) {
                                var newLatLng = new google.maps.LatLng(JSON.parse($scope.driverList[i].toa_do).lat, JSON.parse($scope.driverList[i].toa_do).lng);
                                $scope.markerDrivers[i].setPosition(newLatLng);
                            }
                        }, 5000)
                    });
                } else {
                    //hien thi lich trinh
                    $scope.markerList = [];
                    var refClosestDriver = firebase.database().ref("drivers").orderByChild("id").equalTo(data.tai_xe).limitToFirst(1);
                    $scope.closestDriver = $firebaseArray(refClosestDriver);//real time    

                    $scope.closestDriver.$loaded().then(function () {
                        var directionsService = new google.maps.DirectionsService;
                        var directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true, polylineOptions: { strokeColor: "orange" } });
                        directionsDisplay.setMap(map);

                        //change pos
                        firebase.database().ref("drivers/" + $scope.closestDriver[0].$id).on("child_changed", function (d) {
                            directionsService.route({
                                origin: new google.maps.LatLng(JSON.parse(d.val()).lat, JSON.parse(d.val()).lng),
                                destination: new google.maps.LatLng(JSON.parse(data.xuat_phat_toa_do).lat, JSON.parse(data.xuat_phat_toa_do).lng),
                                optimizeWaypoints: true,
                                travelMode: 'DRIVING'
                            }, function (response, status) {
                                if (status === 'OK') {
                                    directionsDisplay.setDirections(response);
                                    var leg = response.routes[0].legs[0];
                                    removeAllMarker($scope.markerList);
                                    $scope.markerList = [];
                                    $scope.markerList.push(makeMarker(leg.start_location, "/img/car.png", $scope.closestDriver[0].ten_nv));
                                    $scope.markerList.push(makeMarker(leg.end_location, "/img/client.png", " "));
                                } else {
                                    //helper.popup.info({ title: "Lỗi", message: "Không thể hiển thị lộ trình", close: function () { return; } });
                                }
                            });
                        })
                        if ($scope.closestDriver[0]) {
                            directionsService.route({
                                origin: new google.maps.LatLng(JSON.parse($scope.closestDriver[0].toa_do).lat, JSON.parse($scope.closestDriver[0].toa_do).lng),
                                destination: new google.maps.LatLng(JSON.parse(data.xuat_phat_toa_do).lat, JSON.parse(data.xuat_phat_toa_do).lng),
                                optimizeWaypoints: true,
                                travelMode: 'DRIVING'
                            }, function (response, status) {
                                if (status === 'OK') {
                                    directionsDisplay.setDirections(response);
                                    var leg = response.routes[0].legs[0];
                                    removeAllMarker($scope.markerList);
                                    $scope.markerList = [];
                                    $scope.markerList.push(makeMarker(leg.start_location, "/img/car.png", $scope.closestDriver[0].ten_nv));
                                    $scope.markerList.push(makeMarker(leg.end_location, "/img/client.png", " "));
                                } else {
                                    helper.popup.info({ title: "Lỗi", message: "Không thể hiển thị lộ trình", close: function () { return; } });
                                }
                            });
                        }
                    });
                }
            });
        } else {
            $location.path('404');
        }
    });

    $scope.savePosition = function () {
        //tim tai xe gan khach nhat
        var closestDriver = null;
        var minDistance = 9999999999;
        if($scope.driverList.length){
            for (var i = 0; i < $scope.driverList.length; i++) {
                var posDriver = $scope.markerDrivers[i].getPosition();
                var posCustomer = $scope.markerCustomer.getPosition();
                var distance = getDistance(posDriver, posCustomer);
                if (minDistance > distance) {
                    minDistance = distance;
                    closestDriver = $scope.driverList[i];
                }
            }
            firebase.database().ref("booking").child(id).update({
                xuat_phat_toa_do: JSON.stringify($scope.position),
                status: 1, //duoc dinh vi
                tai_xe: closestDriver.id,
                ten_tai_xe: closestDriver.ten_nv
            }).then(function () {
                
            }).catch(function (error) {
                console.log(error)
                helper.popup.info({ title: "Lỗi", message: "Cập nhật tọa độ thất bại", close: function () { return; } });
            });

            console.log(99999, closestDriver.$id)
            //Cap nhat tai xe
            firebase.database().ref("drivers").child(closestDriver.$id).update({
                status: 1 //dang di cho khach
            }).then(function(){
                helper.popup.info({ title: "Thông báo", message: "Cập nhật tọa độ thành công. Bấm OK để xem lịch trình", close: function () { location.reload(); return; } });                    
            })
            
        }else{//ko co tai xe
            firebase.database().ref("booking").child(id).update({
                xuat_phat_toa_do: JSON.stringify($scope.position),
                status: 5, //khong co tai xe
                tai_xe: "",
                ten_tai_xe: ""
            }).then(function () {
                helper.popup.info({ title: "Thông báo", message: "Cập nhật tọa độ thành công. Không tìm thấy tài xế", close: function () { $location.path('manage/position'); return; } });
            }).catch(function (error) {
                console.log(error)
                helper.popup.info({ title: "Lỗi", message: "Cập nhật tọa độ thất bại", close: function () { return; } });
            });
        }
    }

    var rad = function (x) {
        return x * Math.PI / 180;
    };

    var getDistance = function (p1, p2) {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(p2.lat() - p1.lat());
        var dLong = rad(p2.lng() - p1.lng());
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.lat())) * Math.cos(rad(p2.lat())) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    };

    function makeMarker(position, icon, title) {
        return new google.maps.Marker({
            position: position,
            map: map,
            icon: icon,
            label: { text: title, color: "white", fontWeight: "bold" },
        });
    }

    function removeAllMarker(lst) {
        for (var i in lst) {
            lst[i].setMap(null)
        }
    }
}