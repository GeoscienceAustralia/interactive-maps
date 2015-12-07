/* global angular, $ */
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.configCreator.toolsAccordion', [ 'interactiveMaps.services','geowebtoolkit.core.data-services' ]);

    app.controller('toolsAccordion', ['$scope', '$log', '$timeout', '$http', 'GeoMapService', 'configCreatorService',
        function ($scope, $log, $timeout, $http, GeoMapService, configCreatorService) {
            $scope.addRemoveToolFromJSON = function (index) {
                var foundTool = false;
                var foundToolIndex = 0;
                $scope.config.toolsConfig = $scope.config.toolsConfig || {};
                $scope.config.toolsConfig.tools = $scope.config.toolsConfig.tools || [];
                for (var i = 0; i < $scope.config.toolsConfig.tools.length; i++) {
                    if ($scope.commonTools[index].id === $scope.config.toolsConfig.tools[i].id) {
                        foundTool = true;
                        foundToolIndex = i;
                    }
                }

                if (foundTool === true) {
                    // remove tool
                    $scope.config.toolsConfig.tools.splice(foundToolIndex, 1);
                    $scope.modelChanged();
                }
                else {
                    // add tool
                    $scope.config.toolsConfig.tools.push($scope.commonTools[index]);
                    $scope.modelChanged();
                }
            };


            $scope.toolAlreadyAdded = function (toolItem) {
                if (!toolItem.id) {
                    return false;
                }

                if (!$scope.config || !$scope.config.toolsConfig || !$scope.config.toolsConfig.tools || $scope.config.toolsConfig.tools.length === 0) {
                    return false;
                }

                var foundTool = false;
                for (var i = 0; i < $scope.config.toolsConfig.tools.length; i++) {
                    if (toolItem.id === $scope.config.toolsConfig.tools[i].id) {
                        foundTool = true;
                        break;
                    }
                }
                return foundTool;
            };

        }]);
})();
