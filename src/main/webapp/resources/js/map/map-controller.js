/*global angular, $*/

(function () {
    "use strict";

    var app = angular.module('interactiveMaps.map-controller', ['interactiveMaps.services']);

    app.controller('applicationMapController', [ '$scope', '$timeout', '$localStorage', '$templateCache', '$log', '$location',
            'MasterLayersService','$q', 'ConfigService', 'LayerService',
        function ($scope, $timeout, $localStorage, $templateCache, $log, $location, MasterLayersService, $q, ConfigService, LayerService) {
            $scope.browserSupports3d = Modernizr.webgl;
            //Timeout for tool templates to be loaded.
            //Iterates through configured tools and checks to make sure that specified urls have loaded
            //after a 5 second timeout.
            //This technique was used due to problems identifying if a 404 error was specific to a tool url
            //or another resource if a $http interceptor was used.
            var checkToolTemplates = function () {
                var toolsEnabled = $scope.geoConfig.toolsConfig != null ?
                    $scope.geoConfig.toolsConfig.enabled :
                    false;
                if (!toolsEnabled) {
                    return;
                }
                var toolTimeout = $scope.geoConfig.toolsConfig.timeout || 5000;
                $timeout(function () {
                    for (var i = 0; i < $scope.geoConfig.toolsConfig.tools.length; i++) {
                        var tool = $scope.geoConfig.toolsConfig.tools[i];
                        var toolPanelTemplate = $templateCache.get(tool.toolPanelUrl);
                        var toolToggleTemplate = $templateCache.get(tool.toolToggleUrl);
                        if (!toolPanelTemplate) {
                            $log.error('Failed to load tool panel template for - "' + tool.id + '"');
                        }
                        if (!toolToggleTemplate) {
                            $log.error('Failed to load tool toggle template for - "' + tool.id + '"');
                        }
                    }
                }, toolTimeout);
            };

            MasterLayersService.initMasterLists().then(function () {
                $scope.resourcesReady = true;
            });

            $scope.$on('$routeChangeSuccess', function (event, routeData) {
                $scope.themeId = routeData.params.themeId;
                $scope.mapId = routeData.params.mapId;
            });
            $scope.$on('configDataLoaded', function (event, args) {
                $log.info('configData event fired');
                $scope.geoConfig = args;
                checkToolTemplates();
                //Wait for full digest
                $timeout(function () {
                    $scope.configReady = true;
                }, 10);
            });

            $scope.initialiseConfig = function (config) {
                $scope.geoConfigReset = angular.copy(config);
                return ConfigService.initialiseConfig(config);
            }

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

            // Set the style for the search feature
            $scope.searchStyle =  {
                color: '#FFCC00',
                opacity: 0.8,
                radius: 6
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
            });

            $scope.$on('mapControllerReady', function (event, args) {
                $scope.mapController = args;
            });

            $scope.$on('interrogateMarkerLayerReady', function (event, args) {
                $scope.interrogateMarkerLayerController = args;
            });

            $scope.$on('distanceMeasureMarkersReady', function (event, args) {
                $scope.distanceMeasureMarkersController = args;
            });

            $scope.updateLayer = function (layer, geoConfig) {
                LayerService.updateLayer(layer, geoConfig);
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
                $('.olControlMousePosition').attr('title','Longitude and latitude values');
                $('.olControlPermalink').find('a').attr('title','Generate URL link for this map');
            },100);
        }
    ]);
})();
