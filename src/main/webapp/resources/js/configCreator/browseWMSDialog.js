/* global angular, $ */
(function () {
    "use strict";

    var app = angular.module('interactiveMaps.configCreator.browseWMSDialog', []);

    app.controller('browseWMSDialog', ['$scope', '$modalInstance', 'layers', 'layerUrl', '$timeout', '$window', 'existingLayers',
        function ($scope, $modalInstance, layers, layerUrl, $timeout, $window, existingLayers) {
            $scope.layers = layers;
            $scope.selectedLayers = [];
            $scope.originalLayers = '';

            $scope.resolveSelectedLayerNames = function () {
                var result = '';
                for (var i = 0; i < $scope.selectedLayers.length; i++) {
                    if (i === $scope.selectedLayers.length - 1) {
                        result += $scope.selectedLayers[i].name;
                    } else {
                        result += $scope.selectedLayers[i].name + ',';
                    }
                }
                return result;
            };

            $scope.clearLayer = function () {
                var mapController = $scope.WMSLayerMapController;
                var existingLayers = mapController.getLayers();


                if (existingLayers.length === 2) {
                    $scope.unregisterLayerLoadingEvent();
                    mapController.removeLayerById(existingLayers[1].id);
                }
            };

            $scope.recreateLayer = function () {
                $scope.clearLayer();
                var mapController = $scope.WMSLayerMapController;
                var myLayer = {
                    mapType: "WMS",
                    visibility: true,
                    layerName: 'temp layer name',
                    layerUrl: layerUrl,
                    layers: $scope.resolveSelectedLayerNames(),
                    opacity: 1.0
                };
                var myNewLayer = mapController.createLayer(myLayer);
                mapController.addLayer(myNewLayer);
                $scope.registerLayerLoadingEvent();
            };

            $scope.registerLayerLoadingEvent = function () {
                if ($scope.selectedLayers.length == 0) {
                    return;
                }
                var mapController = $scope.WMSLayerMapController;
                var tempLayerId = mapController.getLayers()[1].id;
                mapController.registerLayerEvent(
                    tempLayerId,
                    "tileloadstart", loadStart);
                mapController.registerLayerEvent(
                    tempLayerId,
                    "tileloadend", loadEnd);
            };

            $scope.unregisterLayerLoadingEvent = function () {
                var mapController = $scope.WMSLayerMapController;
                var tempLayerId = mapController.getLayers()[1].id;
                console.log(tempLayerId);
                mapController.unRegisterLayerEvent(
                    tempLayerId,
                    "tileloadstart", loadStart);
                mapController.unRegisterLayerEvent(
                    tempLayerId,
                    "tileloadend", loadEnd);
            };
            $scope.loadingNumberOfTiles = 0;
            function loadStart() {
                $scope.loadingNumberOfTiles++;
                $timeout(function () {
                    $scope.tempMapLoading = true;
                });
            }

            function loadEnd() {
                $scope.loadingNumberOfTiles--;
                $timeout(function () {
                    if ($scope.loadingNumberOfTiles == 0) {
                        $scope.tempMapLoading = false;
                    }
                });
            }

            $scope.resetLayer = function () {
                if ($window.confirm('Are you sure you want to reset selected layers?')) {
                    $scope.clearLayer();
                    $timeout(function () {
                        $scope.selectedLayers = [];
                    });
                }
            };

            $scope.sortableOptions = {
                stop: function (e, ui) {
                    $scope.recreateLayer();
                }
            };

            $scope.cancel = function () {
                $modalInstance.close($scope.originalLayers);
            };

            $scope.$on('mapControllerReady', function (event, mapController) {
                $scope.WMSLayerMapController = mapController;
                if (existingLayers != null) {
                    $timeout(function () {
                        $scope.recreateLayer();
                    }, 100);
                }
            });

            $scope.addToWMSLayer = function (layer) {
                $scope.selectedLayers.push(layer);
                layer.isSelected = true;
                $scope.recreateLayer();
            };

            $scope.removeWMSLayer = function (selectedLayerIndex) {
                $scope.selectedLayers[selectedLayerIndex].isSelected = false;
                updateLayerSelectedFlag();
                $timeout(function () {
                    $scope.selectedLayers.splice(selectedLayerIndex, 1);
                    if ($scope.selectedLayers.length == 0) {
                        $scope.tempMapLoading = false;
                    }
                    $scope.recreateLayer();
                });
            };

            function updateLayerSelectedFlag() {
                for (var j = 0; j < layers.length; j++) {
                    var foundLayer = false;
                    for (var i = 0; i < $scope.selectedLayers.length; i++) {
                        if (layers[j].name === $scope.selectedLayers[i].name) {
                            foundLayer = true;
                            layers[j].isSelected = $scope.selectedLayers[i].isSelected || false;
                            break;
                        }
                    }
                    if (!foundLayer) {
                        layers[j].isSelected = false;
                    }
                }
            }

            $scope.ok = function () {
                $modalInstance.close($scope.resolveSelectedLayerNames());
            };

            if (existingLayers != null && existingLayers != '') {
                var parsedLayers = existingLayers.split(',');
                for (var i = 0; i < parsedLayers.length; i++) {
                    $scope.selectedLayers.push({name: parsedLayers[i], isSelected: true });
                    for (var j = 0; j < layers.length; j++) {
                        if (layers[j].name === parsedLayers[i]) {
                            layers[j].isSelected = true;
                        }
                    }
                }
                $scope.originalLayers = $scope.resolveSelectedLayerNames();

            }


            $timeout(function () {
                $scope.delayReady = true;
            });


        }]);

    app.filter('replaceUnderscore', function () {
        return function (input) {
            return input.replace(/_/g, ' ');
        };
    });
})();