/* global angular, OpenLayers, $ */

(function () {
    "use strict";
    var app = angular.module('interactiveMaps.map',
        [
            'interactiveMaps.map-services',
            'interactiveMaps.map-controller',
            'interactiveMaps.map-position-controller',
            'interactiveMaps.termsAndConditions',
            'interactiveMaps.map.related-maps',
            'interactiveMaps.map-config-services'
        ]);

    app.controller('applicationMapPageController', [
        '$scope',
        '$routeParams',
        'MeasureDistanceService',
        'ExportService',
        'interactiveMapsTermsAndConditions',
        '$modal',
        'geoTemplateService',
        '$timeout',
        '$log',
        'GeoLayerService',
        'geoConfig',
        'MasterLayersService',
        function ($scope, $routeParams, MeasureDistanceService, ExportService, interactiveMapsTermsAndConditions, $modal, geoTemplateService, $timeout, $log,GeoLayerService,appDefaults,MasterLayersService) {
            $scope.interrogateFeatures = [];
            $scope.searchFeatures = [];

            //Validate and extend cookie if terms and conditions required for map
            var checkTermsAndConditions = function () {
                // Checks if T&Cs are enabled in the config
                if ($scope.geoConfig.requiresTermsAndConditions === true || $scope.geoConfig.requiresTermsAndConditions === 'true') {
                    // If the user does not have a valid cookie, open the T&C modal
                    if (!interactiveMapsTermsAndConditions.userHasValidTermsAndConditionsCookie($scope.geoConfig)) {
                        $modal.open({
                            templateUrl: 'resources/partial/termsAndConditions.html',
                            controller: 'termsAndConditionsController',
                            windowClass: "termsAndConditionsModal",
                            size: 'lg',
                            resolve: {
                                geoConfig: function () {
                                    return $scope.geoConfig;
                                }
                            },
                            //To disable click elsewhere and ESC key to dismiss modal
                            backdrop: 'static',
                            keyboard: false
                        });
                    }
                }
            };

            //TODO Handle base layer errors
            $scope.onBaseLayerError = function (message, layer) {

            };
            //Handle layer errors and remove from config model
            //Added to 'errorLayers' if we need to display them later
            $scope.errorLayers = [];
            $scope.onLayerError = function (message, layer) {
                for (var i = 0; i < $scope.geoConfig.layerMaps.length; i++) {
                    var configLayer = $scope.geoConfig.layerMaps[i];
                    if (configLayer.name === layer.layerName) {
                        configLayer.error = true;
                        $log.error(message + " - " + layer.layerName);
                        $scope.errorLayers.push(angular.copy(configLayer));
                        $scope.geoConfig.layerMaps.splice(i, 1);
                    }

                }
            };

            // Format display of long lat location of the mouse control
            $scope.mapControlOptions = {
                formatOutput: function (lonLat) {
                    return "Long " + lonLat.lon.toFixed(3) + "\u00B0, Lat " + lonLat.lat.toFixed(3) + "\u00B0";
                }
            };

            // Hide the pan control buttons
            $scope.panzoombarControlOptions = {
                panIcons: false
            };

            $scope.permalinkControlOptions = {
                customData: function () {
                    var groupData = [];
                    for (var i = 0; i < $scope.geoConfig.layerMaps.length; i++) {
                        var layer = $scope.geoConfig.layerMaps[i];
                        if (layer.isGroupedLayers) {
                            var groupLayerId = getGroupLayerIdFromLayerMap(layer);
                            groupData.push({defaultLayerId: groupLayerId, groupId: layer.groupId, visibility: layer.visibility});
                        }
                    }
                    return groupData;
                }
            };

            //TODO optimise
            function getGroupLayerIdFromLayerMap(layerMap) {
                for (var i = 0; i < $scope.geoConfig.groupedLayers.length; i++) {
                    var groupedLayer = $scope.geoConfig.groupedLayers[i];
                    if (groupedLayer.groupId === layerMap.groupId) {
                        for (var j = 0; j < groupedLayer.layerMaps.length; j++) {
                            var groupLayerMap = groupedLayer.layerMaps[j];
                            if (groupLayerMap.name === layerMap.name) {
                                return groupLayerMap.id;
                            }
                        }
                        return groupedLayer.id;
                    }
                }
            }

            //Openlayers specific
            //For distance between multiple points.
            //persist for displaying after double click
            $scope.measureLineControlOptions = {
                persist: true,
                partialDelay: 10
            };
            //Map overview maximized by default due to problem with google maps
            //base layer and coords + being closed.
            //Issue MAPCON-83
            $scope.overviewMapOptions = {
                maximized: true,
                minRatio: 30
            };

            $scope.loadOverviewMapOptions = function (options) {
                var existingOptions = options;
                if(!$scope.geoConfig.overviewOptions) {
                    return options;
                }
                var configOverview = angular.copy($scope.geoConfig.overviewOptions);
                var configuredOverviewOptions = angular.extend(configOverview, existingOptions);
                if(configOverview.layers == null) {
                    return configuredOverviewOptions;
                }
                //populate from master layer list
                var configuredCustomLayers = angular.copy(configOverview.layers);
                configuredCustomLayers = MasterLayersService.loadFromMasterLayerList(configuredCustomLayers);
                configuredOverviewOptions.layers = [];
                for (var i = 0; i < configuredCustomLayers.length; i++) {
                    var layerArgs = configuredCustomLayers[i];
                    layerArgs.layerType = layerArgs.layerType || layerArgs.mapType;
                    layerArgs.layerName = layerArgs.layerName || layerArgs.name;
                    layerArgs.tileSize = appDefaults().defaultOptions.tileSize;
                    layerArgs.isBaseLayer = true;
                    layerArgs.sphericalMercator = true;
                    layerArgs.layerUrl = layerArgs.layerUrl || layerArgs.url;
                    layerArgs.projection = $scope.geoConfig.datumProjection;
                    var mapSpecificLayer = GeoLayerService.createLayer(layerArgs);
                    configuredOverviewOptions.layers.push(mapSpecificLayer);
                }
                if(configuredOverviewOptions.maxExtent) {
                    var me = configuredOverviewOptions.maxExtent;
                    var bounds = new OpenLayers.Bounds(
                        me[0[0]],
                        me[0][1],
                        me[1][0],
                        me[1][1]
                    );
                    configuredOverviewOptions.maxExtent = me;
                }
                return configuredOverviewOptions;
            };

            //Update and store routeParams
            $scope.themeId = $routeParams.themeId;
            $scope.mapId = $routeParams.mapId;
            //Check/Validate if terms and conditions required
            checkTermsAndConditions();

            //Add updated search features to scope
            $scope.$on('searchFeaturesUpdated', function (event, args) {
                $scope.searchFeatures = args;
            });

            //Add updated interrogate features to scope
            $scope.$on('interrogateFeaturesUpdated', function (event, args) {
                $scope.interrogateFeatures = args;
            });

            //This method is used to clean up what the FeaturePopup OLV2 control doesn't.
            //The use of this control leaves around divs and root container layers that
            //obstruct any layers that are added in the future, eg when a feature layer is
            //destroyed from the DOM and recreated when there are new features.
            //OpenLayers specific
            $scope.cleanUpPopups = function (map) {
                var control = map.getControlsBy('id', 'featurePopups');
                if (control.length > 0) {
                    map.removeControl(control[0]);
                    $timeout(function () {
                        var rootLayers = [];
                        for (var i = 0; i < map.layers.length; i++) {
                            var layer = map.layers[i];
                            if (layer.id.indexOf('Root') !== -1) {
                                rootLayers.push(layer);
                            }
                        }
                        for (var j = 0; j < rootLayers.length; j++) {
                            var rootLayer = rootLayers[j];
                            map.removeLayer(rootLayer);
                        }
                    }, 100);

                }
                //To resolve bug where a user is hovering over a feature and the control is removed
                //The control doesn't clean this up.
                $('#featurePopups_hover').remove();
                $timeout(function () {
                    $('.olControlSelectFeature').remove();
                });
            };

            //Resolve which Feature popup template can be used for interrogate features.
            //OpenLayers specific
            $scope.resolveInterrogateTemplate = function (map, layer) {
                var template;
                if ($scope.searchConfig.primaryWfsProperty) {
                    template = geoTemplateService.resolveSingleDynamicPropertyTemplate($scope.searchConfig.primaryWfsProperty);
                }
                else {
                    template = geoTemplateService.resolveTemplateById('search');
                }
                if (template.id === 'FeaturePopup') {
                    var control = map.getControlsBy('id', 'featurePopups');

                    if (control.length === 0) {
                        control = new OpenLayers.Control.FeaturePopups({
                            id: 'featurePopups'
                        });
                        control.addLayer(layer, template.data);
                        map.addControl(control);
                    } else {
                        control[0].addLayerToControl(layer);
                    }
                }
            };

            //Resolve which feature popup template can be used for search results
            //Fired on creation of search feature layer
            //OpenLayers specific
            $scope.resolveSearchTemplate = function (map, layer) {
                var template;
                if ($scope.searchConfig.primaryWfsProperty) {
                    template = geoTemplateService.resolveSingleDynamicPropertyTemplate($scope.searchConfig.primaryWfsProperty);
                }
                else {
                    template = geoTemplateService.resolveTemplateById('search');
                }
                if (template.id === 'FeaturePopup') {
                    var control = map.getControlsBy('id', 'featurePopups');

                    if (control.length === 0) {
                        control = new OpenLayers.Control.FeaturePopups({
                            id: 'featurePopups'
                        });
                        control.addLayer(layer, template.data);
                        map.addControl(control);
                    } else {
                        control[0].addLayerToControl(layer);
                    }
                }
            };
        }]);
})();
