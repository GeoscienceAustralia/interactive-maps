var angular = angular || {};

var app = angular.module('interactiveMaps.layers-controllers', ['interactiveMaps.services', 'ui.bootstrap', 'ui.bootstrap.modal']);

app.controller('layerMetadataController', [ '$scope', '$modal', function ($scope, $modal) {
    'use strict';

    var layerMetadataModalController = function ($scope, $modalInstance, layer) {

    };

    $scope.open = function () {
        $modal.open({
            templateUrl: 'resources/partial/layerMetadata.html',
            size: 'lg',
            controller: 'layerMetadataModalController',
            resolve: {
                layer: function () {
                    return $scope.getSelectedLayer();
                }
            }
        });
    };

    // Sets the layer extent for a single layer
    $scope.setLayerExtent = function (extent) {
        $scope.mapController.zoomToExtent(extent);
    };

    // Sets the layer extent for a group layer,we have to identify the selected layer first
    $scope.setLayerExtentGroup = function () {
        var layer = $scope.getSelectedLayer();
        $scope.mapController.zoomToExtent(layer.extent);
    };

    // Checks if the selected layer has an extent associated with it
    $scope.layerHasExtent = function () {
        var layerHasExtent = false;

        if ($scope.$parent.groupSelectedId != null) {
            for (var i = 0; i < $scope.geoConfig.groupedLayers.length; i++) {
                for (var k = 0; k < $scope.geoConfig.groupedLayers[i].layerMaps.length; k++) {
                    if ($scope.geoConfig.groupedLayers[i].layerMaps[k].id === $scope.$parent.groupSelectedId) {
                        if ($scope.geoConfig.groupedLayers[i].layerMaps[k].extent != null) {
                            layerHasExtent = true;
                            break;
                        }
                    }
                }
            }
        }

        return layerHasExtent;
    };

    // Returns the selected layer in the group
    $scope.getSelectedLayer = function () {
        var layer;

        if ($scope.$parent.groupSelectedId != null) {
            for (var i = 0; i < $scope.geoConfig.groupedLayers.length; i++) {
                for (var k = 0; k < $scope.geoConfig.groupedLayers[i].layerMaps.length; k++) {
                    if ($scope.geoConfig.groupedLayers[i].layerMaps[k].id === $scope.$parent.groupSelectedId) {
                        layer = $scope.geoConfig.groupedLayers[i].layerMaps[k];
                    }
                }
            }
        } else {
            layer = $scope.layer;
        }

        return layer;
    }
} ]);

app.controller('layerMetadataModalController', ['$scope', '$modalInstance', 'layer', function ($scope, $modalInstance, layer) {
    "use strict";
    $scope.layer = layer;
    $scope.ok = function () {
        $modalInstance.close();
    };
}]);

