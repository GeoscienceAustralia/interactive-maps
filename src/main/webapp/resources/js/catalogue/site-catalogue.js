/* global angular, $*/
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.catalogue.site-catalogue', [ 'interactiveMaps.services', 'interactiveMaps.map-services' ]);

    //Default controller for the / route
    app.controller('siteCatalogueController', [ '$scope', '$http', function ($scope, $http) {
        $http.get('api/config/site-config.json').success(function (response) {
            $scope.initialiseSiteConfig(response);
        }).error(function (data, status, headers, config) {
            //TODO log
        });

        $scope.initialiseSiteConfig = function (response) {
            $scope.$emit('configDataLoaded', response);
            $scope.themes = response.themes;
            $scope.siteConfig = response;
        };
    } ]);
})();