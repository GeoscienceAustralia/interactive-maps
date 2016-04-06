/* global angular, $ */
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.configCreator.mapDetailsAccordion', [ 'interactiveMaps.services','geowebtoolkit.core.data-services' ]);

    app.controller('mapDetailsAccordion', ['$scope', '$log', '$timeout', '$http', 'GeoMapService', 'configCreatorService',
        function ($scope, $log, $timeout, $http, GeoMapService, configCreatorService) {
            $scope.populateExtent = function () {
                if(!$scope.mapController) {
                    return;
                }

                if(!$scope.config.initialExtent) {
                    $scope.config.initialExtent = [
                        [0,0],
                        [0,0]
                    ];
                }
                resetCenterPosition();

                /* Fix to show correct value with OL specific for longitude
                 * $scope.config.initialExtent[1][0] = parseFloat(me[3][1].toFixed(2)) > 180 ?
                 (parseFloat(me[3][1].toFixed(2) - 180 * -1) + (parseFloat(me[3][1].toFixed(2) - 180))) :
                 parseFloat(me[3][1].toFixed(2));
                 *
                 * */

                var me = $scope.mapController.getCurrentMapExtent();
                $scope.config.initialExtent[0][0] = parseFloat(me[0][0].toFixed(2));
                $scope.config.initialExtent[0][1] = parseFloat(me[0][1].toFixed(2));
                $scope.config.initialExtent[1][0] = parseFloat(me[3][0].toFixed(2));
                $scope.config.initialExtent[1][1] = parseFloat(me[3][1].toFixed(2));
                $scope.modelChanged();
            };

            $scope.populateCenterPosition = function () {
                resetInitialExtent();
                var currentExtent = $scope.mapController.getCurrentMapExtent();
                var tl = (currentExtent[0][1] - currentExtent[3][1]) / 2;
                var br = (currentExtent[0][0] - currentExtent[3][0]) / 2;

                var tlsum = currentExtent[0][1] - Math.abs(tl);
                var brsum = currentExtent[0][0] + Math.abs(br);
                $timeout(function () {
                    $scope.config.centerPosition = $scope.config.centerPosition || [];
                    $scope.config.centerPosition[1] = parseFloat(tlsum.toFixed(2));
                    $scope.config.centerPosition[0] = parseFloat(brsum.toFixed(2));
                    $scope.modelChanged();
                });
            };

            function resetInitialExtent() {
                $scope.config.initialExtent = null;
            }

            function resetCenterPosition() {
                $scope.config.centerPosition = null;
            }
        }]);
})();

