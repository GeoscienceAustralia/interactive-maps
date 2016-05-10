/*global angular, $ */
(function () {
    "use strict";

    var app = angular.module('interactiveMaps.tools.addLayer', [ 'interactiveMaps.services' ]);
    app.controller('addLayerToggleController', [ '$scope', '$timeout', 'toolService', function ($scope, $timeout, toolService) {
        var tool;
        $scope.addLayerActive = false;

        $scope.$on('addLayerToggleReady', function (event, args) {
            $scope.addLayerToggleReady = args;
            tool = toolService.createSimpleTool('addLayer', 'addLayer', function () {
                return $scope.addLayerToggleReady;
            }, function () {
                return $scope.addLayerActive;
            }, function (toolbarScope, toolbarController) {
                $scope.toolParentScope = toolbarScope;
                $scope.toolParentController = toolbarController;
            });
            $scope.$emit('registerTool', tool);
        });

        $scope.addLayerToggleOn = function () {
            $scope.addLayerActive = true;
            $scope.toolParentController.activateToggle(tool);
        };

        $scope.addLayerToggleOff = function () {
            $scope.addLayerActive = false;
            $scope.toolParentController.deactivateToggle(tool);
        };
    } ]);

    app.controller('addLayerPanelController', [ '$scope', '$http', 'fuzzySearch', function ($scope, $http, fuzzySearch) {
        $scope.layerClass = "addLayer";

        $scope.searchLayerSorter = function () {
        };

        $scope.initialiseImmutableLayersList = function () {
            var layers = [];

            for (var i = 0; i < $scope.geoConfig.layerMaps.length; i++) {
                layers.push($scope.geoConfig.layerMaps[i]);
            }

            $scope.immutableLayers = layers;
        };

        // Filter out all the layers that are defaulted in layerMaps config
        $scope.filterLayers = function (layer) {
            for (var i = 0; i < $scope.geoConfig.layerMaps.length; i++) {
                if ($scope.geoConfig.layerMaps[i].name === layer.name && $scope.immutableLayers == null) {
                    return false;
                } else if ($scope.geoConfig.layerMaps[i].name === layer.name && $scope.immutableLayers != null) {
                    for (var j = 0; j < $scope.immutableLayers.length; j++) {
                        if ($scope.immutableLayers[j].name === layer.name) {
                            return false;
                        }
                    }
                }
            }
            return true;
        };

        // Get the master layer list and filter out the layers already configured in layerMaps and addLayerMaps so
        // there cannot be duplicates
        $http.get('api/config/master-layer-list.json').success(function (response) {
            $scope.initialiseMasterList(response)
        }).error(function (data, status) { /* data, status, headers, config */
            throw new Error("Unable to load master layers list. Error - " + status);
        });

        $scope.initialiseMasterList = function (response) {
            var layers = response.layers;

            for (var layerMapsIndex = 0; layerMapsIndex < $scope.geoConfig.layerMaps.length; layerMapsIndex++) {
                for (var masterLayersIndex = 0; masterLayersIndex < layers.length; masterLayersIndex++) {
                    if ($scope.geoConfig.layerMaps[layerMapsIndex].name === layers[masterLayersIndex].name) {
                        layers.splice(masterLayersIndex, 1);
                    }
                }
            }

            for (var i = 0; i < $scope.geoConfig.addLayerMaps.length; i++) {
                for (var j = 0; j < layers.length; j++) {
                    if ($scope.geoConfig.addLayerMaps[i].name === layers[j].name) {
                        layers.splice(j, 1);
                    }
                }
            }

            $scope.layerCriteria = layers;
        };

        $scope.searchScore = function (a) {
            var aScore = 0;
            var searchText = $scope.selected;
            if (a.name.toUpperCase() === searchText.toUpperCase()) {
                aScore += 10 * 100;
            } else if (a.name.match(new RegExp('^' + searchText + '\\b', 'i'))) {
                aScore += 8 * 100;
            } else if (a.name.match(new RegExp('\\b' + searchText + '\\b', 'i'))) {

                aScore += 4 * 100;
            } else if (a.name.match(new RegExp('^' + searchText, 'i'))) {

                aScore += 2 * 100;
            }

            if (a.name.toUpperCase().indexOf(searchText.toUpperCase()) === -1) {
                aScore -= 10 * 100;
            }

            return aScore * -1;
        };

        // Remove a layer from the layers panel
        $scope.addRemoveLayer = function (layer) {
            //Create an immutable list of layers from the original config
            if ($scope.immutableLayers == null) {
                $scope.initialiseImmutableLayersList();
            }

            // Set active flag to control the icons
            for (var addLayerIndex = 0; addLayerIndex < $scope.geoConfig.addLayerMaps.length; addLayerIndex++) {
                if ($scope.geoConfig.addLayerMaps[addLayerIndex].name === layer.name) {
                    if ($scope.geoConfig.addLayerMaps[addLayerIndex].isActive == null) {
                        $scope.geoConfig.addLayerMaps[addLayerIndex].isActive = true;
                    } else {
                        $scope.geoConfig.addLayerMaps[addLayerIndex].isActive = $scope.geoConfig.addLayerMaps[addLayerIndex].isActive != true;
                    }
                }
            }

            // If the layer is active remove it from the list, otherwise add it to the list
            if (layer.isActive == false) {
                var layerIndex = -1;

                for (var i = 0; i < $scope.geoConfig.layerMaps.length; i++) {
                    if ($scope.geoConfig.layerMaps[i].name === layer.name) {
                        layerIndex = i;
                    }
                }

                if (layerIndex != -1) {
                    $scope.geoConfig.layerMaps.splice(layerIndex, 1);
                }
            } else if (layer.isActive == true) {
                // Add the new layer to the first element of the array
                $scope.geoConfig.layerMaps.unshift({
                    mapType: layer.mapType,
                    name: layer.name,
                    url: layer.url,
                    extent: layer.extent,
                    layers: layer.layers,
                    metadataText: layer.metadataText,
                    ogcLinks: layer.ogcLinks,
                    opacity: layer.opacity,
                    visibility: true
                });
            }
        };

        $scope.onSelected = function (item) { /* item, model, label */
            // Create an immutable list of layers from the original config
            if ($scope.immutableLayers == null) {
                $scope.initialiseImmutableLayersList();
            }

            var layerAlreadyAdded = false;

            for (var i = 0; i < $scope.geoConfig.layerMaps.length; i++) {
                if ($scope.geoConfig.layerMaps[i].name === item.name) {
                    layerAlreadyAdded = true;
                }
            }

            if (!layerAlreadyAdded) {
                // Add the selected layer to the list of Add Layers in the tool panel
                $scope.geoConfig.addLayerMaps.push({
                    mapType: item.mapType,
                    name: item.name,
                    url: item.url,
                    extent: item.extent,
                    layers: item.layers,
                    metadataText: item.metadataText,
                    ogcLinks: item.ogcLinks,
                    opacity: item.opacity,
                    visibility: true,
                    isActive: true
                });

                // Add the new layer to the first element of the layerMaps array so it appears in the layer panel
                $scope.geoConfig.layerMaps.unshift({
                    mapType: item.mapType,
                    name: item.name,
                    url: item.url,
                    extent: item.extent,
                    layers: item.layers,
                    metadataText: item.metadataText,
                    ogcLinks: item.ogcLinks,
                    opacity: item.opacity,
                    visibility: true
                });
            }
            // Clear the search box
            $scope.selected = "";
        };

        $scope.fuzzySearch = function (layer) {
            return fuzzySearch.find($scope.selected.toLowerCase(), layer.name.toLowerCase());
        }
    } ]);
})();