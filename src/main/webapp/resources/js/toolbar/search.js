var angular = angular || {};
var console = console || {};
var $ = $ || {};

var app = angular.module('interactiveMaps.tools.search', [ 'interactiveMaps.services' ]);

app.controller('searchController', [ '$scope', 'externalToolService', function ($scope, externalToolService) {
    'use strict';
    function filterQuery(searchQuery) {
        return searchQuery.replace('\'', '').replace('"', '').replace('%', '').replace('*', '');
    }

    $scope.$watch('query', function (newVal) {
        if (newVal && newVal.length > 3) {
            var searchTerm = filterQuery(newVal);
            $scope.$emit('searchFired', searchTerm);
        } else {
            $scope.$emit('clearSearchFeatures', null);
        }
    });

    $scope.$on('searchUpdated', function (event, args) {
        /**
         * Search config takes the following structure
         * configBody {
		* */
        if (args == null) {
            $scope.searchReady = false;
        } else {
            $scope.searchReady = true;
            $scope.searchConfig = args;
            $scope.typeAheadTemplateUrl = args.typeAheadTemplateUrl;
            $scope.wfsProperty = args.primaryWfsProperty;
        }
    });

    $scope.$on('mapControllerReady', function (event, args) {
        $scope.mapController = args;
    });

    $scope.onSearchResults = function (data) {
        var scope = $scope.controllers.toolbarController.getToolBarScope();

        scope[tool.getNamespace()] = scope[tool.getNamespace()] || {};
        scope[tool.getNamespace()].searchResults = data;
        scope[tool.getNamespace()].wfsProperty = $scope.wfsProperty;

        $scope.controllers.toolbarController.activateToggle(tool);

        if (data.length === 1) {
            $scope.mapController.setCenter(data[0].geometry.coordinates[1], data[0].geometry.coordinates[0], data[0].crs.properties.name);
            $scope.mapController.zoomTo(17);
        } else {
            var extentPoints = [];
            var projection;
            for (var i = 0; i < data.length; i++) {
                var extent = {};
                extent = data[i].geometry.coordinates;
                projection = data[i].crs.properties.name;

                extentPoints.push(extent);
            }

            if (data != null && data.length > 0) {
                var bounds = $scope.mapController.createBounds(extentPoints, projection);
                $scope.mapController.zoomToExtent(bounds);
            }
        }

        $scope.$emit('onSearchResultsExecuted', data);
    };

    $scope.onSearchResultsSelected = function (data) {
        $scope.controllers.toolbarController.deactivateToggle(tool);
        $scope.$emit('onSearchResultSelected', data);
        $scope.mapController.setCenter(data.geometry.coordinates[1], data.geometry.coordinates[0], data.crs.properties.name);
        $scope.mapController.zoomTo(8);
    };

    var tool = {
        id: 'searchResults',
        toggleActivate: function () {

        },
        toggleDeactivate: function () {
            $scope.$emit('clearSearchFeatures', null);
        },
        postDeactivate: function () {

        },
        postActivate: function () {

        },
        preDeactivate: function () {

        },
        preActivate: function () {

        },
        isActive: function () {
            return $scope.measureToggleActive;
        },
        getNamespace: function () {
            return 'searchResults';
        },
        toolRegistered: function (toolbarScope, toolbarController) {
            //Sharing scope is bad, but the requirement around 'dynamic' tooling requires it
            //to share data between tool and tool view (right hand panel)
            $scope.toolParentScope = toolbarScope;
            $scope.toolParentController = toolbarController;
        }
    };

    externalToolService.registerTool(tool);

} ]);


//Filter can only be used within a search panel due to it's reliance on $('#searchResultsPanelRight')
app.filter('camelCaseFilterOnProperty', function () {
    "use strict";
    return function (resultList, propertyName) {

        if (propertyName.indexOf('$parent') !== -1) {
            var searchScope = $('#searchResultsPanelRight').scope();
            propertyName = searchScope.$eval(propertyName);
        }
        if (resultList != null && propertyName != null) {
            var orderedList = [];
            //using this function instead of angular orderBy due to the requirement around dynamic property names
            var sortByProvidedProperty = function compare(a, b) {
                if (a.properties[propertyName] < b.properties[propertyName])
                    return -1;
                if (a.properties[propertyName] > b.properties[propertyName])
                    return 1;
                return 0;
            };

            for (var i = 0; i < resultList.length; i++) {
                var words = resultList[i].properties[propertyName].split(/\s+/);
                var result = '';

                for (var j = 0; j < words.length; j++) {
                    if (j > 0 && j < words.length) {
                        result = result + " ";
                    }
                    result = result + words[j].toLowerCase().toUpperCaseFirstChar();
                }
                //Assigning a template display property as can't do a double resolve in template
                resultList[i].properties._templateDisplay_ = result;
                orderedList.push(resultList[i]);
            }
            return orderedList.sort(sortByProvidedProperty);
        }
    };
});

app.filter('camelCaseFilterOnName', function () {
    "use strict";
    return function (resultList) {
        if (resultList != null) {
            var orderedList = [];

            for (var i = 0; i < resultList.length; i++) {
                var words = resultList[i].properties.NAME.split(/\s+/);
                var result = '';

                for (var j = 0; j < words.length; j++) {
                    if (j > 0 && j < words.length) {
                        result = result + " ";
                    }
                    result = result + words[j].toLowerCase().toUpperCaseFirstChar();
                }
                resultList[i].properties.NAME = result;
                orderedList.push(resultList[i]);
            }
            return orderedList;
        }
    };
});