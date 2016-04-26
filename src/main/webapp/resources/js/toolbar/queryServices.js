var angular = angular || {};
var console = console || {};

var app = angular.module('interactiveMaps.queryServices', []);

app.service('QueryService', ['WMSDataService', '$q', '$http', function (WMSDataService, $q, $http) {
    'use strict';
    var service = {
        QueryWMSFeaturesByLayer: function (mapController, layer, event) {
            return mapController.getWMSFeatures(
                layer.queryUrl,
                layer.queryLayers,
                layer.queryVersion,
                event,
                layer.queryInfoFormat);
        },
        preResolveQuery: function (callback) {

        },
        postResolveQuery: function () {

        },
        preCreateLayerQuery: function () {

        },
        postCreateLayerQuery: function () {

        },
        preCreateEndpointQuery: function () {

        },
        postCreateEndpointQuery: function () {

        },
        processInterrogationFeatures: function (mapController, mapConfig, toolConfigData, featureResults, relatedLayers, relatedEndpoints, postProcessFeatureCallback) {
            var allFeatures = [];
            var primaryProp = toolConfigData.primaryPropertyName;
            for (var i = 0; i < featureResults.length; i++) {
                var features = featureResults[i].features;
                for (var j = 0; j < features.length; j++) {
                    var feature = features[j];
                    if (postProcessFeatureCallback != null) {
                        feature = postProcessFeatureCallback(feature);
                    }

                    if (toolConfigData.primaryPropertyName != null &&
                        toolConfigData.primaryPropertyName !== "" &&
                        feature.properties[toolConfigData.primaryPropertyName] != null &&
                        feature.properties[toolConfigData.primaryPropertyName] !== "") {
                        feature.subtitle = feature.properties[toolConfigData.primaryPropertyName];
                    }

                    if (toolConfigData.featureTitle) {
                        feature.title = toolConfigData.featureTitle;
                    } else if (relatedLayers[i] != null) {
                        feature.title = relatedLayers[i].layer.name;
                    } else if (relatedEndpoints[i] != null) {
                        feature.title = relatedEndpoints[i].endpoint.featureTitle;
                    }
                }
                Array.prototype.push.apply(allFeatures, features);
            }
            if (!toolConfigData.showEmptyFeatures) {
                for (var featureIndex = 0; featureIndex < allFeatures.length; featureIndex++) {
                    var updateFeature = allFeatures[featureIndex];
                    if (updateFeature == null || updateFeature.properties == null) {
                        allFeatures.splice(featureIndex, 1);
                        featureIndex--;
                    } else {
                        if (updateFeature.crs == null || updateFeature.crs === undefined) {
                            updateFeature.crs = {
                                properties: {
                                    name: mapConfig.datumProjection
                                }
                            };
                        }
                    }
                }
            }

            //Sort by primary property
            allFeatures = allFeatures.sort(function (a, b) {
                if (a.properties[primaryProp] < b.properties[primaryProp]) {
                    return -1;
                }
                if (a.properties[primaryProp] > b.properties[primaryProp]) {
                    return 1;
                }
                return 0;
            });
            return allFeatures;
        },
        createEndpointQueries: function (mapController, mapConfig, toolConfigData, event, preCreateCallback, postCreateCallback) {
            var promises = [];
            for (var endPointIndex = 0; endPointIndex < toolConfigData.endpoints.length; endPointIndex++) {
                if (service.isVisibleEndpoint(toolConfigData.endpoints[endPointIndex], mapConfig.layerMaps)) {
                    var ep = toolConfigData.endpoints[endPointIndex];
                    preCreateCallback(ep, endPointIndex);
                    if (ep.queryType === 'WFS') {
                        promises.push(service.QueryWFSFeatureByConfiguredEndpoint(mapController, ep, event, toolConfigData));
                    }
                    if (ep.queryType === 'WMS') {
                        promises.push(service.QueryWMSFeaturesByConfiguredEndpoint(
                            mapController,
                            ep,
                            event));
                    }
                    if (ep.queryType === 'ArcGISREST') {
                        promises.push(service.QueryArcGISRESTByConfiguredEndpoint(mapController, ep, event, 'EPSG:4326',toolConfigData));
                    }
                    postCreateCallback(ep, endPointIndex);
                }
            }
            return promises;
        },
        isVisibleEndpoint: function (endPoint, layers) {
            // Check if the endPoint has a visibleLayerName, if it does and it is visible query it
            if (endPoint.visibleLayerName) {
                for (var i = 0; i < layers.length; i++) {
                    if (layers[i].name == endPoint.visibleLayerName && layers[i].visibility == true) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return true;
            }
        },
        createLayerQueries: function (mapController, mapConfig, toolConfigData, event, preCreateCallback, postCreateCallback) {
            var layers = mapConfig.layerMaps;
            var promises = [];
            for (var i = 0; i < layers.length; i++) {
                var l = layers[i];
                //Marked for feature query
                if (l.queryFeatures === true && layers[i].visibility == true) {
                    preCreateCallback(l, i);
                    //Provided endpoint override, eg if layer is XYZ, WMS alternate url provided
                    if (l.queryUrl != null) {
                        if (l.queryUrlType === 'WMS') {
                            promises.push(service.QueryWMSFeaturesByLayer(mapController, l, event, toolConfigData));
                        }
                        if (l.queryType === 'WFS') {
                            promises.push(service.QueryWFSFeaturesByLayer(mapController, l, event));
                        }
                    } else {
                        //No query override provided, use layer information to query
                        promises.push(
                            WMSDataService.getWMSFeaturesByLayerId(mapController.getMapInstance(), l.url, l.id, event.xy)
                        );
                    }
                    postCreateCallback(l, i);
                }
            }

            return promises;
        },
        QueryWMSFeaturesByConfiguredEndpoint: function (mapController, endpointConfig, event) {
            return mapController.getWMSFeatures(
                endpointConfig.queryUrl,
                endpointConfig.queryLayers,
                endpointConfig.queryVersion,
                event,
                endpointConfig.queryInfoFormat);
        },
        QueryWFSFeatureByConfiguredEndpoint: function (mapController, endpoint, event, toolConfig) {
            return mapController.getFeatureInfo(
                endpoint.url,
                endpoint.featureType,
                endpoint.featurePrefix,
                endpoint.geometryName,
                event,
                toolConfig.sizeOfBBox);
        },
        QueryWFSFeaturesByLayer: function (mapController, layer, event, toolConfig) {
            return mapController.getFeatureInfo(
                layer.queryUrl,
                layer.queryFeatureType,
                layer.queryFeaturePrefix,
                layer.queryGeometryName,
                event,
                toolConfig.sizeOfBBox);
        },
        QueryArcGISRESTByConfiguredEndpoint: function (mapController, endpoint, event, displayProjection, toolConfig) {
            var deferred = $q.defer();
            var pixelPoint = mapController.getPointFromEvent(event);
            var point = mapController.getLonLatFromPixel(pixelPoint.x, pixelPoint.y, displayProjection);
            var proj = displayProjection === 'EPSG:4326' ? 4326 : 3857; //Only supported wkids
            var geometry = {"x": point.lon, "y": point.lat, "spatialReference": {"wkid": proj}};
            var tolerance = endpoint.tolerance || 2;
            var me = mapController.getCurrentMapExtent();
            var mapExtent = '' + me[0][0] + ',' + me[0][1] + ',' + me[3][0] + ',' + me[3][1];
            var arcGISUrl = endpoint.url + "/Identify?geomtryType=esriGeometryPoint" +
                "&geometry=" + encodeURIComponent(JSON.stringify(geometry)) +
                "&layers=" + encodeURIComponent(endpoint.layers) +
                "&mapExtent=" + encodeURIComponent(mapExtent) +
                "&tolerance=" + encodeURIComponent(tolerance) +
                "&imageDisplay=" + encodeURIComponent(endpoint.imageDisplay) +
                "&returnGeometry=true&maxAllowableOffset=&f=pjson";
            $http.get(arcGISUrl).success(function (response) {
                var features = response.results;
                var results = [];
                for (var i = 0; i < features.length; i++) {
                    var feature = features[i];
                    results.push(service.convertEsriFeature(feature, displayProjection));
                }
                deferred.resolve({type: "FeatureCollection", features: results });
            }).error(function (response) {
                throw new Error("ESRI ArcGISREST service request failed");
            });

            return deferred.promise;
        },
        ringIsClockwise: function (ringToTest) {
            var total = 0, i = 0,
                rLength = ringToTest.length,
                pt1 = ringToTest[i],
                pt2;
            for (i; i < rLength - 1; i++) {
                pt2 = ringToTest[i + 1];
                total += (pt2[0] - pt1[0]) * (pt2[1] + pt1[1]);
                pt1 = pt2;
            }
            return (total >= 0);
        },
        convertEsriGeom: function (esriGeom) {
            var gcGeom,
                i,
                coordinates,
                geomType,
                geomParts,
                polyArray,
                ring;

            //check for x, points, paths, or rings to determine geometry type.
            if (esriGeom) {
                //gcGeom = {};
                if (((esriGeom.x && esriGeom.x !== "NaN") || esriGeom.x === 0) &&
                    ((esriGeom.y && esriGeom.y !== "NaN") || esriGeom.y === 0)) {
                    geomType = "Point";
                    coordinates = [esriGeom.x, esriGeom.y];
                } else if (esriGeom.points && esriGeom.points.length) {
                    geomType = "MultiPoint";
                    coordinates = esriGeom.points;
                } else if (esriGeom.paths && esriGeom.paths.length) {
                    geomParts = esriGeom.paths;
                    if (geomParts.length === 1) {
                        geomType = "LineString";
                        coordinates = geomParts[0];
                    } else {
                        geomType = "MultiLineString";
                        coordinates = geomParts;
                    }
                } else if (esriGeom.rings && esriGeom.rings.length) {
                    //array to hold the individual polygons. A polygon is an outer ring with one or more inner rings
                    //the conversion logic assumes that the Esri json is in the format of an outer ring (clockwise)
                    //followed by inner rings (counter-clockwise) with a clockwise ring signalling the start of a new polygon
                    polyArray = [];
                    geomParts = esriGeom.rings;
                    for (i = 0; i < geomParts.length; i++) {
                        ring = geomParts[i];
                        if (service.ringIsClockwise(ring)) {
                            //outer ring so new polygon. Add to poly array
                            polyArray.push([ring]);
                        } else if (polyArray.length > 0) {
                            //inner ring. Add as part of last polygon in poly array
                            polyArray[polyArray.length - 1].push(ring);
                        }
                    }
                    if (polyArray.length > 1) {
                        //MultiPolygon. Leave coordinates wrapped in outer array
                        coordinates = polyArray;
                        geomType = "MultiPolygon";
                    } else {
                        //Polygon. Remove outer array wrapper.
                        coordinates = polyArray.pop();
                        geomType = "Polygon";
                    }
                }
                gcGeom = (coordinates && geomType) ? {type: geomType, coordinates: coordinates} : null;
                return gcGeom;
                //gcGeom.coordinates = coordinates;
            }
            return gcGeom;
        },
        convertEsriFeature: function (esriFeature, displayProjection) {
            var gcFeat = null,
                prop,
                gcProps;
            if (esriFeature) {
                gcFeat = {
                    type: "Feature"
                };
                if (esriFeature.geometry) {
                    gcFeat.geometry = service.convertEsriGeom(esriFeature.geometry);
                }
                if (esriFeature.attributes) {
                    gcProps = {};
                    for (prop in esriFeature.attributes) {
                        if (esriFeature.attributes.hasOwnProperty(prop)) {
                            gcProps[prop] = esriFeature.attributes[prop];
                        }
                    }
                    gcFeat.properties = gcProps;
                }
                gcFeat.crs = { properties: { name: displayProjection}};
            }
            return gcFeat;
        }
    };
    return service;
} ]);