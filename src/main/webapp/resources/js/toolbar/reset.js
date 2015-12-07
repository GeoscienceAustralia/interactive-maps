var angular = angular || {};
var console = console || {};

var app = angular.module('interactiveMaps.tools.reset', [ 'geowebtoolkit.utils' ]);

app.directive('geoResetControl', [function () {
    'use strict';
    var templateCache =
        '<button ng-click="resetClicked()" type="button">' +
        '<div ng-transclude></div>' +
        '</button>';
    return {
        restrict: "E",
        replace: "true",
        template: templateCache,
        transclude: true,
        scope: {
            mapController: '=',
            geoConfig: '=',
            onReset: '&'
        },
        link: function ($scope, $element, $attrs) {
            //Internals have been commented out due to time contraints.
            //Ideally the reset to efficiently manipulate layers back to original state
            //Current config is wiped and reset causing angular to pick up the change
            //and start again.
            //TODO this could be used for an optimisation or if more granular control of reset is required in future.
            $scope.resetClicked = function () {

//				// Set the center position of the map
//				$scope.mapController.setCenter($scope.geoConfig.centerPosition.lat, $scope.geoConfig.centerPosition.lon);
//
//				var layers = $scope.mapController.getLayers();
//
//				// Reset base layers visibility
//				for (var i = 0; i < $scope.geoConfig.baseMaps.length; i++) {
//					for (var j = 0; j < layers.length; j++) {
//						if ($scope.geoConfig.baseMaps[i].name === layers[j].name) {
//							$scope.mapController.setLayerVisibility(layers[j].id, $scope.geoConfig.baseMaps[i].visibility);
//							break;
//						}
//					}
//				}
//
//				// Reset non base layers visibility and opacity
//				for (var i = 0; i < $scope.geoConfig.layerMaps.length; i++) {
//					for (var j = 0; j < layers.length; j++) {
//						if ($scope.geoConfig.layerMaps[i].name === layers[j].name) {
//							$scope.mapController.setLayerVisibility(layers[j].id, $scope.geoConfig.layerMaps[i].visibility);
//							$scope.mapController.setOpacity(layers[j].id, $scope.geoConfig.layerMaps[i].opacity);
//							break;
//						}
//					}
//				}
//
//				// Clear any marker layers
//				for (var i = 0; i < layers.length; i++) {
//					if (layers[i].type === 'Markers') {
//						$scope.mapController.removeLayerByName(layers[i].name);
//					}
//				}
//
//				// Reset the zoom level
//				$scope.mapController.zoomTo($scope.geoConfig.zoomLevel);

                $scope.mapController.resetMapFired();
                $scope.onReset();
            };
        }
    };
} ]);