/* global angular, $*/
(function () {
    "use strict";

    var app = angular.module('interactiveMaps.tools.info', [ 'interactiveMaps.services' ]);

    app.controller('infoToggleController', [ '$scope', '$timeout', 'toolService',
        function ($scope, $timeout, toolService) {
            var tool;
            $scope.infoLayerName = "infoMarkers";
            $scope.infoActive = false;

            $scope.$on('infoToggleReady', function (event, args) {
                $scope.infoToggleReady = args;
                tool = toolService.createSimpleTool('info', 'info', function () {
                    return $scope.infoToggleReady;
                }, function () {
                    return $scope.infoActive;
                }, function (toolbarScope, toolbarController) {
                    $scope.toolParentScope = toolbarScope;
                    $scope.toolParentController = toolbarController;
                });
                $scope.$emit('registerTool', tool);
            });

            $scope.$on("infoReady", function (event, args) {
                $scope.infoPanelController = args;
            });

            // Fires when toggle opens
            $scope.infoOn = function () {
                $scope.infoActive = true;
                $scope.toolParentController.activateToggle(tool);
            };

            // Fires when toggle closes
            $scope.infoOff = function () {
                $scope.infoActive = false;
                $scope.toolParentController.deactivateToggle(tool);

            };
        } ]);

    app.controller('infoPanelController', [ '$scope',
        function ($scope) {
            $scope.infoList = $scope.$parent.$parent.tool.config.infoList;

        } ]);
})();