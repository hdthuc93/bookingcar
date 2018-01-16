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
        lat: parseFloat("10.76"+ Math.floor(1000000 * Math.random())),
        lng: parseFloat("106.65333"+ Math.floor(100000 * Math.random())),
    }

    //Khi load duoc 1 driver
    currentDriver.$loaded().then(function () {
        angular.forEach(currentDriver, function (value, key) {
            ref.child(value.$id).remove();
        });
        var newData = ref.push();
        newData.set({
            id: $rootScope.userData.car_id,
            toa_do: JSON.stringify($scope.position),
            status: 0,
            ten_nv: $rootScope.userData.name
        });

        //Gui vi tri moi 5s
        $interval(function(){
            newData.set({
                id: $rootScope.userData.car_id,
                toa_do: JSON.stringify($scope.position),
                status: 0,
                ten_nv: $rootScope.userData.name
            });
        }, 5000)
    });


    function driverMap() {
        var myCenter = new google.maps.LatLng($scope.position.lat,$scope.position.lng);
        var mapCanvas = document.getElementById("driverMap");
        var mapOptions = { center: myCenter, zoom: 16 };
        var map = new google.maps.Map(mapCanvas, mapOptions);
        // var markerCustomer = new google.maps.Marker(
        //     {
        //         map: map,
        //         icon: "/img/client.png",
        //         draggable: false,
        //         animation: google.maps.Animation.DROP,
        //         position: $scope.position
        //     });
        // markerCustomer.setMap(map);
        // var infowindow = new google.maps.InfoWindow({
        //     content: 'Điểm đón'
        // });
        //        infowindow.open(map, markerCustomer);


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
            //geocodePosition(markerDriver.getPosition());
        });

        function geocodePosition(pos) {
            geocoder = new google.maps.Geocoder();
            geocoder.geocode
                ({
                    latLng: pos
                },
                function (results, status) {
                    console.log(results)
                    if (status == google.maps.GeocoderStatus.OK) {
                        alert("Bạn vừa thay đổi thành: " + results[0].formatted_address);
                    }
                    else {
                        alert('Cannot determine address at this location.' + status);
                    }
                }
                );
        }

    }

    driverMap();
}