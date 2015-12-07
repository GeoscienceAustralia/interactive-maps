var angular = angular || {};

var app = angular.module('interactiveMaps.termsAndConditions', []);

// Controller for the terms and conditions modal
app.controller('termsAndConditionsController', [ '$scope', '$modalInstance', 'geoConfig', '$routeParams', 'interactiveMapsTermsAndConditions', '$location', '$timeout',
    function ($scope, $modalInstance, geoConfig, $routeParams, interactiveMapsTermsAndConditions, $location, $timeout) {
        'use strict';
        //$destroy for modals doesn't seem to be working.
        //Might be to do with -> https://github.com/angular-ui/bootstrap/issues/1643
        //Below is a work around.
        $scope.useTermsUrl = geoConfig.termsAndConditionsUrl != null && geoConfig.termsAndConditionsUrl != '';
        $scope.termsBody = geoConfig.termsAndConditionsText;
        $scope.termsUrl = geoConfig.termsAndConditionsUrl;
        $scope.closed = false;
        var listener = $scope.$on('$routeChangeSuccess', function () {
            if ($routeParams.mapId == null) {
                if ($modalInstance != null && !$scope.closed) {
                    $modalInstance.close();
                }
                listener();
            }
        });

        $scope.$on('$destroy', function () {
            listener();
        });

        // Creates anew cookie and closes the modal
        var config = geoConfig;
        $scope.ok = function () {
            interactiveMapsTermsAndConditions.setCookie(config);
            $modalInstance.close();
        };

        // Closes the modal and navigates to the theme the user came from
        $scope.cancel = function () { console.log($scope)
            var path = $location.path().split('/map');

            if (path.length > 0) {
                $location.path(path[0]);
            } else {
                $location.path('/');
            }

            $scope.closed = true;
            $modalInstance.close();
        };
    } ]);

/*
 * Not using angularjs $cookieStore here due to the expiration requirements
 * At the time of writing, angularjs $cookieStore did not support custom expire
 * values.*/
app.service('interactiveMapsTermsAndConditions', [ function () {
    "use strict";

    var service = {
        userHasValidTermsAndConditionsCookie: function (geoConfig) {
            var cookies = document.cookie;
            var cookieName = geoConfig.termsAndConditionsCookieName || "INTERACTIVEMAPS-" + geoConfig.id;
            if (cookies.indexOf(cookieName) !== -1) {
                service.setCookie(geoConfig);
                return true;
            } else {
                return false;
            }
        },
        setCookie: function (geoConfig) {
            var today = new Date();
            var expire = new Date();

            var cookieName = geoConfig.termsAndConditionsCookieName || "INTERACTIVEMAPS-" + geoConfig.id;
            var cookieValue = "INTERACTIVEMAPS";
            var daysToExpiry = geoConfig.cookieExpirationInDays == null ? 1 : geoConfig.cookieExpirationInDays;

            expire.setTime(today.getTime() + 3600000
                * 24
                * daysToExpiry);
            document.cookie = cookieName + "="
                + escape(cookieValue)
                + ";expires="
                + expire.toGMTString();
        }
    };

    return service;
} ]);