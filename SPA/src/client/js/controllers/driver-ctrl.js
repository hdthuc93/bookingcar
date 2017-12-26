'use-strict'
var app = angular.module("bookingCar");

app.controller("driverCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', driverCtrl]);
function driverCtrl($scope, $rootScope, helper, $location, $http) {
    function init() {
        $scope.data = null;
    }
    init();

    function driverMap() {
        var myCenter = new google.maps.LatLng(10.791424, 106.6972366);
        var mapCanvas = document.getElementById("driverMap");
        var mapOptions = { center: myCenter, zoom: 16 };
        var map = new google.maps.Map(mapCanvas, mapOptions);
        var markerCustomer = new google.maps.Marker(
            {
                map: map,
                // icon: "https://maps.google.com/mapfiles/kml/shapes/man.png",
                icon: "/img/client.png",
                //label:"AAA",
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: { lat: 10.791424, lng: 106.6972366 }
            });
        markerCustomer.setMap(map);

        var markerDriver = new google.maps.Marker(
            {
                map: map,
                // icon: "https://maps.google.com/mapfiles/kml/shapes/bus.png",
                icon: "/img/car.png",
                //label:"AAA",
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: { lat: 10.789410, lng: 106.6952366 }
            });
        markerDriver.setMap(map);

        var infowindow = new google.maps.InfoWindow({
            content: 'Điểm đón'
        });
        infowindow.open(map, markerCustomer);

        google.maps.event.addListener(markerCustomer, 'dragend', function () {
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