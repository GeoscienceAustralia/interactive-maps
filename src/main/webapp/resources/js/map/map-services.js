var angular = angular || {};

var app = angular.module('interactiveMaps.map-services', []);

app.service('MasterLayersService', ['$http', '$q', function ($http, $q) {

    var service = {
        initMasterLists: function () {
            var deferred = $q.defer();
            var layerListPromise = $http.get('api/config/master-layer-list.json').success(function (response) {
                service.masterLayerList = response;
            }).error(function (data, status, headers, config) {
                //TODO log
            });

            // Load the master layer list
            var toolsListPromise = $http.get('api/config/master-tool-list.json').success(function (response) {
                service.masterToolList = response;
            }).error(function (data, status, headers, config) {
                //TODO log
            });

            $q.all([layerListPromise, toolsListPromise]).then(function () {
                deferred.resolve();
            });
            return deferred.promise;
            // Load the master layer list

        },
        loadFromMasterLayerList: function (layers) {
            if (!service.masterLayerList) {
                throw new Error("Master Layer list not loaded");
            }

            var result = [];

            if (layers != null) {
                // Loop over the layer list and if the layer contains a slug then substitute the layer config from the master list
                for (var index = 0; index < layers.length; index++) {
                    var layerMap = layers[index];
                    var loadedFromMasterList = false;

                    for (var mLayerIndex = 0; mLayerIndex < service.masterLayerList.layers.length; mLayerIndex++) {
                        var masterLayer = service.masterLayerList.layers[mLayerIndex];

                        if (layerMap.slug != null) {
                            if (masterLayer.slug === layerMap.slug) {
                                var tmpLayer = angular.copy(masterLayer);
                                result.push($.extend(true, tmpLayer, layerMap));
                                loadedFromMasterList = true;
                                break;
                            }
                        }
                    }

                    if (!loadedFromMasterList) {
                        result.push(layerMap);
                    }
                }
            }

            return result;
        },
        loadFromMasterToolList: function (tools) {
            if (!service.masterToolList) {
                throw new Error("Master Tool list not loaded");
            }

            var result = [];

            if (tools != null) {
                // Loop over the tool list and if the layer contains a slug then substitute the tool config from the master list
                for (var index = 0; index < tools.length; index++) {
                    var tool = tools[index];
                    var loadedFromMasterList = false;

                    for (var mToolIndex = 0; mToolIndex < service.masterToolList.tools.length; mToolIndex++) {
                        var masterTool = service.masterToolList.tools[mToolIndex];

                        if (tool.id != null) {
                            if (masterTool.id === tool.id) {
                                var tmpTool = angular.copy(masterTool);
                                result.push($.extend(true, tmpTool, tool));
                                loadedFromMasterList = true;
                                break;
                            }
                        }
                    }

                    if (!loadedFromMasterList) {
                        result.push(tool);
                    }
                }
            }

            return result;
        }
    };

    return service;
}]);

app.service('MeasureDistanceService', [ '$http', '$q', '$timeout', function ($http, $q, $timeout) {
    'use strict';

    var service = {
        distanceToAustralianCoast: function (searchCriteria) {
            var deferred = $q.defer();

            this.startPolling(searchCriteria, deferred);

            return deferred.promise;
        },
        constructRequest: function (searchCriteria) {
            var request = {};
            request.Input_Features = {};

            request.Input_Features = {
                sr: {
                    wkid: searchCriteria.datum
                }
            };
            request.Input_Features.geometryType = searchCriteria.geometryType;

            request.Input_Features.features = [];
            request.Input_Features.features.push({
                geometry: {
                    x: searchCriteria.longitude,
                    y: searchCriteria.latitude,
                    spatialReference: {
                        wkid: searchCriteria.datum
                    }
                }
            });

            request.Input_Features = JSON.stringify(request.Input_Features);

            return request;
        },
        makeRequest: function (url, jobId, deferred) {
            $http.post(url + "jobs/"
                + jobId
                + "?f=json", {}, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).success(function (data) {
                service.checkStatus(url, jobId, deferred, data);
            });
        },
        startPolling: function (searchCriteria, deferred) {
            $http.post(searchCriteria.url + "submitJob?f=json", $.param(this.constructRequest(searchCriteria)), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).success(function (data) {
                service.checkStatus(searchCriteria.url, data.jobId, deferred, data);
            });
        },
        checkStatus: function (url, jobId, deferred, data) {
            if (data != null && data.jobStatus === 'esriJobSucceeded') {
                service.makeFinalRequest(url, jobId, deferred, data);
            } else if (data != null && data.jobStatus === 'esriJobFailed') {
                deferred.reject(data);
            } else {
                $timeout(function () {
                    service.makeRequest(url, jobId, deferred);
                }, 3000);
            }
        },
        makeFinalRequest: function (url, jobId, deferred, data) {
            var containsInsideBoundaryInfo = data.results.Output_Inside != null;
            if (containsInsideBoundaryInfo) {
                var promises = [];

                promises.push(service.extractEsriData(url, jobId, 'Output_Lines', data));
                promises.push(service.extractEsriData(url, jobId, 'Output_Inside', data));

                $q.all(promises).then(function (results) {
                    var combinedDataResult = results[0];
                    combinedDataResult.isInsideBoundary = results[1].value;
                    deferred.resolve(combinedDataResult);
                });
            } else {
                service.extractEsriData(url, jobId, 'Output_Lines', data, deferred);
            }
        },
        extractEsriData: function (baseUrl, jobId, paramUrlName, data, deferred) {
            var innerDeferred;
            if (deferred) {
                innerDeferred = deferred;
            } else {
                innerDeferred = $q.defer();
            }

            $http.post(baseUrl + "jobs/"
                + jobId
                + "/"
                + data.results[paramUrlName].paramUrl
                + "?f=json&nocache= " + new Date().getTime(), {}, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            }).then(function (lineResult) {
                // Dodgy hack until the next version of ESRI is released
                if (lineResult.data.error != null) {
                    if (lineResult.data.error.code == '500') {
                        setTimeout(function () {
                            service.extractEsriData(baseUrl, jobId, paramUrlName, data, innerDeferred)
                        }, 500);
                    }
                } else {
                    innerDeferred.resolve(lineResult.data);
                }
            });

            return innerDeferred.promise;
        }
    };
    return service;
} ]);

