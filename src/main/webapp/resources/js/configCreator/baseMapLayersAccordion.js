/* global angular, $ */
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.configCreator.baseMapLayerAccordion', [ 'interactiveMaps.services','geowebtoolkit.core.data-services' ]);

    app.controller('baseMapLayerAccordion', ['$scope', '$log', '$timeout', '$http', 'GeoMapService', 'configCreatorService',
        function ($scope, $log, $timeout, $http, GeoMapService, configCreatorService) {
            $scope.addBaseLayer = function () {
                var previousCount = $scope.config.baseMaps ? $scope.config.baseMaps.length : 0;
                $log.info($scope.baseLayerConfig);
                if ($scope.isPreconfiguredBaseLayer($scope.baseLayerConfig)) {
                    var layerConfig = angular.copy($scope.commonBaseLayers[$scope.baseLayerConfig.mapType]);
                    $scope.config.baseMaps.push(layerConfig);
                    $scope.config.initialExtent = [
                        [30, 10],
                        [180, -70]
                    ];
                } else {
                    var layerConfig = angular.copy($scope.baseLayerConfig);
                    $scope.config.baseMaps.push(layerConfig);
                }

                $scope.modelChanged();
                if (previousCount === 0) {
                    $scope.previewMap();
                }
            };

            $scope.removeBaseLayer = function (index) {
                $scope.config.baseMaps.splice(index, 1);
                $scope.modelChanged();
            };

        }]);
})();
