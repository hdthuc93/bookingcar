'use-strict'
var app = angular.module("driverApp");

app.controller("driverCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', '$firebaseObject', '$firebaseArray', driverCtrl]);
function driverCtrl($scope, $rootScope, helper, $location, $http, $firebaseObject, $firebaseArray) {
    function init() {
        $scope.data = null;
    }
    init();

    //Tao tai xe 
    var ref = firebase.database().ref("drivers");
    var currentDriver = $firebaseArray(ref.orderByChild("id").equalTo($rootScope.userData.car_id));
    $scope.position = {
        lat: parseFloat("10.75688000000"+ Math.floor(10 * Math.random())),
        lng: parseFloat("106.6809835000000"+ Math.floor(10 * Math.random())),
    }
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
            geocodePosition(markerCustomer.getPosition());
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