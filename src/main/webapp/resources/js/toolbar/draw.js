/* global angular, $ */
(function () {
    "use strict";

    var app = angular.module('interactiveMaps.tools.draw', ['interactiveMaps.services']);

    app.controller('drawToggleController', ['$scope', '$timeout', 'toolService',
        function ($scope, $timeout, toolService) {
            var tool;
            $scope.drawActive = false;

            $scope.$on('drawToggleReady', function (event, args) {
                $scope.drawToggleReady = args;
                tool = toolService.createSimpleTool('draw', 'draw', function () {
                    return $scope.drawToggleReady;
                }, function () {
                    return $scope.drawActive;
                }, function (toolbarScope, toolbarController) {
                    $scope.toolParentScope = toolbarScope;
                    $scope.toolParentController = toolbarController;
                });
                $scope.$emit('registerTool', tool);
            });

            $scope.drawOn = function () {
                $scope.drawActive = true;
                $scope.toolParentController.activateToggle(tool);
            };

            $scope.drawOff = function () {
                $scope.drawActive = false;
                $scope.toolParentController.deactivateToggle(tool);
                $scope.mapController.stopDrawing();

                $scope[tool.getNamespace()].selectedDrawingTool = "";
            };

            // Callback event from the map
            $scope.drawTool = function (e, layerId) {
                if ($scope[tool.getNamespace()].selectedDrawingTool != null) {
                    var lonLat = $scope.mapController.getLonLatFromPixel(e.x, e.y);

                    $timeout(function () {
                        // Bind the transformed lat and lon to the scope
                        $scope[tool.getNamespace()].drawingToolLon = lonLat.lon.toFixed(3);
                        $scope[tool.getNamespace()].drawingToolLat = lonLat.lat.toFixed(3);
                    });
                }
            };
        }]);

    app.controller('drawPanelController', ['$scope', '$timeout',
        function ($scope, $timeout) {
            // Declare defaults
            $scope.fontOptions = [
                {name: "10px", id: 10},
                {name: "12px", id: 12},
                {name: "14px", id: 14},
                {
                    name: "16px",
                    id: 16
                },
                {name: "18px", id: 18},
                {name: "20px", id: 20},
                {name: "24px", id: 24},
                {name: "26px", id: 26}
            ];

            $scope.drawOpacityOptions = [
                {name: "10%", id: 0.1},
                {name: "20%", id: 0.2},
                {name: "30%", id: 0.3},
                {name: "40%", id: 0.4},
                {name: "50%", id: 0.5},
                {name: "60%", id: 0.6},
                {name: "70%", id: 0.7},
                {name: "80%", id: 0.8},
                {name: "90%", id: 0.9},
                {name: "100%", id: 1}
            ];

            $scope.drawingTools = [
                {name: "Point", id: 'point'},
                {name: "Line", id: 'line'},
                {name: "Box", id: 'box'},
                {
                    name: "Polygon",
                    id: 'polygon'
                },
                {name: "Point & Text", id: 'point&text'},
                {name: "Text Only", id: 'textonly'},
                {
                    name: 'Remove Feature',
                    id: 'removefeature'
                }
            ];

            $scope.textSelectedColor = '#000000';
            $scope.drawSelectedColor = '#000000';
            $scope.selectedFontSize = $scope.fontOptions[1];
            $scope.selectedDrawOpacity = $scope.drawOpacityOptions[4];
            $scope.features = [];

            // Call toggleDrawTool if options have changed to update the correct properties
            $scope.optionsChanged = function () {
                if ($scope[$scope.$parent.tool.id].selectedDrawingTool != null && $scope.drawingTools[$scope[$scope.$parent.tool.id].selectedDrawingTool] != null) {
                    $scope.toggleDrawTool($scope.drawingTools[$scope[$scope.$parent.tool.id].selectedDrawingTool].id);
                }
            };

            // Select the appropriate action depending on the drawing tool selected
            $scope.toggleDrawTool = function (val) {
                if (val != '') {
                    $scope.mapController.stopDrawing();
                    if (val == 'textonly' || val == 'point&text') {

                    } else if (val == 'removefeature') {
                        $scope.mapController.startRemoveSelectedFeature('drawLayer');
                    } else {
                        var args = {
                            featureType: val,
                            color: $scope.drawSelectedColor,
                            opacity: $scope.selectedDrawOpacity.id,
                            radius: 6
                        };

                        $scope.mapController.startDrawingOnLayer('drawLayer', args);
                    }
                }
            };

            $scope.addText = function () {
                var feature = "";

                // Adds text on the map to the selected lat and long
                if ($scope.drawingTools[$scope[$scope.$parent.tool.id].selectedDrawingTool].id == 'textonly') {
                    var textArgs = {
                        text: $scope[$scope.$parent.tool.id].text,
                        fontSize: $scope.selectedFontSize.name,
                        font: 'Aerial',
                        lon: parseFloat($scope[$scope.$parent.tool.id].drawingToolLon),
                        lat: parseFloat($scope[$scope.$parent.tool.id].drawingToolLat),
                        fontColor: $scope.textSelectedColor,
                        weight: 'normal',
                        align: "cm", // unit for alignment
                        projection: 'EPSG:4326',
                        labelYOffset: 25
                    };
                    feature = $scope.mapController.drawLabel('drawLayer', textArgs);
                }

                // Adds a point and text offset to the point to the selected lat and long
                if ($scope.drawingTools[$scope[$scope.$parent.tool.id].selectedDrawingTool].id == 'point&text') {
                    var textPointArgs = {
                        text: $scope[$scope.$parent.tool.id].text,
                        fontSize: $scope.selectedFontSize.name,
                        lon: parseFloat($scope[$scope.$parent.tool.id].drawingToolLon),
                        lat: parseFloat($scope[$scope.$parent.tool.id].drawingToolLat),
                        fontColor: $scope.textSelectedColor,
                        align: "cm", // unit for alignment
                        labelYOffset: 20, // offset the text this many pixels from the point
                        projection: 'EPSG:4326',
                        pointRadius: 5.5,
                        color: $scope.drawSelectedColor,
                        opacity: $scope.selectedDrawOpacity.id
                    };

                    $scope.mapController.drawLabelWithPoint('drawLayer', textPointArgs);
                }

                $scope.features.push({id: feature.id});
            };

            // Reset drawing tool panel to defaults
            $scope.resetDrawingTools = function () {
                $scope.mapController.removeLayersByName("drawLayer");
                $scope.mapController.stopDrawing();
                $scope.selectedDrawingTool = "";
                $scope.textselectedColor = '#000000';
                $scope.drawSelectedColor = '#000000';
                $scope.selectedFontSize = $scope.fontOptions[1];
                $scope.selectedDrawOpacity = $scope.drawOpacityOptions[4];
                $scope[$scope.$parent.tool.id].drawingToolLon = "";
                $scope[$scope.$parent.tool.id].drawingToolLat = "";
                $scope[$scope.$parent.tool.id].text = "";
                $scope[$scope.$parent.tool.id].selectedDrawingTool = "";
                $scope.features = [];
            };

        }]);
})();