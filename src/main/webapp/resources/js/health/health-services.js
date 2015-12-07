/**
 * Created by u87196 on 29/10/2015.
 */

var angular = angular || {};

var app = angular.module('interactiveMaps.health-services', []);

app.service('HealthService', ['$http', '$q', 'geoConfig', function ($http, $q, geoConfig) {

    var service = {
        getMasterLayerList: function () {
            var deferred = $q.defer();

            var layerListPromise = $http.get('api/config/master-layer-list.json').success(function (response) {
                deferred.resolve(response);
            }).error(function (data, status, headers, config) {
                deferred.reject("Error retrieving master layer list");
            });

            return deferred.promise;
        },
        checkService: function (url, id) {
            var deferred = $q.defer();

            var requestParams = {
                url: url
//                ,
//                proxy : geoConfig().defaultOptions.proxyHost
            };

            var layerListPromise = $http.get(url).success(function (response) {
                var returnObject = {
                    'data': response,
                    'id': id
                };
                deferred.resolve(returnObject);
            }).error(function (data, status, headers, config) {
                var returnObject = {
                    'reason': 'Check service failed for ' + url,
                    'id': id
                };
                deferred.reject(returnObject)
            });

            return deferred.promise;
        }
    }

    return service;
}]);
