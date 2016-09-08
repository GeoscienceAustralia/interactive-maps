/* global angular, $ */
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.configCreator.mapLayerAccordion', [ 'interactiveMaps.services', 'geowebtoolkit.core.data-services' ]);

    app.controller('mapLayerAccordion', ['$scope', '$log', '$timeout', '$http', 'GeoMapService', 'configCreatorService', 'GeoDataService', '$modal',
        function ($scope, $log, $timeout, $http, GeoMapService, configCreatorService, GeoDataService, $modal) {

            $scope.showHideAreas = {mapLayers: {
                'search': false,
                'browse': false,
                'custom': false
            }};

            $scope.enableSearch = function () {
                $scope.showArea('mapLayers', 'search');
                $scope.clearLayerType();
            };

            $scope.enableBrowse = function () {
                $scope.showArea('mapLayers', 'browse');
                $scope.clearLayerType();
                $scope.layerMap.mapType = 'WMS';
            };

            $scope.browseWMS = function () {
                $scope.browseWMSLoading = true;
                var getCapsUrl = $scope.layerMap.url.toLowerCase().indexOf('service=wms') === -1 ? $scope.layerMap.url + '?service=wms' : $scope.layerMap.url;
                GeoDataService.getLayersByWMSCapabilities(getCapsUrl, 'olv2').then(function (layers) {
                    $scope.browseWMSLoading = false;
                    var modalInstance = $modal.open({
                        animation: true,
                        controller: 'browseWMSDialog',
                        templateUrl: 'resources/js/configCreator/browseWMSDialog.html',
                        backdrop: 'static',
                        windowClass: "browseWMS",
                        size: 'lg',
                        resolve: {
                            layers: function () {
                                return layers;
                            },
                            existingLayers: function () {
                                return $scope.layerMap.layers;
                            },
                            layerUrl: function () {
                                return $scope.layerMap.url;
                            }
                        }
                    });

                    modalInstance.result.then(function (layerNames) {
                        $scope.layerMap.layers = layerNames;
                    });

                }, function (reason) {
                    $scope.browseWMSLoading = false;
                    if (reason === 0) {
                        $log.error('Failed to load WMS GetCapabilities - CORS failure.')
                    } else if (reason === 404) {
                        //Due to how Angular returns CORS failures.
                        $log.error('Failed to load WMS GetCapabilities - Not found or CORS failure.')
                    }
                    else {
                        $log.error('Failed to load WMS GetCapabilities - Server returned "' + reason + '".');
                    }

                });
            };

            $scope.clearLayerType = function () {
                $scope.layerMap.visibility = false;
                $scope.layerMap.name = null;
                $scope.layerMap.url = null;
                $scope.layerMap.layers = null;
                $scope.layerMap.opacity = null;
                $scope.layerMap.mapType = '';
            };

            $scope.showArea = function (accordion, name) {
                $timeout(function () {
                    for (var accord in $scope.showHideAreas) {
                        if (accord === accordion) {
                            for (var area in $scope.showHideAreas[accordion]) {
                                if ($scope.showHideAreas[accordion].hasOwnProperty(area) && area !== name) {
                                    $scope.showHideAreas[accordion][area] = false;
                                }
                            }
                            if ($scope.showHideAreas[accordion].hasOwnProperty(name)) {
                                $scope.showHideAreas[accordion][name] = true;
                            }
                        }
                    }
                });
            };

            $scope.copyLayerToTemplate = function (index) {
                $scope.layerMap = angular.copy($scope.config.layerMaps[index]);
                $scope.currentLayerMapEditIndex = index;
            };

            $scope.$on('mapLayersOpen', function () {

            });

            $scope.$on('mapLayersClosed', function () {
                $scope.showArea('mapLayers', 'none');
            });
        }]);
})();