/**
 * Created by u87196 on 8/09/2015.
 */

(function () {
    "use strict";

    var app = angular.module('interactiveMaps.map-position-controller', ['interactiveMaps.services']);

    app.controller('resetMapPositionController', [ '$scope',
        function ($scope) {
            $scope.setInitialExtent = function () {
                $scope.mapController.resetInitialExtent();
            };
        }
    ]);
})();