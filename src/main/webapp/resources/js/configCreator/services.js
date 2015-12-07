/* global angular, $ */
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.configCreator.services', []);

    app.factory('configCreatorService', [ function () {
        return {
            updateJSONConfigOutput: function () {
            },

            b64EncodeUnicode: function (str) {
                return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, p1) {
                    return String.fromCharCode('0x' + p1);
                }));
            }
        };
    } ]);
})();
