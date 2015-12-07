/* global angular, $*/
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.tools.interrogate', ['interactiveMaps.services']);

    app.controller('interrogatePanelController', ['$scope', function ($scope) {
        $scope.featureListChangePage = function () {
            $('.rightMenuContentInnerContainer')[0].scrollTop = 0;
        };
    }]);

    app.controller('interrogateToggleController', ['$scope', 'WMSDataService', '$timeout', '$q', 'QueryService', '$log',
        function ($scope, WMSDataService, $timeout, $q, QueryService, $log) {
            var tempMarkerLayer = "interrogateMarkerLayer";
            var layerPromiseArray = [];
            var endpointPromiseArray = [];
            $scope.resolveParentToolbar = function (toolbarScope) {
                $scope.parentToolScope = toolbarScope;
            };

            function ResolveAllQueryResults(datas, toolConfig) {
                $timeout(function () {
                    $scope.parentToolScope[toolConfig.id].features = QueryService.processInterrogationFeatures(
                        $scope.mapController,
                        $scope.geoConfig,
                        toolConfig.config,
                        datas,
                        layerPromiseArray,
                        endpointPromiseArray);
                    $scope.parentToolScope[toolConfig.id].showSpinner = false;
                });
            }

            var featuresList = [];

            $scope.interrogateToggleOn = function (toolConfig) {
                $scope.parentToolScope[toolConfig.id].features = [];
                $scope.parentToolScope[toolConfig.id] = $scope.parentToolScope[toolConfig.id] || {};

                $scope.onMapClick = function (e) {
                    var point = $scope.mapController.getPointFromEvent(e);
                    $scope.parentToolScope[toolConfig.id].selectedPosition = $scope.mapController.getLonLatFromPixel(point.x, point.y);
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
                    $scope.mapController.setMapMarker(point, tempMarkerLayer, $scope.$parent.$parent.tool.config.markerUrl, args);
                    $scope.parentToolScope[toolConfig.id].showSpinner = true;
                    $scope.$apply();

                    //If the tool as endpoints registered, request data from them only
                    if (toolConfig.config.endpoints != null && toolConfig.config.endpoints.length > 0) {
                        var endpointWithIndex;
                        var epPromises = QueryService.createEndpointQueries(
                            $scope.mapController,
                            $scope.geoConfig,
                            toolConfig.config,
                            e,
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
                        var layerPromises = QueryService.createLayerQueries(
                            $scope.mapController,
                            $scope.geoConfig,
                            toolConfig.config,
                            e,
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
                        },
                        function (error) {
                            $log.debug(error);
                            $log.error('An error occurred when trying to interrogate - ' + error);
                            $scope.parentToolScope[toolConfig.id].showSpinner = false;
                        });
                };
                $scope.mapController.registerMapClick($scope.onMapClick);
            };

            $scope.interrogateToggleOff = function (toolConfig) {
                $scope.parentToolScope[toolConfig.id].features = [];
                $scope.parentToolScope[toolConfig.id].selectedPosition = null;
                $scope.mapController.unRegisterMapClick($scope.onMapClick);
                if ($scope.mapController.getMarkerCountForLayerName(tempMarkerLayer) > 0) {
                    $scope.mapController.removeLayerByName(tempMarkerLayer);
                }
                //Clear interrogateFeatures from application scope
                $scope.$emit('interrogateFeaturesCleared', null);
            };
        }]);

    /*
     * A dynamic presentation of features coming back from an interrogate tool
     *
     * */
    app.directive('geoDynamicFeatureList', [function () {
        var templateCache =
            '<div class="table-responsive tableLayout" ng-if="hasData">' +
            '<span ng-show="(currentPage + 1) * pageSize <= featureList.length">Showing {{((currentPage) * pageSize) + 1}}-{{(currentPage + 1) * pageSize}} of {{featureList.length}} results</span>' +
            '<span ng-show="(currentPage + 1) * pageSize > featureList.length">Showing {{((currentPage) * pageSize) + 1}}-{{featureList.length}} of {{featureList.length}} results</span>' +
            '<div class="interrogate" ng-repeat="feature in featureList | startFrom:currentPage * pageSize | limitTo: pageSize">' +
            '<table class="table table-condensed table-responsive table-striped" >' +
            '<thead>' +
            '<tr>' +
            '<td ng-show="feature.title"  colspan="2" ng-class="{selectedInterrogateFeature:selectedFeatureIndex === $index}">{{feature.title}}<a ng-show="featureHasGeometry($index)" href="" title="Show feature" ng-click="showFeature($index)"><img src="resources/img/pin-3-24.png"></a></td>' +
            '</tr>' +
            '<tr>' +
            '<td ng-show="feature.subtitle" colspan="2" ng-class="{selectedInterrogateFeature:selectedFeatureIndex === $index}">{{feature.subtitle}}<a ng-show="featureHasGeometry($index)" href="" title="Show feature" ng-click="showFeature($index)"><img src="resources/img/pin-3-24.png"></a></td>' +
            '</tr>' +
            '</thead>' +
            '<tbody>' +
            '<tr ng-repeat="col in propertyNameList" ng-if="feature.properties[col]" >' +
            '<td class="col-md-2"><strong>{{aliasList[$index]}}</strong></td>' +
            '<td ng-show="!filterUri(feature.properties[col])">{{feature.properties[col]}}</td>' +
            '<td ng-show="filterUri(feature.properties[col])"><a href="{{feature.properties[col]}}" target="_blank">{{feature.properties[col]}}</a></td>' +
            '</tr>' +
            '</tbody>' +
            '</table>' +
            '</div>' +
            '<div ng-show="numberOfPages.length > 1">' +
            '<div>' +
            '<h4 style="display:block">Page</h4>' +
            '</div>' +
            '<button ng-repeat="pageNum in numberOfPages" title="page {{pageNum + 1}}" ng-click="setCurrentPage($index)" ng-class="{activatePage:currentPage === $index}" ng-bind="pageNum + 1" />' +
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
                titlePropertyName: '=',
                onPageChange: '&',
                mapController: '='
            },
            controller: ['$scope', function ($scope) {
                $scope.featurePropertyValues = [];
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
                    if (val != null && val.indexOf != null) {
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
            },
            transclude: true
        };
    }]);

    app.filter('startFrom', function () {
        return function (input, start) {
            return input.slice(start);
        };
    });
})();