/* global angular, $, OpenLayers */

var app = angular.module('interactiveMaps.tools.interrogateExport', [ 'interactiveMaps.services', 'interactiveMaps.queryServices' ]);

app.controller('interrogateExportPanelController', ['$scope', function ($scope) {
    "use strict";
    $scope.featureListChangePage = function () {
        $('.rightMenuContentInnerContainer')[0].scrollTop = 0;
    };
}]);

app.controller('interrogateExportToggleController', ['$scope', 'WMSDataService', '$timeout', '$q', 'QueryService',
    function ($scope, WMSDataService, $timeout, $q, QueryService) {
        "use strict";
        var tempMarkerLayer = "interrogateExportMarkerLayer";
        var layerPromiseArray = [];
        var endpointPromiseArray = [];
        $scope.resolveParentToolbar = function (toolbarScope) {
            $scope.parentToolScope = toolbarScope;
        };

        function ResolveAllQueryResults(datas, toolConfig) {
            var allFeatures = QueryService.processInterrogationFeatures(
                $scope.mapController,
                $scope.geoConfig,
                toolConfig.config,
                datas,
                layerPromiseArray,
                endpointPromiseArray,
                function (feature) {
                    // Add a coordinates field to the features which is converted to CRS 4326
                    var coords = feature.geometry.coordinates;
                    var lon;
                    var lat;
                    if (feature.geometry.type === 'Point') {
                        lon = coords[0];
                        lat = coords[1];
                    }
                    if (feature.geometry.type === 'MultiPolygon') {
                        lon = coords[0][0][0][0];
                        lat = coords[0][0][0][1];
                    }
                    //TODO remove dependence on OLV2
                    var mapPosition = OpenLayers.Projection.transform(
                        { x: lon, y: lat },
                        feature.crs.properties.name,
                        "EPSG:4326");
                    lon = mapPosition.x;
                    lat = mapPosition.y;

                    feature.WGS84Coords = lon.toFixed(2) + ", " + lat.toFixed(2);
                    feature.addedToCsv = false;
                    return feature;
                });

            var position = 0;
            for (var fIndex = 0; fIndex < allFeatures.length; fIndex++) {
                // Opens the accordion for first result
                if (position === 0) {
                    allFeatures[fIndex].isFirstOpen = true;
                    position++;
                } else {
                    allFeatures[fIndex].isFirstOpen = false;
                    position++;
                }
            }

            $scope.parentToolScope[toolConfig.id].features = allFeatures;
            $scope.parentToolScope[toolConfig.id].showSpinner = false;
        }

        var featuresList = [];

        $scope.interrogateExportToggleOn = function (toolConfig) {
            $scope.parentToolScope[toolConfig.id].features = [];
            $scope.parentToolScope[toolConfig.id] = $scope.parentToolScope[toolConfig.id] || {};

            $scope.onMapClick = function (e) {
                $scope.parentToolScope[toolConfig.id].selectedPosition = $scope.mapController.getLonLatFromPixel(e.xy.x, e.xy.y);
                var promises = [];
                layerPromiseArray = [];
                endpointPromiseArray = [];
                if ($scope.mapController.getMarkerCountForLayerName(tempMarkerLayer) > 0) {
                    $scope.mapController.removeLayerByName(tempMarkerLayer);
                }
                featuresList = [];

                // Setup the args from the map config
                var args = {
                    width: $scope.$parent.$parent.tool.config.markerWidth,
                    height: $scope.$parent.$parent.tool.config.markerHeight
                };
                $scope.mapController.setMapMarker(e.xy, tempMarkerLayer, $scope.$parent.$parent.tool.config.markerUrl, args);
                $scope.parentToolScope[toolConfig.id].showSpinner = true;
                $scope.$apply();

                //If the tool as endpoints registered, request data from them only
                if (toolConfig.config.endpoints != null && toolConfig.config.endpoints.length > 0) {
                    var endpointWithIndex;
                    var epPromises =
                        QueryService.createEndpointQueries($scope.mapController, $scope.geoConfig, toolConfig.config, e,
                            //Precreate hook
                            function (endpoint, index) {
                                endpointWithIndex = { index: index, endpoint: endpoint };
                            },
                            //Postcreate hook
                            function () {
                                endpointPromiseArray.push(endpointWithIndex);
                            });
                    Array.prototype.push.apply(promises, epPromises);
                } else {
                    //Else, if there are any layers marked queryable, go through them
                    var layerWithIndex;
                    var layerPromises =
                        QueryService.createLayerQueries($scope.mapController, $scope.geoConfig, toolConfig.config, e,
                            //Precreate hook
                            function (layer, index) {
                                layerWithIndex = { index: index, layer: layer};
                            },
                            //Postcreate hook
                            function () {
                                layerPromiseArray.push(layerWithIndex);
                            });
                    Array.prototype.push.apply(promises, layerPromises);
                }
                $q.all(promises).then(function (datas) {
                    ResolveAllQueryResults(datas, toolConfig);
                });
            };
            $scope.mapController.registerMapClick($scope.onMapClick);
        };

        $scope.interrogateExportToggleOff = function (toolConfig) {
            $scope.parentToolScope[toolConfig.id].features = [];
            $scope.parentToolScope[toolConfig.id].selectedPosition = null;
            $scope.mapController.unRegisterMapClick($scope.onMapClick);
            if ($scope.mapController.getMarkerCountForLayerName(tempMarkerLayer) > 0) {
                $scope.mapController.removeLayerByName(tempMarkerLayer);
            }

            //Clear interrogateExportFeatures from application scope
            $scope.$emit('interrogateFeatureAdded', null);
        };
    }]);

