/**
 * Created by u87196 on 8/09/2015.
 */

(function () {
    "use strict";

    var app = angular.module('interactiveMaps.map-position-controller', ['interactiveMaps.services']);

    app.controller('resetMapPositionController', [ '$scope',
        function ($scope) {
            $scope.setInitialExtent = function () {
                $scope.mapController.resetInitialExtent();
            };


            $scope.setCurrentLocation = function () {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var args = {
                            lat: position.coords.latitude,
                            lon: position.coords.longitude,
                            radius: 200,
                            color: '#FF0000',
                            fillOpacity: 0.2,
                            projection: 'EPSG:4326',
                            zoom: 3
                        };

                        if ($scope.mapController.getLayersByName('locationLayer') == 0) {
                            $scope.mapController.zoomTo(16);
                            $scope.mapController.setCenter(args.lat.toFixed(3) , args.lon.toFixed(3), null);
                            $scope.mapController.plotPoint('locationLayer', args);
                        }
                    }, function() {
                        handleLocationError(true, infoWindow, map.getCenter());
                    });
                } else {
                    // Browser doesn't support Geolocation
                    handleLocationError(false, infoWindow, map.getCenter());
                }
            };
        }


    ]);
})();