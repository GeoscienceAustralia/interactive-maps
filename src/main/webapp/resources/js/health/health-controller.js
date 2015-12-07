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
                        layers[result.id].status = true;
                    }, function error(err) {
                        layers[err.id].status = false;
                        console.log(err.reason);
                    });
                } else {
                    layers[i].status = true;
                }
            }
            $scope.layers = layers;
        });
    } ]);
})();