/* global angular, $, OpenLayers*/

(function () {
    "use strict";
    var app = angular.module('interactive-maps-embedded',
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
            'colorpicker.module',
            'angulartics',
            'angulartics.google.analytics',
            'ngCsv',
            'ngSanitize',
            'interactiveMaps.queryServices',
            'interactiveMaps.catalogue'
        ]);
    app.config([ '$routeProvider', '$locationProvider', '$provide', '$analyticsProvider',
        function ($routeProvider, $locationProvider, $provide, $analyticsProvider) {
            $analyticsProvider.withAutoBase(true);
            /* Records full path */
            $locationProvider.html5Mode(false);

            $routeProvider.when('/', {
                templateUrl: 'resources/js/embedded/embedded.html',
                controller: 'embeddedMapController'
            });

            $routeProvider.when('/theme/:themeId/map/:mapId', {
                templateUrl: 'resources/js/embedded/embedded.html',
                controller: 'embeddedMapController'
            });

            $routeProvider.when('/config/:url*', {
                templateUrl: 'resources/js/embedded/embedded.html',
                controller: 'embeddedMapController'
            });

            $routeProvider.when('/view/:viewMode/config/:url*', {
                templateUrl: 'resources/js/embedded/embedded.html',
                controller: 'embeddedMapController'
            });

            $routeProvider.when('/version/:framework/config/:url*', {
                templateUrl: 'resources/js/embedded/embedded.html',
                controller: 'embeddedMapController'
            });

            $routeProvider.when('/local/:localStorageKey', {
                templateUrl: 'resources/js/embedded/embedded.html',
                controller: 'embeddedMapController'
            });

        } ]);


    /* Geo-map-toolkit defaults for implementation
     * These values are used as defaults for creation of layers and maps
     * */
    app.value('geoConfig', function () {
        //TODO These values are all OLV2 specific and these values should come from consuming application
        //to merge with defaults written for a specific implementation (like OLV2) in map services.
        //OpenLayers.ProxyHost = '/ogc-client/rest/json?endpoint=';
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
//        resolutions: [156543.03390625, 78271.516953125, 39135.7584765625,
//            19567.87923828125, 9783.939619140625, 4891.9698095703125,
//            2445.9849047851562, 1222.9924523925781, 611.4962261962891,
//            305.74811309814453, 152.87405654907226, 76.43702827453613],
//        zoomOffset: 11,
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