app.service('ExportService', [ '$http', '$q', '$timeout', function ($http, $q, $timeout) {
    'use strict';

    var service = {
        exportMap: function (searchCriteria, deferredCanceller) {
            var deferred = $q.defer();

            this.startPolling(searchCriteria, deferred, deferredCanceller);

            return deferred.promise;
        },
        constructRequest: function (searchCriteria) {
            var request = {};

            request.Input_LayerList = searchCriteria.layerList;
            request.Input_Template = searchCriteria.template;
            request.Input_RoundScale = searchCriteria.roundScale;
            request.Input_Scale = searchCriteria.mapScale;
            request.Input_Title = searchCriteria.title;

            request.Input_Features = {};

            request.Input_Features = {
                sr: {
                    wkid: searchCriteria.datum
                }
            };
            request.Input_Features.geometryType = searchCriteria.geometryType;

            request.Input_Features.features = [];
            request.Input_Features.features.push({
                geometry: {
                    x: searchCriteria.longitude,
                    y: searchCriteria.latitude,
                    spatialReference: {
                        wkid: searchCriteria.datum
                    }
                }
            });

            request.Input_Features = JSON.stringify(request.Input_Features);

            return request;
        },
        makeRequest: function (url, jobId, deferred, deferredCanceller) {
            $http.get(url + "jobs/"
                    + jobId
                    + "?f=json", { timeout: deferredCanceller.promise }
            ).success(function (data) {
                    service.checkStatus(url, jobId, deferred, data, deferredCanceller);
                });
        },
        startPolling: function (searchCriteria, deferred, deferredCanceller) {
            var url = searchCriteria.url + 'submitJob?' +
                $.param(this.constructRequest(searchCriteria)) + "&f=pjson";

            $http.get(url, { timeout: deferredCanceller.promise }).success(function (data) {
                service.checkStatus(searchCriteria.url, data.jobId, deferred, data, deferredCanceller);
            });
        },
        checkStatus: function (url, jobId, deferred, data, deferredCanceller) {
            if (data != null && data.jobStatus === 'esriJobSucceeded') {
                service.makeFinalRequest(url, jobId, deferred, data, deferredCanceller);
            } else if (data != null && data.jobStatus === 'esriJobFailed') {
                deferred.reject(data);
            } else {
                $timeout(function () {
                    service.makeRequest(url, jobId, deferred, deferredCanceller);
                }, 3000);
            }
        },
        makeFinalRequest: function (url, jobId, deferred, data, deferredCanceller) {
            $http.get(url + "jobs/"
                    + jobId
                    + "/"
                    + data.results.Output_ResultsList.paramUrl
                    // no cache added to stop IE caching the request
                    + "?f=json&nocache= " + new Date().getTime(), { timeout: deferredCanceller.promise }
            ).success(function (resultData) {
                    if (resultData.error != null) {
                        if (resultData.error.code == '500') {
                            setTimeout(function () {
                                service.makeFinalRequest(url, jobId, deferred, data, deferredCanceller)
                            }, 500);
                        }
                    } else {
                        deferred.resolve(resultData);
                    }
                });
        }
    }
    return service;
} ]);

app.service('LayerService', ['$http', '$q', function ($http, $q) {

    var service = {
        updateLayer: function (layer, geoConfig) {
            var layerMaps = geoConfig.layerMaps;
            var baseMaps = geoConfig.baseMaps;
            var currentLayer;
            for (var i = 0; i < layerMaps.length; i++) {
                if (layerMaps[i].name === layer.name) {
                    currentLayer = layerMaps[i];
                    break;
                }
            }
            if (currentLayer !== undefined) {
                if (currentLayer.error === true) {
                    $log.error("Failed to updated layer - " + currentLayer.name);
                    var index = geoConfig.layerMaps.indexOf(currentLayer);
                    geoConfig.layerMaps.splice(index, 1);
                } else {
                    currentLayer.id = layer.id;
                    currentLayer.visibility = layer.visibility;
                }
            }
            var baseLayer;

            for (var j = 0; j < baseMaps.length; j++) {
                if (baseMaps[j].name === layer.name) {
                    baseLayer = baseMaps[j];
                    break;
                }
            }
            if (baseLayer !== undefined) {
                baseLayer.id = layer.id;
            }
        }
    }
    return service;
} ]);