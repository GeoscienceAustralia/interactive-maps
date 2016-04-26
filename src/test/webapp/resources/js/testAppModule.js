var angular = angular || {};
var $ = $ || {};
//This is included after src/min and there for overrides src/main interactiveMaps module for testing
var app = angular.module('testApp',
    [
        'ngRoute', //angular
        'ui.bootstrap', //bootstrap
        'ui.utils', //angular-UI
        'geowebtoolkit.core',
        'geowebtoolkit.config',
        'geowebtoolkit.ui',
        'interactiveMaps.services',
        'interactiveMaps.map-services',
        'interactiveMaps.termsAndConditions',
        'interactiveMaps.menus',
        'interactiveMaps.controllers',
        'interactiveMaps.map',
        'interactiveMaps.toolbar',
        'geowebtoolkit.mapservices.data.openlayersv2',
        'interactiveMaps.validation',
        'interactiveMaps.filters',
        'interactiveMaps.alerts',
        'ui.sortable',
        'ngStorage',
        'interactiveMaps.catalogue',
        'interactiveMaps.layers-controllers',
        'htmlTemplates'
    ]);

app.config([ '$routeProvider', '$locationProvider', '$provide',
    function ($routeProvider, $locationProvider, $provide) {
        'use strict';
        //$locationProvider.html5Mode(true);
        $routeProvider.when('/', {
            templateUrl: 'resources/partial/home.html',
            controller: 'homeController'
        });
        $routeProvider.when('/help', {
            templateUrl: 'resources/partial/help.html'
        });
        $routeProvider.when('/theme/:themeId/map/:mapId', {
            templateUrl: 'resources/partial/applicationMap.html',
            controller: 'applicationMapController'
        });

        //Copy of app.js with $log decorator removed due to problems with angular-mock
//		$provide.decorator('$log', ['$delegate','uiAlertSvc', function ($delegate,uiAlertSvc) {
//			var _info = $delegate.info; //Saving the original behavior
//
//			var _error = $delegate.error; //Saving the original behavior
//			$delegate.info = function(msg){
//				uiAlertSvc.logInfo(msg);
//				_info(msg);
//			};
//
//			$delegate.error = function(msg){
//				uiAlertSvc.logError(msg);
//				_error(msg);
//			};
//
//			return $delegate;
//		}]);


        //$routeProvider.otherwise({redirectTo: '#!/explorer'});
    } ]);

app.value('geoConfig', function () {
    'use strict';
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
        visibility: true,
        isBaseLayer: false,
        wrapDateLine: true,
        sphericalMercator: true,
        opacity: 1.0,
        layerAttribution: '',
        displayInLayerSwitcher: true,
        projection: 'EPSG:102100',
        numZoomLevels: 15,
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
        defaultOptions: defaults
    };
});

