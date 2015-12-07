var angular = angular || {};
var console = console || {};
var $ = $ || {};

var app = angular.module('interactiveMaps.tools.keepMapExtent', [ 'interactiveMaps.services', 'ngStorage' ]);

app.controller('keepMapExtentController', ['$scope', '$localStorage', '$timeout', '$q',
    function ($scope, $localStorage, $timeout, $q) {
        "use strict";
        $scope.eventRegistered = false;
        //Clean up and reinitialise if the map is reset.
        $scope.$on('mapResetFired', function () {
            $scope.mapController.unRegisterMapEvent('moveend', mapMoveOrZoomCallback);
            $scope.eventRegistered = false;
            $scope.keepMapExtentValWatch();
            $scope.keptMapExtentWatch();
        });

        //Update the event registration
        function registerKeepExtentEvents() {
            if ($localStorage.keepMapExtent && !$scope.eventRegistered) {
                $scope.mapController.registerMapEvent('moveend', mapMoveOrZoomCallback);
                $scope.eventRegistered = true;
                updateMapExtent();
            } else {
                if ($scope.eventRegistered) {
                    $scope.mapController.unRegisterMapEvent('moveend', mapMoveOrZoomCallback);
                    $scope.eventRegistered = false;
                }
            }
        }

        //On mapController ready, watch the values and react to changes
        $scope.$on('mapControllerReady', function () {
            //Checkbox value watch
            $scope.keepMapExtentValWatch = $scope.$watch('keepMapExtentVal', function (newVal, oldVal) {
                $localStorage.keepMapExtent = newVal;
                registerKeepExtentEvents();
            });
            //Extent value watch
            $scope.keptMapExtentWatch = $scope.$watch('keptMapExtent', function (newVal, oldVal) {
                if (newVal && newVal !== oldVal) {
                    $localStorage.keptMapExtent = $scope.keptMapExtent;
                }
            });
        });

        //If a value exists in localstorage, assign it to the scope
        if ($localStorage.keepMapExtent != null) {
            $scope.keepMapExtentVal = $localStorage.keepMapExtent;
        }
        //If a value exists in localstorage, assign it to the scope
        if ($localStorage.keptMapExtent != null) {
            $scope.keptMapExtent = $localStorage.keptMapExtent;
        }
        //Function to bind the map event to.
        var mapMoveOrZoomCallback = function (event) {
            updateMapExtent();
        };

        //Update the localstorage position for the kept map extent
        var updateMapExtent = function () {
            //Trouble binding, using timeout + $watch and always picks it up.
            $timeout(function () {
                if ($scope.mapController != null) {
                    var currentMapExtent = $scope.mapController.getCurrentMapExtent();
                    $scope.keptMapExtent = currentMapExtent || $scope.keptMapExtent;
                }
            });
        };
    }]);