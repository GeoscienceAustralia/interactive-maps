/* global angular, $ */
(function () {
    "use strict";

    var app = angular.module('interactiveMaps.tools.distanceToBoundary', [ 'interactiveMaps.services' ]);

    app.controller('distanceToBoundaryToggleController', [ '$scope', '$timeout', 'distanceToBoundaryHelperService', 'toolService',
        function ($scope, $timeout, distanceToBoundaryHelperService, toolService) {
            var tool;
            $scope.markerLayerName = "distanceMeasureMarkers";
            $scope.polyLineLayerName = "distanceMeasurePolyLine";
            $scope.distanceBoundaryActive = false;

            $scope.$on('distanceBoundaryToggleReady', function (event, args) {
                $scope.distanceBoundaryToggleReady = args;
                tool = toolService.createSimpleTool('distanceBoundary', 'distanceBoundary', function () {
                    return $scope.distanceBoundaryToggleReady;
                }, function () {
                    return $scope.distanceBoundaryActive;
                }, function (toolbarScope, toolbarController) {
                    $scope.toolParentScope = toolbarScope;
                    $scope.toolParentController = toolbarController;
                });
                $scope.$emit('registerTool', tool);
            });

            $scope.$on("distanceDialogReady", function (event, args) {
                $scope.distanceMeasureDialogController = args;
            });

            $scope.distanceMeasureOn = function () {
                $scope.distanceBoundaryActive = true;
                $scope.toolParentController.activateToggle(tool);
            };

            $scope.distanceMeasureOff = function () {
                $scope.distanceBoundaryActive = false;
                $scope.distanceToBoundaryReset();
                $scope.toolParentController.deactivateToggle(tool);
            };

            $scope.distanceMeasure = function (e, layerId) {
                if (!$scope[$scope.$parent.tool.id].hasResult && !$scope[$scope.$parent.tool.id].waitingForResponse) {
                    // Check if a marker exists, if not add one
                    if ($scope.mapController.getMarkerCountForLayerName($scope.markerLayerName) > 0) {
                        distanceToBoundaryHelperService.resetTemporaryLayers($scope.mapController);
                    }
                    createMarkerFromEvent(e);
                }
            };

            var createMarkerFromEvent = function (e) {
                // Setup the args from the map config
                var args = {
                    width: $scope.$parent.$parent.tool.config.markerWidth,
                    height: $scope.$parent.$parent.tool.config.markerHeight
                };

                // Creates the map marker
                distanceToBoundaryHelperService.createMapMarker($scope.mapController, e,
                    $scope.$parent.$parent.tool.config.markerUrl, args);

                // Convert the screen pixels to the displayed projection datum from the config
                var lonLat = $scope.mapController.getLonLatFromPixel(e.x, e.y);
                // Bind the transformed lat and lon to the scope
                $timeout(function () {
                    $scope[tool.getNamespace()].dialogCriteriaLat = lonLat.lat.toFixed(3);
                    $scope[tool.getNamespace()].dialogCriteriaLon = lonLat.lon.toFixed(3);

                    // Bind for DMS as well
                    var latDms = distanceToBoundaryHelperService.convertDDToDMS($scope[$scope.$parent.tool.id].dialogCriteriaLat);
                    var lonDms = distanceToBoundaryHelperService.convertDDToDMS($scope[$scope.$parent.tool.id].dialogCriteriaLon);

                    $scope[tool.getNamespace()].dialogCriteriaLonDegrees = lonDms[0];
                    $scope[tool.getNamespace()].dialogCriteriaLonMinutes = lonDms[1];
                    $scope[tool.getNamespace()].dialogCriteriaLonSeconds = lonDms[2];
                    $scope[tool.getNamespace()].dialogCriteriaLatDegrees = latDms[0];
                    $scope[tool.getNamespace()].dialogCriteriaLatMinutes = latDms[1];
                    $scope[tool.getNamespace()].dialogCriteriaLatSeconds = latDms[2];
                });
            };

            $scope.distanceToBoundaryReset = function () {
                distanceToBoundaryHelperService.resetTemporaryLayers($scope.mapController);
                $timeout(function () {
                    $scope[tool.getNamespace()].dialogCriteriaLat = "";
                    $scope[tool.getNamespace()].dialogCriteriaLon = "";
                    $scope[tool.getNamespace()].dialogCriteriaLonDegrees = "";
                    $scope[tool.getNamespace()].dialogCriteriaLonMinutes = "";
                    $scope[tool.getNamespace()].dialogCriteriaLonSeconds = "";
                    $scope[tool.getNamespace()].dialogCriteriaLatDegrees = "";
                    $scope[tool.getNamespace()].dialogCriteriaLatMinutes = "";
                    $scope[tool.getNamespace()].dialogCriteriaLatSeconds = "";
                    $scope[tool.getNamespace()].hasResult = false;
                    $scope[tool.getNamespace()].convertCoordsToDms = false;
                });
            };
        } ]);

    app.controller('distanceToBoundaryPanelController', [ '$scope', '$timeout', 'distanceToBoundaryHelperService', 'MeasureDistanceService',
        function ($scope, $timeout, distanceToBoundaryHelperService, MeasureDistanceService) {
            $scope.boundaries = $scope.$parent.$parent.tool.config.boundaries;

            $scope.selectedBoundary = 0;

            $scope.drawDistanceOnMap = function (data) {
                distanceToBoundaryHelperService.drawPolyLine($scope.mapController, data.value.features[0]);
            };

            // Updates the marker position on the screen
            $scope.updateMarker = function () {
                var latCriteria = "";
                var lonCriteria = "";

                if ($scope[$scope.$parent.tool.id].convertCoordsToDms) {
                    latCriteria = distanceToBoundaryHelperService.convertDMSToDD($scope[$scope.$parent.tool.id].dialogCriteriaLatDegrees,
                        $scope[$scope.$parent.tool.id].dialogCriteriaLatMinutes, $scope[$scope.$parent.tool.id].dialogCriteriaLatSeconds);
                    lonCriteria = distanceToBoundaryHelperService.convertDMSToDD($scope[$scope.$parent.tool.id].dialogCriteriaLonDegrees,
                        $scope[$scope.$parent.tool.id].dialogCriteriaLonMinutes, $scope[$scope.$parent.tool.id].dialogCriteriaLonSeconds);
                } else {
                    latCriteria = $scope[$scope.$parent.tool.id].dialogCriteriaLat;
                    lonCriteria = $scope[$scope.$parent.tool.id].dialogCriteriaLon;
                }

                var args = {
                    width: $scope.$parent.$parent.tool.config.markerWidth,
                    height: $scope.$parent.$parent.tool.config.markerHeight
                };

                var mapInstance = $scope.mapController.getMapInstance();

                // We must convert the user entered coordinates 4326 to the displayed projection
                var lonlat = new OpenLayers.LonLat(lonCriteria, latCriteria);
                lonlat.transform(mapInstance.displayProjection, mapInstance.projection);

                // We also need to get the pixel value of the coordiantes to pass to the service
                distanceToBoundaryHelperService.createMapMarker($scope.mapController, $scope.mapController.getPixelFromLonLat(lonlat.lon, lonlat.lat),
                    $scope.$parent.$parent.tool.config.markerUrl, args);
            };

            // Switches between decimal degrees and degrees minutes seconds
            $scope.changeCoordsFormat = function () {
                if ($scope[$scope.$parent.tool.id].convertCoordsToDms) {
                    if ($scope[$scope.$parent.tool.id].dialogCriteriaLat != null > 0 && $scope[$scope.$parent.tool.id].dialogCriteriaLon != null) {
                        var latDms = distanceToBoundaryHelperService.convertDDToDMS($scope[$scope.$parent.tool.id].dialogCriteriaLat);
                        var lonDms = distanceToBoundaryHelperService.convertDDToDMS($scope[$scope.$parent.tool.id].dialogCriteriaLon);

                        $scope[$scope.$parent.tool.id].dialogCriteriaLonDegrees = lonDms[0];
                        $scope[$scope.$parent.tool.id].dialogCriteriaLonMinutes = lonDms[1];
                        $scope[$scope.$parent.tool.id].dialogCriteriaLonSeconds = lonDms[2];
                        $scope[$scope.$parent.tool.id].dialogCriteriaLatDegrees = latDms[0];
                        $scope[$scope.$parent.tool.id].dialogCriteriaLatMinutes = latDms[1];
                        $scope[$scope.$parent.tool.id].dialogCriteriaLatSeconds = latDms[2];
                    }
                } else {
                    if ($scope[$scope.$parent.tool.id].dialogCriteriaLatDegrees != null && $scope[$scope.$parent.tool.id].dialogCriteriaLatMinutes != null &&
                        $scope[$scope.$parent.tool.id].dialogCriteriaLatSeconds != null && $scope[$scope.$parent.tool.id].dialogCriteriaLonDegrees != null &&
                        $scope[$scope.$parent.tool.id].dialogCriteriaLonMinutes != null && $scope[$scope.$parent.tool.id].dialogCriteriaLonSeconds != null) {
                        $scope[$scope.$parent.tool.id].dialogCriteriaLat = distanceToBoundaryHelperService.convertDMSToDD($scope[$scope.$parent.tool.id].dialogCriteriaLatDegrees,
                            $scope[$scope.$parent.tool.id].dialogCriteriaLatMinutes, $scope[$scope.$parent.tool.id].dialogCriteriaLatSeconds);
                        $scope[$scope.$parent.tool.id].dialogCriteriaLon = distanceToBoundaryHelperService.convertDMSToDD($scope[$scope.$parent.tool.id].dialogCriteriaLonDegrees,
                            $scope[$scope.$parent.tool.id].dialogCriteriaLonMinutes, $scope[$scope.$parent.tool.id].dialogCriteriaLonSeconds);
                    }
                }
            };

            // Reset function after a search is completed
            $scope.distanceToBoundaryReset = function () {
                distanceToBoundaryHelperService.resetTemporaryLayers($scope.mapController);
                $scope[$scope.$parent.tool.id].hasResult = false;
                $scope.hasError = false;
                $scope.selectedBoundary = 0;
                $scope.convertCoordsToDms = false;
            };

            // Set the validation to true for all the input boxes
            $scope.$on($scope.$parent.tool.id + 'Deactivate', function () {
                $timeout(function () {
                    $scope.distanceToBoundaryForm.latInput.$setValidity('latValid', true);
                    $scope.distanceToBoundaryForm.lonInput.$setValidity('lonValid', true);
                    $scope.distanceToBoundaryForm.latDegreesInput.$setValidity('latDegreesValid', true);
                    $scope.distanceToBoundaryForm.latMinutesInput.$setValidity('latMinutessValid', true);
                    $scope.distanceToBoundaryForm.latSecondsInput.$setValidity('latSecondsValid', true);
                    $scope.distanceToBoundaryForm.lonDegreesInput.$setValidity('lonDegreesValid', true);
                    $scope.distanceToBoundaryForm.lonMinutesInput.$setValidity('lonMinutessValid', true);
                    $scope.distanceToBoundaryForm.lonSecondsInput.$setValidity('lonSecondsValid', true);
                });
            });

            // On submit build the search criteria object and call the measure distance service
            $scope.submitSearchDistance = function () {
                $scope[$scope.$parent.tool.id].hasResult = false;
                $scope[$scope.$parent.tool.id].waitingForResponse = true;
                $scope.hasError = false;

                var latCriteria = "";
                var lonCriteria = "";

                if ($scope[$scope.$parent.tool.id].convertCoordsToDms) {
                    latCriteria = distanceToBoundaryHelperService.convertDMSToDD($scope[$scope.$parent.tool.id].dialogCriteriaLatDegrees,
                        $scope[$scope.$parent.tool.id].dialogCriteriaLatMinutes, $scope[$scope.$parent.tool.id].dialogCriteriaLatSeconds);
                    lonCriteria = distanceToBoundaryHelperService.convertDMSToDD($scope[$scope.$parent.tool.id].dialogCriteriaLonDegrees,
                        $scope[$scope.$parent.tool.id].dialogCriteriaLonMinutes, $scope[$scope.$parent.tool.id].dialogCriteriaLonSeconds);
                } else {
                    latCriteria = $scope[$scope.$parent.tool.id].dialogCriteriaLat;
                    lonCriteria = $scope[$scope.$parent.tool.id].dialogCriteriaLon;
                }

                // Build the search criteria
                var searchCriteria = {
                    datum: "4326",
                    geometryType: "esriGeometryPoint",
                    latitude: latCriteria,
                    longitude: lonCriteria,
                    url: $scope.boundaries[$scope.selectedBoundary].url
                };

                // Calls the Measure Distance Service
                MeasureDistanceService.distanceToAustralianCoast(searchCriteria).then(function (data) {
                    $scope.resultData = data;

                    // Get the DMS values
                    var latDms = distanceToBoundaryHelperService.convertDDToDMS(latCriteria);
                    var lonDms = distanceToBoundaryHelperService.convertDDToDMS(lonCriteria);

                    // Format the coordinates
                    $scope.dmsFormattedLat = distanceToBoundaryHelperService.getFormattedDMS(latDms[0], latDms[1], latDms[2], "lat");
                    $scope.dmsFormattedLon = distanceToBoundaryHelperService.getFormattedDMS(lonDms[0], lonDms[1], lonDms[2], "lon");

                    // Convert the result to Nautical miles
                    var nauticalMiles = data.value.features[0].attributes.Distance;
                    nauticalMiles = nauticalMiles.split(" ")[0] * 0.539956803;
                    $scope.resultInNauticalMiles = nauticalMiles.toFixed(3) + " nmi";

                    $scope[$scope.$parent.tool.id].hasResult = true;
                    $scope[$scope.$parent.tool.id].waitingForResponse = false;
                    $scope.drawDistanceOnMap(data);
                }, function (error) {
                    $scope[$scope.$parent.tool.id].waitingForResponse = false;
                    $scope[$scope.$parent.tool.id].hasError = true;
                    $scope.errorMessage = error.jobStatus;
                });

                // Reset all the fields
                $scope.resetSearchDistance = function () {
                    $scope[$scope.$parent.tool.id].dialogCriteriaLat = "";
                    $scope[$scope.$parent.tool.id].dialogCriteriaLon = "";
                    $scope[$scope.$parent.tool.id].dialogCriteriaLonDegrees = "";
                    $scope[$scope.$parent.tool.id].dialogCriteriaLonMinutes = "";
                    $scope[$scope.$parent.tool.id].dialogCriteriaLonSeconds = "";
                    $scope[$scope.$parent.tool.id].dialogCriteriaLatDegrees = "";
                    $scope[$scope.$parent.tool.id].dialogCriteriaLatMinutes = "";
                    $scope[$scope.$parent.tool.id].dialogCriteriaLatSeconds = "";
                    $scope.mapController.removeLayersByName("distanceMeasureMarkers");
                    $scope.mapController.removeLayersByName("distanceMeasurePolyLine");
                    $scope[$scope.$parent.tool.id].hasResult = false;
                    $scope[$scope.$parent.tool.id].convertCoordsToDms = false;
                    $scope.hasError = false;
                };
            };
        } ]);

    app.service('distanceToBoundaryHelperService', [ function () {
        var markerLayerName = "distanceMeasureMarkers";
        var polyLineLayerName = "distanceMeasurePolyLine";
        return {
            // Clear the layers
            resetTemporaryLayers: function (mapController) {
                mapController.removeLayersByName(markerLayerName);
                mapController.removeLayersByName(polyLineLayerName);
            },
            // Draws the line on the map from the marker to the boundary
            drawPolyLine: function (mapController, feature) {
                var points = [];

                points.push({
                    lat: feature.geometry.paths[0][0][1],
                    lon: feature.geometry.paths[0][0][0]
                });

                points.push({
                    lat: feature.geometry.paths[0][1][1],
                    lon: feature.geometry.paths[0][1][0]
                });

                mapController.drawPolyLine(points, polyLineLayerName);
            },
            createMapMarker: function (mapController, coords, markerUrl, args) {
                // Clear the existing marker
                mapController.removeLayersByName(markerLayerName);

                // Create a map marker
                mapController.setMapMarker(coords,
                    markerLayerName,
                    markerUrl,
                    args);
            },
            // Convert decimal degrees to degrees minutes seconds
            convertDDToDMS: function (dd) {
                var deg = dd | 0;
                var frac = Math.abs(dd - deg);
                var min = (frac * 60) | 0;
                var sec = frac * 3600 - min * 60;

                var convertedCoords = [];
                convertedCoords.push(deg);
                convertedCoords.push(min);
                convertedCoords.push(sec.toFixed(1));

                return convertedCoords;
            },
            // Convert degrees minutes seconds to decimal degrees
            convertDMSToDD: function (degrees, minutes, seconds) {
                var decimalDegrees = Math.abs(degrees) + (Math.abs(minutes) / 60) + (Math.abs(seconds) / 3600);

                if (degrees < 0) {
                    decimalDegrees = decimalDegrees * -1;
                }

                return decimalDegrees.toFixed(3);
            },
            // Returns a formatted lat or lon 81°28'37.2" E coordType(lat or lon)
            getFormattedDMS: function (degrees, minutes, seconds, coordType) {
                var direction = "";

                if (coordType == "lon") {
                    if (degrees < 0) {
                        direction = "W";
                    } else if (degrees > 0) {
                        direction = "E";
                    }
                } else if (coordType == "lat") {
                    if (degrees < 0) {
                        direction = "S";
                    } else if (degrees > 0) {
                        direction = "N";
                    }
                }

                return degrees + '\u00B0' + minutes + "'" + seconds + "\" " + direction;
            }
        };
    }]);
})();