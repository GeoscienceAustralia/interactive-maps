/* global angular, $ */
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.configCreator.navigationAccordion', [ 'interactiveMaps.services', 'geowebtoolkit.core.data-services' ]);

    app.controller('navigationAccordion', ['$scope', '$log', '$timeout', '$http', 'GeoMapService', 'configCreatorService',
        function ($scope, $log, $timeout, $http, GeoMapService, configCreatorService) {
            $scope.addRemoveAboutPage = function () {
                if (!$scope.config || !$scope.config.aboutConfig) {
                    $scope.config.aboutConfig = $scope.commonTools.aboutConfig;
                    $scope.config.aboutConfig.enabled = false;
                }

                if ($scope.config.aboutConfig.enabled === true) {
                    delete $scope.config.aboutConfig;
                }
                else {
                    $scope.config.aboutConfig.enabled = true;
                }
                $scope.modelChanged();
            };

            $scope.addRemoveTermsAndConditions = function () {
                if ($scope.config.requiresTermsAndConditions) {
                    delete $scope.config.requiresTermsAndConditions;
                    delete $scope.config.termsAndConditionsText;
                    delete $scope.config.cookieExpirationInDays;
                }
                else {
                    $scope.config.requiresTermsAndConditions = $scope.commonTools.requiresTermsAndConditions;
                    $scope.config.termsAndConditionsText = $scope.commonTools.termsAndConditionsText;
                    $scope.config.cookieExpirationInDays = $scope.commonTools.cookieExpirationInDays;
                }
                $scope.modelChanged();
            };

            $scope.addRemoveLayersPanelTemplate = function () {
                if (!$scope.config || !$scope.config.layersConfig) {
                    $scope.config.layersConfig = $scope.commonTools.layersConfig;
                    $scope.config.layersConfig.enabled = false;
                }

                if ($scope.config.layersConfig.enabled === true) {
                    delete $scope.config.layersConfig;
                }
                else {
                    $scope.config.layersConfig.enabled = true;
                }
                $scope.modelChanged();
            };

            $scope.addRemoveLegendConfigTemplate = function () {
                if (!$scope.config || !$scope.config.legendConfig) {
                    $scope.config.legendConfig = $scope.commonTools.legendConfig;
                    $scope.config.legendConfig.enabled = false;
                }

                if ($scope.config.legendConfig.enabled === true) {
                    delete $scope.config.legendConfig;
                }
                else {
                    $scope.config.legendConfig.enabled = true;
                }
                $scope.modelChanged();
            };
        }]);
})();