app.controller('layersPanelController', [ '$scope', '$timeout', '$q', '$log',
    function ($scope, $timeout, $q, $log) {
        "use strict";
        var deferred;
        $scope.sortableOptions = {
            start: function (e, ui) {
                deferred = $q.defer();
                updateLayerPosition(deferred.promise, ui.item.index());
            },
            stop: function (e, ui) {
                deferred.resolve(ui.item);
            },
            disabled: false,
            axis: "y"
        };
        $scope.startLoadingTimeout = null;
        $scope.stopLoadingTimeout = null;
        $scope.layerStartedLoading = function (layerId) {
            $timeout(function () {
                $scope.numberOfLayersLoading++;
            });
        };

        $timeout(function () {
            $('.ui-slider-handle').attr('')
        });

        $scope.layerFinishedLoading = function (layerId) {
            //750ms delay is to soften the flashing if layers load quickly
            //Still might flash due to multiple layers loading times overlapping
            $timeout(function () {
                $scope.numberOfLayersLoading--;
            }, 750);
        };

        $scope.numberOfLayersLoading = 0;

        $scope.initialLayerUpdated = function (layerId, groupId) {
            dropDownLayerChange(layerId, groupId, true);
        };

        $scope.selectedBaseLayerChanged = function (layerId, groupId) {
            $scope.mapController.setBaseLayer(layerId);
            updateMapBackgroundColour(layerId);
        };

        $scope.baseMapsDropDownInitialised = function (layerId, groupId) {
            updateMapBackgroundColour(layerId);
        };

        function updateMapBackgroundColour(layerId) {
            for (var i = 0; i < $scope.geoConfig.baseMaps.length; i++) {
                var baseMap = $scope.geoConfig.baseMaps[i];
                if (baseMap.id === layerId && (baseMap.mapBGColor || $scope.geoConfig.mapBGColor)) {
                    $('#interactivemap').css('background-color', baseMap.mapBGColor || $scope.geoConfig.mapBGColor);
                    break;
                }
            }
        }

        $scope.selectedGroupLayerChanged = function (layerId, groupId) {
            dropDownLayerChange(layerId, groupId, false);
        };

        function dropDownLayerChange(layerId, groupId, visibilityFromConfig) {
            $log.info(layerId);
            var configLayer;
            var group;
            var groupLayer;
            for (var i = 0; i < $scope.geoConfig.layerMaps.length; i++) {
                var l = $scope.geoConfig.layerMaps[i];
                if (l.isGroupedLayers && l.groupId === groupId) {
                    configLayer = l;
                    break;
                }
            }
            for (var i = 0; i < $scope.geoConfig.groupedLayers.length; i++) {
                var g = $scope.geoConfig.groupedLayers[i];
                if (g.groupId === groupId) {
                    group = g;
                    for (var j = 0; j < group.layerMaps.length; j++) {
                        var gl = group.layerMaps[j];
                        if (gl.id === layerId) {
                            groupLayer = gl;
                            break;
                        }
                    }
                }
            }
            if (visibilityFromConfig && configLayer.name) {
                //Already initialised
                //Update drop down list... ?
                $scope.$broadcast(configLayer.groupId + "_selectedModelUpdate", configLayer.defaultLayerId);
            } else {
                configLayer.mapType = groupLayer.mapType;
                configLayer.name = groupLayer.name;
                configLayer.opacity = groupLayer.opacity;
                configLayer.layers = groupLayer.layers;
                configLayer.url = groupLayer.url;
                if (visibilityFromConfig) {
                    configLayer.visibility = groupLayer.visibility;
                } else {
                    //Default true.
                    configLayer.visibility = true;
                }
            }

            $log.info(configLayer);
            updateLayer(configLayer);
        }

        function updateLayer(layer) {
            $timeout(function () {
                layer.refresh = layer.refresh == null ? 0 : layer.refresh + 1;
            });
        }

        var updateLayerPosition = function (promise, originalIndex) {
            promise.then(function (item) {
                var nIndex = item.index();
                if (originalIndex !== nIndex) {
                    var delta = nIndex - originalIndex;
                    //The delta index is times by -1 due to the reverse order of our model compared to
                    //the original layers. See layersReady method off the applicationMapController.
                    if ($scope.geoConfig.layerMaps[nIndex].error !== true) {
                        $scope.mapController.raiseLayerDrawOrder($scope.geoConfig.layerMaps[nIndex].id, -delta);
                    }
                }
            });
        };
    } ]);

app.controller('groupedLayerMapsController', ['$scope', '$timeout', function ($scope, $timeout) {
    "use strict";
    for (var i = 0; i < $scope.geoConfig.groupedLayers.length; i++) {
        if ($scope.geoConfig.groupedLayers[i].groupId === $scope.layer.groupId) {
            $scope.currentGroup = $scope.geoConfig.groupedLayers[i];
            $scope.$on($scope.currentGroup.groupId + '_selectedModelUpdate', function (event, args) {
                $timeout(function () {
                    $scope.groupSelectedId = args;
                });
            });
        }
    }
    $scope.groupLayerVisibilityChanged = function () {
    };
}]);