/*
 * A dynamic presentation of features coming back from an interrogate tool
 *
 * */
app.directive('geoDynamicFeatureListInterrogateExport', [function () {
    "use strict";
    var templateCache =
        '<div class="table-responsive" ng-if="hasData">' +
        '<span ng-show="(currentPage + 1) * pageSize <= featureList.length">Showing {{((currentPage) * pageSize) + 1}}-{{(currentPage + 1) * pageSize}} of {{featureList.length}} results</span>' +
        '<span ng-show="(currentPage + 1) * pageSize > featureList.length">Showing {{((currentPage) * pageSize) + 1}}-{{featureList.length}} of {{featureList.length}} results</span>' +
        '<accordion close-others="oneAtATime">' +
        '<accordion-group heading="{{($index + 1) + \'. Location - \' + feature.WGS84Coords}}" is-open="feature.isFirstOpen" ng-repeat="feature in featureList | startFrom:currentPage * pageSize | limitTo: pageSize">' +

        '<h3 ng-class="{selectedInterrogateFeature:selectedFeatureIndex === $index}">{{feature.properties[primaryPropertyName]}}<a ng-show="featureHasGeometry($index)" href="" title="show feature" ng-click="showFeature($index)"> - Show Feature</a></h3>' +
        '<table class="table table-condensed table-bordered table-responsive" >' +
        '<tbody>' +
        '<tr ng-repeat="col in propertyNameList" ng-show="feature.properties[col]">' +
        '<td class="col-md-2"><strong>{{aliasList[$index]}}</strong></td>' +
        '<td ng-show="!filterUri(feature.properties[col])">{{feature.properties[col]}}</td>' +
        '<td ng-show="filterUri(feature.properties[col])"><a href="{{feature.properties[col]}}" target="_blank">{{feature.properties[col]}}</a></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '<label>Title</label> <input type=text ng-model="feature.title" ng-disabled="feature.addedToCsv"/>' +
        '<br>' +
        '<br>' +
        '<button type="button" ng-click="addToCsv(feature)" ng-disabled="feature.addedToCsv">Add to CSV</button>' +
        '</accordion-group>' +
        '</accordian>' +
        '<div ng-show="numberOfPages.length > 1">' +
        '<div>' +
        '<h4 style="display:block">Page</h4>' +
        '</div>' +
        '<button ng-repeat="pageNum in numberOfPages" title="page {{pageNum + 1}}" ng-click="setCurrentPage($index)" ng-class="{activatePage:currentPage === $index}" ng-bind="pageNum + 1" />' +
        '</div>' +
        '<br>' +
        '<div ng-show="csvList.length > 0" class="toolInstruction">List Entries:' +
        '<table class="table table-condensed table-bordered table-responsive table-export" >' +
        '<tbody>' +
        '<tr>' +
        '<td class="col-md-2"><strong>Title</strong></td>' +
        '<td class="col-md-2"><strong>Coordinates</strong></td>' +
        '<td class="col-md-3"><strong>Remove</strong></td>' +
        '</tr>' +
        '<tr ng-repeat="csv in csvList">' +
        '<td class="col-md-3"><strong>{{csv.title}}</strong></td>' +
        '<td class="col-md-3"><strong>{{csv.WGS84Coords}}</strong></td>' +
        '<td class="col-md-3"><button type="button" ng-click="removeCsvEntry(csv)" class="csvButton"></button></td>' +
        '</tr>' +
        '</tbody>' +
        '</table>' +
        '</div>' +
        '<div ng-show="csvList.length > 0">' +
        '<button type="button" ng-csv="getArray" filename="test.csv">Export to CSV</button>' +
        '</div>' +
        '</div>';
    return {
        restrict: 'EA',
        template: templateCache,
        scope: {
            featureList: '=',
            propertyNameList: '=',
            aliasList: '=',
            primaryPropertyName: '=',
            onPageChange: '&',
            mapController: '='
        },
        controller: ['$scope', function ($scope) {
            $scope.featurePropertyValues = [];
            $scope.oneAtATime = true;
            $scope.showFeature = function (index) {
                $scope.$emit('interrogateFeatureAdded', $scope.featureList[index]);
                $scope.selectedFeatureIndex = index;
            };
            $scope.featureHasGeometry = function (index) {
                return $scope.featureList[index].geometry != null;
            };
        }],
        link: function ($scope) {
            $scope.pageSize = 20;
            var refreshViewModel = function () {
                $scope.currentPage = 0;
                $scope.selectedFeatureIndex = null;
                $scope.$emit('interrogateFeaturesCleared', null);
                var numOfPages = Math.floor($scope.featureList.length / $scope.pageSize);
                if ($scope.featureList.length % $scope.pageSize > 0) {
                    numOfPages++;
                }
                $scope.numberOfPages = $scope.getNumberAsArray(numOfPages);
                $scope.hasData = !!($scope.featureList != null && $scope.propertyNameList != null);
            };
            $scope.setCurrentPage = function (currentPage) {
                $scope.currentPage = currentPage;
                $scope.onPageChange();
            };

            $scope.filterUri = function (val) {
                if (val != null) {
                    return val.indexOf('http') > -1;
                } else {
                    return false;
                }
            };

            $scope.getNumberAsArray = function (num) {
                var array = new Array(num);
                for (var i = 0; i < array.length; i++) {
                    array[i] = i;
                }
                return array;
            };

            $scope.featureListWatch = $scope.$watch('featureList', function () {
                refreshViewModel();
            });

            $scope.propertyNameListWatch = $scope.$watch('propertyNameList', function () {
                refreshViewModel();
            });

            $scope.$on('$destroy', function () {
                if ($scope.featureListWatch != null) {
                    $scope.featureListWatch();
                }
                if ($scope.propertyNameListWatch != null) {
                    $scope.propertyNameListWatch();
                }
            });

            $scope.csvList = [];

            $scope.addToCsv = function (val) {
                val.addedToCsv = true;
                $scope.csvList.push(val);

                var coords = val.WGS84Coords.split(',');
                var display = val.title;
                if (display.length === 0) {
                    display = val.WGS84Coords;
                }

                var args = {layerName: "interrogateExportLayer",
                    text: display,
                    fontSize: "16px",
                    lon: coords[0],
                    lat: coords[1],
                    fontColor: "#000000",
                    align: "cm", // unit for alignment
                    labelYOffset: 20, // offset the text this many pixels from the point
                    projection: 'EPSG:4326',
                    pointRadius: 30000,
                    pointColor: "#000000",
                    pointOpacity: 1
                };

                val.feature = $scope.mapController.drawLabelWithPoint(args);
            };

            $scope.removeCsvEntry = function (val) {
                $scope.mapController.removeFeature("interrogateExportLayer", val.feature[0]);
                $scope.mapController.removeFeature("interrogateExportLayer", val.feature[1]);
                for (var featureIndex = 0; featureIndex <= $scope.featureList.length - 1; featureIndex++) {
                    if ($scope.featureList[featureIndex].id === val.id) {
                        $scope.featureList[featureIndex].addedToCsv = false;
                        $scope.featureList[featureIndex].title = '';
                    }
                }

                for (var csvListIndex = 0; csvListIndex <= $scope.csvList.length - 1; csvListIndex++) {
                    if ($scope.csvList[csvListIndex].id === val.id) {
                        $scope.csvList.splice(csvListIndex, 1);
                    }
                }
            };

            $scope.getArray = function (val) {
                // Required by ng-csv expects an array of a : value, b : value and so on
                var alpha = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,aa,ab,ac,ad,ae,af,ag,ah,ai,aj,ak,al,am," +
                    "an,ao,ap,aq,ar,as,at,au,av,aw,ax,ay,az,ba,bb,bc,bd,be,bf,bg,bh,bi,bj,bk,bl,bm,bn,bo,bp,bq,br,bs,bt,bu," +
                    "bv,bw,bx,by,bz";
                var alphabet = alpha.split(",");
                var alphabetPosition = 0;
                var csv = [];
                var csvEntry = {};

                csvEntry[alphabet[alphabetPosition++]] = 'TITLE';
                csvEntry[alphabet[alphabetPosition++]] = 'COORDINATES';

                // Get the list of properties for the first row
                for (var propertyKey in $scope.csvList[0].properties) {
                    if ($scope.csvList[0].properties.hasOwnProperty(propertyKey) && $scope.propertyNameList.indexOf(propertyKey) > -1) {
                        csvEntry[alphabet[alphabetPosition++]] = propertyKey;
                    }

                }
                csv.push(csvEntry);

                for (var i = 0; i <= $scope.csvList.length - 1; i++) {
                    alphabetPosition = 0;
                    csvEntry = {};
                    csvEntry[alphabet[alphabetPosition++]] = $scope.csvList[i].title;
                    csvEntry[alphabet[alphabetPosition++]] = $scope.csvList[i].WGS84Coords;

                    for (var requiredPropertyKey in $scope.csvList[i].properties) {
                        if ($scope.csvList[i].properties.hasOwnProperty(requiredPropertyKey) && $scope.propertyNameList.indexOf(requiredPropertyKey) > -1) {
                            csvEntry[alphabet[alphabetPosition++]] = $scope.csvList[i].properties[requiredPropertyKey];
                        }
                    }
                    csv.push(csvEntry);
                }

                return csv;
            };
        },
        transclude: true
    };
}]);

app.filter('startFrom', function () {
    "use strict";
    return function (input, start) {
        return input.slice(start);
    };
});