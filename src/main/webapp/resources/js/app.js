/* global angular, $, OpenLayers*/

(function () {
    "use strict";
    var app = angular.module('interactiveMaps',
        [
            'ngRoute',
            'ui.bootstrap',
            'ui.utils',
            'geowebtoolkit.core',
            'geowebtoolkit.config',
            'geowebtoolkit.ui',
            'interactiveMaps.services',
            'interactiveMaps.termsAndConditions',
            'interactiveMaps.menus',
            'interactiveMaps.controllers',
            'interactiveMaps.map',
            'interactiveMaps.layers',
            'interactiveMaps.toolbar',
            'geowebtoolkit.mapservices.data.openlayersv2',
            'interactiveMaps.validation',
            'interactiveMaps.filters',
            'interactiveMaps.alerts',
            'interactiveMaps.embedded',
            'ui.sortable',
            'ngStorage',
            'interactiveMaps.configCreator',
            'colorpicker.module',
            'angulartics',
            'angulartics.google.analytics',
            'ngCsv',
            'ngSanitize',
            'interactiveMaps.queryServices',
            'interactiveMaps.catalogue',
            'interactiveMaps.health',
            'ngFuzzySearch'
        ]);
    app.config([ '$routeProvider', '$locationProvider', '$provide', '$analyticsProvider',
        function ($routeProvider, $locationProvider, $provide, $analyticsProvider) {
            $analyticsProvider.withAutoBase(true);
            /* Records full path */
            $locationProvider.html5Mode(false);

            $routeProvider.when('/', {
                templateUrl: 'resources/js/catalogue/site-catalogue.html',
                controller: 'siteCatalogueController'
            });

            $routeProvider.when('/theme/:themeId', {
                templateUrl: 'resources/js/catalogue/theme-catalogue.html',
                controller: 'themeCatalogueController'
            });

            $routeProvider.when('/health', {
                templateUrl: 'resources/partial/health.html',
                controller: 'healthController'
            });

            $routeProvider.when('/help', {
                templateUrl: 'resources/partial/help.html'
            });

            $routeProvider.when('/theme/:themeId/map/:mapId', {
                templateUrl: 'resources/partial/applicationMap.html',
                controller: 'applicationMapController'
            });

            $routeProvider.when('/r/:reload/theme/:themeId/map/:mapId', {
                templateUrl: 'resources/partial/applicationMap.html',
                controller: 'applicationMapController'
            });

            $routeProvider.when('/configCreator', {
                templateUrl: 'resources/partial/configCreator.html',
                controller: 'configCreatorController',
                reloadOnSearch: false
            });

            $routeProvider.when('/configCreator/theme/:themeId/map/:mapId', {
                templateUrl: 'resources/partial/configCreator.html',
                controller: 'configCreatorController',
                reloadOnSearch: false
            });

            $routeProvider.when('/embedded', {
                templateUrl: 'resources/js/embedded/embedded.html',
                controller: 'embeddedMapController'
            });

            $provide.decorator('$log', ['$delegate', 'uiAlertSvc', function ($delegate, uiAlertSvc) {
                var _info = $delegate.info; //Saving the original behavior

                var _error = $delegate.error; //Saving the original behavior
                $delegate.info = function (msg) {
                    uiAlertSvc.logInfo(msg);
                    _info(msg);
                };

                $delegate.error = function (msg) {
                    uiAlertSvc.logError(msg);
                    _error(msg);
                };

                return $delegate;
            }]);
        } ]);


    /* Jquery UI config defaults*/
    app.value('uiJqConfig', {
        // set the default options for dialogs
        //maxHeight is to cater for footer and header
        //This is also updated through a 'dialog-window-resize' event
        dialog: {
            autoOpen: false,
            appendTo: "#jqueryDialogContainer",
            draggable: false,
            resizable: false,
            maxHeight: $(document).height() -
                $('#headerContainer').height() -
                $('#footerContainer').height() -
                130
        }
    });

    /* Geo-map-toolkit defaults for implementation
     * These values are used as defaults for creation of layers and maps
     * */
    app.value('geoConfig', function () {
        //TODO These values are all OLV2 specific and these values should come from consuming application
        //to merge with defaults written for a specific implementation (like OLV2) in map services.
        var defaults = {
            standardTileSize: 256,
            largeTileSize: 1024,
            veryLargeTileSize: 2048,
            minMapWidth: 900,
            minMapHeight: 600,
            panIncrement: 30,
            smallPanIncrement: 5,
            transitionEffect: 'resize',
            zoomMethod: null,
            visibility: true,
            isBaseLayer: false,
            wrapDateLine: true,
            sphericalMercator: true,
            opacity: 1.0,
            layerAttribution: '',
            displayInLayerSwitcher: true,
            proxyHost: '/ogc-client/rest/json?endpoint=',
            projection: 'EPSG:102100',
            transparent: true,
            format: 'image/png',
            tileSize: function (tileType) {
                var result;
                if (tileType) {
                    if (tileType === 'large') {
                        result = new OpenLayers.Size(defaults.largeTileSize, defaults.largeTileSize);
                    } else if (tileType === 'vlarge') {
                        result = new OpenLayers.Size(defaults.veryLargeTileSize, defaults.veryLargeTileSize);
                    }
                } else {
                    result = new OpenLayers.Size(defaults.standardTileSize, defaults.standardTileSize);
                }
                return result;
            },
            layerType: 'WMS'
        };
        return {
            defaultOptions: defaults,
            olv3Options: {
                renderer: 'canvas'
            },
            cesiumOptions: {
                includeCustomTerrainProvider: true,
                customTerrainProviderUrl: 'http://www.ga.gov.au/terrain/terrain/'
            }
        };
    });
})();