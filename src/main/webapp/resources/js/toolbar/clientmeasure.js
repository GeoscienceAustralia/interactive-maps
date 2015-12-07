/* global angular, $ */
(function () {
    "use strict";

    var app = angular.module('interactiveMaps.tools.clientMeasure', [ 'interactiveMaps.services' ]);
    app.controller('clientMeasureController', [ '$scope', '$timeout', 'toolService', function ($scope, $timeout, toolService) {
        var tool;
        $scope.measureToolToggleOn = function () {
            $scope.measureToggleActive = true;
            $scope.toolParentScope[tool.getNamespace()].totalClientMeasurement = "0.000";
            $scope.toolParentScope[tool.getNamespace()].totalClientMeasurementUnits = "m";
            $scope.toolParentController.activateToggle(tool);
        };

        $scope.measureToolToggleOff = function () {
            $scope.measureToggleActive = false;
            $scope.toolParentController.deactivateToggle(tool);
            $scope.toolParentScope[tool.getNamespace()].initialPoint = null;
            $scope.toolParentScope[tool.getNamespace()].totalClientMeasurement = null;
            $scope.toolParentScope[tool.getNamespace()].totalClientMeasurementUnits = null;
            $scope.toolParentScope[tool.getNamespace()].distances = null;
            distances = [];
            temp = [];
        };

        $scope.$on('measureLineToggleReady', function (event, args) {
            $scope.measureLineToggleController = args;
            tool = toolService.createSimpleTool('clientMeasure', 'clientMeasure', function () {
                return $scope.measureLineToggleController;
            }, function () {
                return $scope.measureToggleActive;
            }, function (toolbarScope, toolbarController) {
                $scope.toolParentScope = toolbarScope;
                $scope.toolParentController = toolbarController;
            });
            $scope.$emit('registerTool', tool);
        });

        $scope.clientDistanceFinish = function (event) {
            $scope.restart = true;
            $scope.toolParentScope[tool.getNamespace()].totalClientMeasurement = event.measurement.toFixed(3);
            $scope.toolParentScope[tool.getNamespace()].totalClientMeasurementUnits = event.units;
            $scope.toolParentScope.$apply();
        };

        var distances = [];
        var temp = [];

        $scope.clientDistanceUpdate = function (event) {
            if ($scope.restart) {
                temp = [];
                distances = [];
                $scope.restart = false;
            }
            temp.push(event);
            var latestEvent = temp[temp.length - 1];
            var latestPoint = latestEvent.geoJson.coordinates[latestEvent.geoJson.coordinates.length - 1];
            if (temp.length > 1) {
                var previousEvent = temp[temp.length - 2];
                var lastDistance;
                //OpenLayers tries to be helpful with units and measurements
                if (previousEvent.units === "m" && latestEvent.units === "km") {
                    lastDistance = (latestEvent.measurement) - previousEvent.measurement / 1000;
                } else {
                    lastDistance = latestEvent.measurement - previousEvent.measurement;
                }
                distances.push({
                    measurement: lastDistance,
                    units: event.units,
                    lonLat: { lon: latestPoint[0].toFixed(3), lat: latestPoint[1].toFixed(3)}
                });
            } else {
                $scope.toolParentScope[tool.getNamespace()].initialPoint = {
                    lon: latestPoint[0].toFixed(3), lat: latestPoint[1].toFixed(3)
                };
            }
            $scope.toolParentScope[tool.getNamespace()].totalClientMeasurement = event.measurement.toFixed(3);
            $scope.toolParentScope[tool.getNamespace()].totalClientMeasurementUnits = event.units;
            $scope.toolParentScope[tool.getNamespace()].distances = distances;
            $scope.toolParentScope.$apply();
        };

    } ]);
    app.controller('clientMeasurePanelController', [ '$scope', function ($scope) {

    } ]);
})();