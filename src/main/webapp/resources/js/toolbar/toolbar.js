/* global angular, $*/
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.toolbar',
        [
            'interactiveMaps.services',
            'interactiveMaps.tools',
            'interactiveMaps.tools.addDynamicLayer',
            'interactiveMaps.tools.addLayer',
            'interactiveMaps.tools.clientMeasure',
            'interactiveMaps.tools.distanceToBoundary',
            'interactiveMaps.tools.draw',
            'interactiveMaps.tools.reset',
            'interactiveMaps.tools.search',
            'interactiveMaps.tools.keepMapExtent',
            'interactiveMaps.tools.interrogate',
            'interactiveMaps.tools.export',
            'interactiveMaps.tools.info',
            'interactiveMaps.tools.interrogateExport'
        ]);
    /* This controller is the orchestration piece for tool data and interaction. Tools were designed with
     * the requirement of dynamic integration with the application using a common pattern.
     * Only 1 tool can be active at a time which creates a consistent experience for the user.
     * Tools have 2 main pieces, the panel and the toggle. The toggle initiates the interaction and
     * the panel displays the results.
     * Due to the shared interaction between the panel and the toggle, data is stored on the common parent,
     * namespaced to the toolid. */
    app.controller('toolbarController', [ '$scope', '$timeout', '$log', 'externalToolService',
        function ($scope, $timeout, $log, externalToolService) {
            var self = this;
            //register of 'tools'
            $scope.tools = {};
            $scope.$on('registerTool', function (event, args) {
                if (args == null) {
                    $log.error('Tool failed to initialise');
                }
                $scope.tools[args.id] = args;
                args.toolRegistered($scope, self);
                $scope[args.getNamespace()] = {};
//		$scope[args.getNamespace()].config =
            });
            $scope.$on('addNewLayerDialogReady', function (event, args) {
                $scope.addDynamicLayerDialogController = args;
            });

            self.deactivateOtherToggles = function (tool) {
                for (var t in $scope.tools) {
                    if ($scope.tools.hasOwnProperty(t)) {
                        var otherTool = $scope.tools[t];
                        if (otherTool !== tool) {
                            try {
                                otherTool.toggleDeactivate();
                            } catch (e) {
                                var toolName = $scope.tools[t].config != null ?
                                    ($scope.tools[t].config.titleText || $scope.tools[t].id) :
                                    $scope.tools[t].id;
                                $log.error('Map tool "' + toolName + '" failed to deactivate');
                            }
                        }
                    }
                }
                var externalTools = externalToolService.allTools();
                for (var i = 0; i < externalTools.length; i++) {
                    var externalTool = externalTools[i];
                    externalTool.toggleDeactivate();
                }
            };

            self.deactivateToggle = function (tool) {
                $scope.controllers.rightMenuController.setMenuContent('');
                $scope.controllers.rightMenuController.close();
                $scope.$broadcast(tool.id + 'Deactivate', tool);
            };

            self.activateToggle = function (tool) {
                self.deactivateOtherToggles(tool);
                $scope.controllers.rightMenuController.setMenuContent(tool.id);
                $scope.controllers.rightMenuController.open();
            };

            self.getToolBarScope = function () {
                return $scope;
            };

            $timeout(function () {
                $scope.controllers.rightMenuController.close();
            });

            self.resetAllToggles = function () {
                for (var t in $scope.tools) {
                    if ($scope.tools.hasOwnProperty(t)) {
                        var tool = $scope.tools[t];
                        tool.toggleDeactivate();
                    }
                }

                var externalTools = externalToolService.allTools();
                for (var i = 0; i < externalTools.length; i++) {
                    var externalTool = externalTools[i];
                    externalTool.toggleDeactivate();
                }
            };

            $scope.resetAllToggles = function () {
                self.resetAllToggles();
            };
            $scope.$emit('toolbarController', self);

            $scope.addDynamicLayer = function (layerData) {
                $scope.geoConfig.layerMaps.push({
                    mapType: layerData.layerType,
                    visibility: true,
                    name: layerData.layerName,
                    url: layerData.layerUrl,
                    layers: layerData.includedLayers,
                    opacity: 100
                });
                $scope.addDynamicLayerDialogController.closeDialog();
            };
        } ]);

    app.service('externalToolService', [function () {
        var registeredTools = [];
        return {
            registerTool: function (tool) {
                registeredTools.push(tool);
            },
            allTools: function () {
                return registeredTools;
            }
        };
    }]);
})();