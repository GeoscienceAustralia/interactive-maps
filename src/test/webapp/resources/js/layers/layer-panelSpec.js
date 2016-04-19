/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */
describe(
    'layer panel tests',
    function () {
        "use strict";
        var $httpBackend, $compile, $scope, $timeout, element,template,mapElement;

        beforeEach(module('testApp'));

        beforeEach(inject(function ($injector,$templateCache, _$compile_, _$rootScope_, _$timeout_,MasterLayersService,olv2MapControls,ConfigService) {
            $httpBackend = $injector.get('$httpBackend');
            $compile = _$compile_;
            $scope = _$rootScope_;
            $timeout = _$timeout_;
            $scope.configReady = true;
            $scope.geoConfig = readJSON('src/main/webapp/config/minerals/maps/geophysics.json');
 //           var applicationMapPartial = $templateCache.get('resources/partial/applicationMap.html');
            var configMapPartial = $templateCache.get('resources/partial/configmap.html');
            $scope.controllers = {};
            element = angular.element('<geo-layer-panel ng-show="leftHandContentDisplay == \'Layers\'" class="leftHandMenuItemContainer"' +
                'map-controller="mapController" geo-config="geoConfig" map-element-id="interactivemap">' +
                '</geo-layer-panel>');
            mapElement = angular.element(configMapPartial);
            $httpBackend.when('GET','content/minerals/geology/about.html')
                .respond('');
            $httpBackend.when('GET','content/minerals/geology/legend.html')
                .respond('');
            $httpBackend.when('GET','resources/partial/configmap.html')
                .respond(configMapPartial);
            $scope.$on('mapControllerReady', function (event, mapController) {
                $scope.mapController = mapController;
            });
            olv2MapControls.registerControl('interactivemapspermalink', OpenLayers.Control.InteractiveMapsPermalink);
            var masterLayerList = readJSON('src/main/webapp/config/master-layer-list.json');
            var masterToolList = readJSON('src/main/webapp/config/master-tool-list.json');
            $httpBackend.when('GET','api/config/master-layer-list.json')
                .respond(masterLayerList);
            $httpBackend.when('GET','api/config/master-tool-list.json')
                .respond(masterToolList);
            MasterLayersService.initMasterLists().then(function () {
                console.log('foo');
            });
            $httpBackend.flush();
            ConfigService.initialiseConfig($scope.geoConfig);
        }));

        it('Should init layer panel directive successfully', function () {
            $compile(mapElement)($scope);
            $scope.$digest();
            expect($scope.geoConfig.layerMaps[5].queryUrl == null).toBe(true);
            $compile(element)($scope);
            $scope.$digest();
            expect($scope.geoConfig.layerMaps[5].queryUrl != null).toBe(true);
            //$httpBackend.flush();
        });

        it('Should change group layer correctly', function () {
            $compile(mapElement)($scope);
            $scope.$digest();
            expect($scope.geoConfig.layerMaps[5].queryUrl == null).toBe(true);
            $compile(element)($scope);
            $scope.$digest();
            var scope = element.isolateScope();
            expect($scope.geoConfig.layerMaps[5].slug).toBe('Total_Magnetic_Intensity_2015_HSI');
            scope.selectedGroupLayerChanged('TotalMagneticIntensity2015_greyscale','totalmagneticintensity')
            expect($scope.geoConfig.layerMaps[5].slug).toBe('Total_Magnetic_Intensity_2015_Greyscale');
            //$httpBackend.flush();
        });
    });