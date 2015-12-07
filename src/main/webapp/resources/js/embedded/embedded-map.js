/* global angular, $*/
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.embedded.embedded-map', []);

    app.controller('embeddedMapController', [ '$scope', '$timeout', '$localStorage', '$templateCache', '$log', '$location', 'MasterLayersService',
        function ($scope, $timeout, $localStorage, $templateCache, $log, $location, MasterLayersService) {

            MasterLayersService.initMasterLists().then(function () {
                $scope.resourcesReady = true;
            });

            $scope.routeOverrides = {};

            $scope.$on('$routeChangeSuccess', function (event, routeData) {
                $scope.themeId = routeData.params.themeId;
                $scope.mapId = routeData.params.mapId;
                if ($scope.themeId != null && $scope.mapId != null) {
                    $scope.loadFromAppConfig = true;
                }
                $scope.externalConfigUrl = routeData.params.url;

                if ($scope.externalConfigUrl) {
                    $scope.loadFromExternalConfig = true;
                }

                if (routeData.params.framework) {
                    $scope.routeOverrides.framework = routeData.params.framework;
                }

                if (routeData.params.viewMode) {
                    //OLV2 does not support 3D. For now, just set to OLV3;
                    $scope.routeOverrides.framework = 'olv3';
                    $scope.routeOverrides.viewMode = routeData.params.viewMode;
                }

                if(routeData.params.localStorageKey) {
                    $scope.loadFromLocalStorage = true;
                    $scope.localStorageKey = routeData.params.localStorageKey;
                }
            });

            $scope.$on('configDataLoaded', function (event, args) {
                $log.info('configData event fired');
                $scope.geoConfig = args;
                //Wait for full digest
                $timeout(function () {
                    $scope.configReady = true;
                }, 10);
            });

            function getParameterByName(name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name +
                    "=([^&#]*)"), results = regex.exec(document.URL);

                return results == null ?
                    "" :
                    decodeURIComponent(results[1].replace(/\+/g, " "));
            }

            //TODO pull out into an config initialise service
            $scope.initialiseConfig = function (config) {
                $scope.geoConfigReset = angular.copy(config);
                if ($localStorage.keepMapExtent === true && $localStorage.keptMapExtent) {
                    var initExtent = [];
                    if ($localStorage.keptMapExtent.length > 2) {
                        //Array of 4 points of an extent
                        initExtent.push($localStorage.keptMapExtent[0]);
                        initExtent.push($localStorage.keptMapExtent[3]);
                    } else {
                        //Array of 2 points, top left, bottom right.
                        initExtent = $localStorage.keptMapExtent;
                    }

                    config.initialExtent = initExtent;
                }

                var groupedLayerMaps = [];
                if (config.layerMaps != null) {
                    for (var index = 0; index < config.layerMaps.length; index++) {
                        var layerMap = config.layerMaps[index];
                        if (layerMap.isGroupedLayers) {
                            groupedLayerMaps.push(layerMap);
                        }
                    }
                }

                // Load config from the master lists
                config.layerMaps = MasterLayersService.loadFromMasterLayerList(config.layerMaps);
                config.baseMaps = MasterLayersService.loadFromMasterLayerList(config.baseMaps);
                config.addLayerMaps = MasterLayersService.loadFromMasterLayerList(config.addLayerMaps);
                if (config.toolsConfig && config.toolsConfig.tools && config.toolsConfig.tools.length > 0) {
                    config.toolsConfig.tools = MasterLayersService.loadFromMasterToolList(config.toolsConfig.tools);
                }


                //Update from query string
                var customDataJson = getParameterByName('customData');
                if (customDataJson !== '') {
                    var customData = angular.fromJson(customDataJson);
                    for (var i = 0; i < customData.length; i++) {
                        var groupStateToRestore = customData[i];
                        for (var j = 0; j < groupedLayerMaps.length; j++) {
                            var configLayerMap = groupedLayerMaps[j];
                            if (configLayerMap.groupId === groupStateToRestore.groupId) {
                                configLayerMap.visibility = groupStateToRestore.visibility;
                                configLayerMap.defaultLayerId = groupStateToRestore.defaultLayerId;
                                updateLayer(configLayerMap);
                            }
                        }
                    }
                }

                if (config.groupedLayers != null) {
                    for (var groupIndex = 0; groupIndex < config.groupedLayers.length; groupIndex++) {
                        var group = config.groupedLayers[groupIndex];
                        group.layerMaps = MasterLayersService.loadFromMasterLayerList(group.layerMaps);
                        for (var mapIndex = 0; mapIndex < groupedLayerMaps.length; mapIndex++) {
                            var groupedLayerMap = groupedLayerMaps[mapIndex];
                            for (var layerIndex = 0; layerIndex < group.layerMaps.length; layerIndex++) {
                                var groupedLayer = group.layerMaps[layerIndex];
                                if (groupedLayerMap.defaultLayerId == null) {
                                    groupedLayerMap.defaultLayerId = groupedLayer.id;
                                }
                                if (groupedLayerMap.groupId === group.groupId && groupedLayer.id === groupedLayerMap.defaultLayerId) {
                                    groupedLayerMap.mapType = groupedLayer.mapType;
                                    //groupedLayerMap.visibility = groupedLayer.visibility;
                                    groupedLayerMap.name = groupedLayer.name;
                                    groupedLayerMap.layers = groupedLayer.layers;
                                    groupedLayerMap.opacity = groupedLayer.opacity;
                                    groupedLayerMap.tileType = groupedLayer.tileType;
                                    groupedLayerMap.url = groupedLayer.url;
                                    updateLayer(groupedLayerMap);
                                }
                            }
                        }
                    }
                }

                angular.forEach(config.layerMaps, function (layerMap) {
                    layerMap.refreshTrigger = layerMap.refreshTrigger != null ? layerMap.refreshTrigger++ : 0;
                });

                if($scope.loadFromLocalStorage) {
                    config.framework = config.framework || 'olv2';
                } else if ($scope.routeOverrides) {
                    config.framework = $scope.routeOverrides.framework || 'olv2';
                }

                return config;
            };

            function updateLayer(layer) {
                layer.refresh = layer.refresh == null ? 0 : layer.refresh + 1;
            }

            $scope.preConfigInit = function (config) {
                return $scope.initialiseConfig(config);
            };

            $scope.$on('mapRefreshFired', function () {
                $scope.configReset();
            });

            $scope.configReset = function () {
                $localStorage.keptMapExtent = $scope.geoConfigReset.initialExtent;
                //HACK window reload is in a timeout due to $localStorage persistence seems to be using $digest cycle
                $timeout(function () {
                    var absoluteUrl = $location.absUrl();
                    if (absoluteUrl.indexOf('?') !== -1) {
                        var applicationPath = absoluteUrl.split('?')[0];
                        var finalPath = applicationPath + '#' + $location.path();
                        window.location = finalPath;
                    } else {
                        window.location.reload();
                    }
                }, 200);
            };


            $scope.$on('rightMenuController', function (event, args) {

                $scope.controllers.rightMenuController = args;
            });

            $scope.$on('leftMenuController', function (event, args) {
                $scope.controllers.leftMenuController = args;
            });

            $scope.$on('layerAdded', function (event, args) {
                $scope.updateLayer(args, $scope.geoConfig);
            });

            $scope.loading = true;

            $scope.$on("layersReady", function (event, layers) {
                $scope.loading = false;
                $scope.updateLayers($scope.mapController.getLayers(), $scope.geoConfig);
                //The initial order of our model is reverse to match the required
                //rendering order by business that the top layer on the UI list
                //is the layer rendered last.
                $scope.geoConfig.layerMaps = $scope.geoConfig.layerMaps.reverse();

                if ($scope.routeOverrides != null &&
                    $scope.routeOverrides.viewMode != null &&
                    $scope.routeOverrides.viewMode.toLowerCase() === '3d') {
                    $scope.mapController.switch3d();
                }

                //pass message to parent
                window.parent.postMessage('layersReady', '*');
            });

            $scope.$on('mapControllerReady', function (event, args) {
                $scope.mapController = args;
                //As this is embedded, expose the mapController on the window for external JS calls.
                window.mapController = args;
                window.parent.postMessage('mapControllerReady', '*');
                window.mapController.changeFramework = function (framework) {
                    $scope.$apply(function () {
                        $scope.configReady = false;
                        $timeout(function () {
                            $scope.geoConfig.framework = framework;
                            $scope.configReady = true;
                        }, 100);
                    });
                }
            });

            //TODO pull out into a service.
            $scope.updateLayer = function (layer, geoConfig) {
                var layerMaps = geoConfig.layerMaps;
                var baseMaps = geoConfig.baseMaps;
                var currentLayer;
                for (var i = 0; i < layerMaps.length; i++) {
                    if (layerMaps[i].name === layer.name) {
                        currentLayer = layerMaps[i];
                        break;
                    }
                }
                if (currentLayer !== undefined) {
                    if (currentLayer.error === true) {
                        $log.error("Failed to updated layer - " + currentLayer.name);
                        var index = geoConfig.layerMaps.indexOf(currentLayer);
                        geoConfig.layerMaps.splice(index, 1);
                    } else {
                        currentLayer.id = layer.id;
                        currentLayer.visibility = layer.visibility;
                    }
                }
                var baseLayer;

                for (var j = 0; j < baseMaps.length; j++) {
                    if (baseMaps[j].name === layer.name) {
                        baseLayer = baseMaps[j];
                        break;
                    }
                }
                if (baseLayer !== undefined) {
                    baseLayer.id = layer.id;
                }

            };

            $scope.updateLayers = function (layers, geoConfig) {
                angular.forEach(layers, function (layer) {
                    $scope.updateLayer(layer, geoConfig);
                });
                $scope.layerUiReady = true;
            };

            //Accessibility modifications
            //HACK Title text for OpenLayer controls
            $timeout(function () {
                $('.olControlMousePosition').attr('title', 'Longitude and latitude values');
                $('.olControlPermalink').find('a').attr('title', 'Generate URL link for this map');
            }, 100);
        }]);
})();