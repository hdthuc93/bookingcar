'use-strict'
var app = angular.module("bookingCar");

app.controller("locateCtrl", ['$scope', '$rootScope', 'helper', '$location', '$http', locateCtrl]);
function locateCtrl($scope, $rootScope, helper, $location, $http) {
    function init() {
        $scope.data = null;
    }
    init();

    function locateMap() {
        var myCenter = new google.maps.LatLng(10.791424, 106.6972366);
        var mapCanvas = document.getElementById("locateMap");
        var mapOptions = { center: myCenter, zoom: 16 };
        var map = new google.maps.Map(mapCanvas, mapOptions);
        var marker = new google.maps.Marker(
            {
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: { lat: 10.791424, lng: 106.6972366 }
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
                        alert("Bạn vừa thay đổi thành: " + results[0].formatted_address);
                    }
                    else {
                        alert('Cannot determine address at this location.' + status);
                    }
                }
                );
        }

    }

    locateMap();


}