'use-strict'
var app = angular.module("bookingCar");

app.controller("locateCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', '$firebaseObject', '$firebaseArray', '$stateParams', '$interval', locateCtrl]);
function locateCtrl($scope, $rootScope, helper, $location, $http, $firebaseObject, $firebaseArray, $stateParams, $interval) {
    //Tao tai xe 
    //var ref = firebase.database().ref("drivers");
    // var newData = ref.push();
    // newData.set({
    //              id: 5,
    //              toa_do: '{"lat":10.75688,"lng":106.68098350000002}',
    //              status: 0,
    //              ten_nv: "Tuấn"
    //       });

    var id = $stateParams.id;
    var mapCanvas = document.getElementById("locateMap");
    var map = new google.maps.Map(mapCanvas);

    google.maps.event.addListenerOnce(map, 'idle', function () {
        if (id) {
            var ref = firebase.database().ref("booking").child(id).once('value').then(function (snapshot) {
                var data = snapshot.val();
                var xuat_phat = data.xuat_phat;
                $scope.curAddress = data.xuat_phat;
                $scope.$apply();
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
                        var marker = new google.maps.Marker(
                            {
                                map: map,
                                draggable: true,
                                animation: google.maps.Animation.DROP,
                                position: $scope.position
                            });
                        marker.setMap(map);

                        var infowindow = new google.maps.InfoWindow({
                            content: 'Di chuyển để định vị'
                        });
                        infowindow.open(map, marker);

                        google.maps.event.addListener(marker, 'dragend', function () {
                            geocodePosition(marker.getPosition());
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
                                        console.log(JSON.stringify($scope.position))
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
                    }
                });

                // XAY DUNG TAI XE
                var refDriver = firebase.database().ref("drivers").orderByChild("status").equalTo(0).limitToFirst(10);//limitToFirst: lay n dua dau tien, toLast lay n dua cuoi cung
                var driverList = $firebaseArray(refDriver);//real time

                driverList.$loaded().then(function () {
                    $scope.markerDrivers = [10];
                    
                    for (var i = 0; i < driverList.length; i++) {
                        $scope.markerDrivers[i] = new google.maps.Marker(
                            {
                                map: map,
                                icon: "/img/car.png",
                                label: { text: driverList[i].ten_nv, color: "white", fontWeight: "bold" },
                                draggable: false,
                                animation: google.maps.Animation.DROP,
                                position: JSON.parse(driverList[i].toa_do)
                            });
                            $scope.markerDrivers[i].setMap(map);
                    }
                    $interval(function(){console.log(driverList);
                        var list = driverList;
                        for (var i = 0; i < driverList.length; i++) {
                            var newLatLng = new google.maps.LatLng(JSON.parse(driverList[i].toa_do).lat, JSON.parse(driverList[i].toa_do).lng);                            
                            $scope.markerDrivers[i].setPosition(newLatLng);
                        }
                    }, 5000)
                    // To iterate the key/value pairs of the object, use angular.forEach()
                    // angular.forEach(driverList, function (value, key) {
                    //     var markerDriver = new google.maps.Marker(
                    //         {
                    //             map: map,
                    //             icon: "/img/car.png",
                    //             label: { text: value.ten_nv, color: "white", fontWeight: "bold" },
                    //             draggable: false,
                    //             animation: google.maps.Animation.DROP,
                    //             position: JSON.parse(value.toa_do)
                    //         });
                    //     markerDriver.setMap(map);
                    // });
                });
            });
        } else {
            $location.path('404');
        }
    });

    $scope.savePosition = function () {
        firebase.database().ref("booking").child(id).update({
            xuat_phat_toa_do: JSON.stringify($scope.position),
            status: 1//da duoc dinh vi
        }).then(function () {
            helper.popup.info({ title: "Thông báo", message: "Cập nhật tọa độ thành công", close: function () { return; } });
        }).catch(function (error) {
            helper.popup.info({ title: "Lỗi", message: "Cập nhật tọa độ thất bại", close: function () { return; } });
        });
    }
}