/* global angular, $ */
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.tools.addDynamicLayer', [ 'interactiveMaps.services', 'geowebtoolkit.utils' ]);
    app.controller('addDynamicLayerPanelController', [ '$scope', function ($scope) {
        "use strict";
        $scope.createLayer = function () {
            $scope.geoConfig.layerMaps.push({
                mapType: $scope.dialogModel.layerType,
                name: $scope.dialogModel.layerName,
                url: $scope.dialogModel.layerUrl,
                layers: $scope.dialogModel.includedLayers,
                opacity: 1.0
            });
        };
    }]);
    app.controller('addLayerToggleController', [ '$scope', function ($scope) {
        "use strict";
        $scope.addLayerToggleOn = function () {
            $scope.dynamicLayerActive = true;
        };
        $scope.addLayerToggleOff = function () {
            $scope.dynamicLayerActive = false;
        };
    } ]);
})();