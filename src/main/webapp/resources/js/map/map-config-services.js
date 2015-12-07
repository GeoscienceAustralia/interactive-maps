/* global angular, app */
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.map-config-services', []);

    app.service('ConfigService', ['$http', '$q', '$localStorage', 'MasterLayersService', function ($http, $q, $localStorage, MasterLayersService) {

        var service = {
            initialiseConfig: function (config) {
                if ($localStorage.keepMapExtent === true && $localStorage.keptMapExtent) {
                    var initExtent = [];
                    if ($localStorage.keptMapExtent.length > 2) {
                        //Array of 4 points of an extent
                        initExtent.push($localStorage.keptMapExtent[0]);
                        initExtent.push($localStorage.keptMapExtent[3]);
                    } else {
                        //Array of 2 points, top left, bottom right.
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
                if (config.overviewOptions) {
                    if (config.overviewOptions.layers) {
                        config.overviewOptions.layers = MasterLayersService.loadFromMasterLayerList(config.overviewOptions.layers);
                    }
                }
                if (config.toolsConfig && config.toolsConfig.tools && config.toolsConfig.tools.length > 0) {
                    config.toolsConfig.tools = MasterLayersService.loadFromMasterToolList(config.toolsConfig.tools);
                }

                //Update from query string
                var customDataJson = service.getParameterByName('customData');
                if (customDataJson !== '') {
                    var customData = angular.fromJson(customDataJson);
                    for (var i = 0; i < customData.length; i++) {
                        var groupStateToRestore = customData[i];
                        for (var j = 0; j < groupedLayerMaps.length; j++) {
                            var configLayerMap = groupedLayerMaps[j];
                            if (configLayerMap.groupId === groupStateToRestore.groupId) {
                                configLayerMap.visibility = groupStateToRestore.visibility;
                                configLayerMap.defaultLayerId = groupStateToRestore.defaultLayerId;
                                service.updateLayer(configLayerMap);
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
                                    groupedLayerMap.name = groupedLayer.name;
                                    groupedLayerMap.layers = groupedLayer.layers;
                                    groupedLayerMap.opacity = groupedLayer.opacity;
                                    groupedLayerMap.tileType = groupedLayer.tileType;
                                    groupedLayerMap.url = groupedLayer.url;
                                    service.updateLayer(groupedLayerMap);
                                }
                            }
                        }
                    }
                }

                angular.forEach(config.layerMaps, function (layerMap) {
                    layerMap.refreshTrigger = layerMap.refreshTrigger != null ? layerMap.refreshTrigger++ : 0;
                });

                return config;
            },
            updateLayer: function(layer) {
                layer.refresh = layer.refresh == null ? 0 : layer.refresh + 1;
            },
            getParameterByName: function (name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name +
                    "=([^&#]*)"), results = regex.exec(document.URL);

                return results == null ?
                    "" :
                    decodeURIComponent(results[1].replace(/\+/g, " "));
            }
        }

        return service;
    }]);
})();