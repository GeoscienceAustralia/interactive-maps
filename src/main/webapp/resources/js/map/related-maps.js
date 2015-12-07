/* global angular, $*/
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.map.related-maps', []);

    app.controller('relatedMapsController', ['$scope', '$http', '$routeParams', function ($scope,$http,$routeParams) {
        if($routeParams.themeId && $routeParams.mapId) {
            $scope.isMap = true;
            $http.get('api/config/' + $routeParams.themeId + '/app.json').success(function (response) {
                var relatedMaps = [];

                // Filter out the current map so it doesnt appear in the list
                for (var i = 0; i < response.maps.length; i++) {
                    //Any maps without 'id' are external application links. Exclude from related maps.
                    if (response.maps[i].id != $routeParams.mapId && response.maps[i].id != null) {
                        relatedMaps.push(response.maps[i]);
                    }
                }
                $scope.relatedMaps = relatedMaps;
            }).error(function (data, status, headers, config) {
                //TODO log
            })
        }
    }]);
})();