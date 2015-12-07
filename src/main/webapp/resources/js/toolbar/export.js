/* global angular, $*/
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.tools.export', [ 'interactiveMaps.services' ]);

    app.controller('exportToggleController', [ '$scope', '$timeout', 'exportHelperService', 'toolService',
        function ($scope, $timeout, exportHelperService, toolService) {
            var tool;
            $scope.exportLayerName = "exportMarkers";
            $scope.exportActive = false;

            $scope.$on('exportToggleReady', function (event, args) {
                $scope.exportToggleReady = args;
                tool = toolService.createSimpleTool('export', 'export', function () {
                    return $scope.exportToggleReady;
                }, function () {
                    return $scope.exportActive;
                }, function (toolbarScope, toolbarController) {
                    $scope.toolParentScope = toolbarScope;
                    $scope.toolParentController = toolbarController;
                });
                $scope.$emit('registerTool', tool);
            });

            $scope.$on("exportReady", function (event, args) {
                $scope.exportPanelController = args;
            });

            // Fires when toggle opens
            $scope.exportOn = function () {
                $scope.exportActive = true;
                $scope.toolParentController.activateToggle(tool);

                var title = "";

                if ($scope.$parent.$parent.tool.config.displayFirstLayerAsTitle) {
                    for (var i = 0; i < $scope.geoConfig.layerMaps.length; i++) {
                        if ($scope.geoConfig.layerMaps[i].visibility) {
                            title = $scope.geoConfig.layerMaps[i].name;
                            break;
                        }
                    }
                } else {
                    title = $scope.$parent.$parent.$parent.$parent.geoConfig.title;
                }

                $scope[tool.getNamespace()].exportTitle = title
            };

            // Fires when toggle closes
            $scope.exportOff = function () {
                $scope.exportActive = false;
                $scope.exportReset();
                $scope.toolParentController.deactivateToggle(tool);
                if ($scope[$scope.$parent.tool.id].deferredCanceller != null) {
                    $scope[$scope.$parent.tool.id].deferredCanceller.resolve("Cancelled Request");
                }
                $scope[$scope.$parent.tool.id].waitingForResponse = false;
            };

            // Remove the layer and reset the form
            $scope.exportReset = function () {
                $timeout(function () {
                    $scope[tool.getNamespace()].dialogCriteriaLat = "";
                    $scope[tool.getNamespace()].dialogCriteriaLon = "";
                    $scope[tool.getNamespace()].exportTitle = $scope.$parent.$parent.$parent.$parent.geoConfig.title;
                    $scope[$scope.$parent.tool.id].hasResult = false;
                });
            };
        } ]);

    app.controller('exportPanelController', [ '$scope', '$timeout', '$q', 'exportHelperService', 'ExportService',
        function ($scope, $timeout, $q, exportHelperService, ExportService) {
            // Sets the defaults on the scope
            $scope.templateList = $scope.$parent.$parent.tool.config.templatesList;
            $scope.selectedTemplate = $scope.$parent.$parent.tool.config.templatesList[0];
            $scope.roundScale = 'true';

            $scope.submitExportMap = function () {
                $scope[$scope.$parent.tool.id].hasResult = false;
                $scope[$scope.$parent.tool.id].waitingForResponse = true;
                $scope.hasError = false;

                var baseMaps = $scope.geoConfig.baseMaps;
                var baseLayer;

                for (var j = 0; j < baseMaps.length; j++) {
                    if (baseMaps[j].visibility == true) {
                        baseLayer = baseMaps[j];
                        break;
                    }
                }

                // Layer criteria requires base layer first, then the other layers in reverse order
                var layers = $scope.mapController.getLayers();
                layers.reverse();

                var layerCriteria = "";

                for (var i = 0; i < layers.length; i++) {
                    // Add all layers that are visible, have a layer type, and are not a base layer
                    if (layers[i].visibility == true && layers[i].type != null && layers[i].id != baseLayer.id) {
                        layerCriteria += layers[i].name + ":" + exportHelperService.stripDecimal(layers[i].opacity * 100) + ",";
                    }
                }

                layerCriteria = layerCriteria + baseLayer.name + ":" + exportHelperService.stripDecimal(baseLayer.opacity * 100);
                var mapCenter = $scope.mapController.getMapCenter();

                // Create the search criteria object
                var exportCriteria = {
                    datum: $scope.mapController.getProjection().split(":")[1],
                    geometryType: "esriGeometryPoint",
                    latitude: mapCenter.lat,
                    longitude: mapCenter.lon,
                    url: $scope.$parent.$parent.tool.config.url,
                    title: $scope[$scope.$parent.tool.id].exportTitle,
                    template: $scope.selectedTemplate,
                    roundScale: $scope.roundScale,
                    mapScale: $scope.mapController.getMapScale(),
                    layerList: layerCriteria
                };

                var deferredCanceller = $q.defer();
                $scope[$scope.$parent.tool.id].deferredCanceller = deferredCanceller;

                // Calls the export service with a promise
                ExportService.exportMap(exportCriteria, deferredCanceller).then(function (data) {
                    $scope.resultUrl = data.value;
                    $scope[$scope.$parent.tool.id].hasResult = true;
                    $scope[$scope.$parent.tool.id].waitingForResponse = false;
                }, function (error) {
                    $scope[$scope.$parent.tool.id].hasResult = true;
                    $scope[$scope.$parent.tool.id].waitingForResponse = false;
                    $scope[$scope.$parent.tool.id].hasError = true;
                    $scope.errorMessage = error.jobStatus;
                });

                // Reset the form
                $scope.resetExport = function () {
                    $scope[$scope.$parent.tool.id].hasResult = false;
                    $scope.hasError = false;
                };
            };
        } ]);

    app.service('exportHelperService', [ function () {
        return {
            stripDecimal: function (number) {
                return (parseFloat(number.toPrecision(12)));
            }
        };
    } ]);
})();