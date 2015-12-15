/**
 * Created by u87196 on 29/10/2015.
 */

(function () {
    "use strict";

    var app = angular.module('interactiveMaps.health-controller', ['interactiveMaps.health-services']);

    app.controller('healthController', [ '$scope', 'HealthService', function ($scope, HealthService) {
        'use strict';
        var layers;

        HealthService.getMasterLayerList().then(function (result) {
            layers = result.layers;

            for (var i = 0; i < layers.length; i++) {
                if (!layers[i].mapType.startsWith('Google')) {
                    var url = layers[i].url;

                    if (layers[i].mapType == 'WMS') {
                        url.concat('?request=GetCapabilities&service=WMS');
                    }

                    HealthService.checkService(layers[i].url, i).then(function (result) {
                        layers[result.id].isValid = true;
                        layers[result.id].status = result.data.status;
                    }, function error(err) {
                        var message = '';

                        if (err.data != '') {
                            message = err.data;
                        } else if (err.statusText != '') {
                            message = err.statusText;
                        }

                        layers[err.id].isValid = false;
                        layers[err.id].status = err.status;
                        layers[err.id].message = message;
                    });
                } else {
                    layers[i].isValid = true;
                    layers[i].status = 200;
                }
            }
            $scope.layers = layers;
        });
    } ]);
})();