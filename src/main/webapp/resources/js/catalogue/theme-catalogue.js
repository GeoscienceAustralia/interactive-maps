/* global angular, $*/
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.catalogue.theme-catalogue', [ 'interactiveMaps.services', 'interactiveMaps.map-services' ]);
    //Default controller for the /theme/:themeId route
    app.controller('themeCatalogueController', [ '$scope','themeService', function ($scope,themeService) {
        'use strict';

        $scope.$on('$routeChangeSuccess', function (event, routeData) {
            $scope.themeId = routeData.params.themeId;
            themeService.getThemeConfig($scope.themeId).then(function (response) {
                $scope.geoConfig = response.data;
                $scope.maps = $scope.geoConfig.maps;
                $scope.tags = $scope.geoConfig.tags;
            });
        });
    } ]);

    app.service('themeService', ['$http', function ($http) {
        return {
            getThemeConfig: function(themeId) {
                return $http({
                    method: 'GET',
                    url: 'api/config/' + themeId + '/app.json'
                });
            }
        };
    }])
})();

