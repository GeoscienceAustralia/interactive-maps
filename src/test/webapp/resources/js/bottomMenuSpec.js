/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */

describe('addLayer tests',
    function () {
        var $compile, $timeout, scope, element, mapControllerListener;

        beforeEach(module('testApp'));

        beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_) {
            $compile = _$compile_;
            $timeout = _$timeout_;
            $scope = _$rootScope_;


            mapControllerListener = jasmine.createSpy('mapControllerListener');
            $scope.$on('mapControllerReady', function (event, args) {
                mapControllerListener(args);
                $scope.mapController = args;
            });

            var layer = '<div id="map"></div>' +
                '<geo-map map-element-id="map" framework="olv2" zoom-level="4" center-position="[130, -25]"' +
                ' datum-projection="EPSG:102100" display-projection="EPSG:4326"> ' +
                '<geo-map-layer layer-name="Australian Landsat Mosaic"' +
                'layer-url="http://www.ga.gov.au/gisimg/services/topography/World_Bathymetry_Image_WM/MapServer/WMSServer"' +
                'wrap-date-line="true"' +
                'layer-type="WMS"' +
                'is-base-layer="true"' +
                '></geo-map-layer>' +
                '</geo-map> ' +
                '<div ng-controller="bottomMenuController">';

            element = angular
                .element(layer);

            $compile(element)(_$rootScope_);
            $scope.$digest();
            $timeout.flush();
        }));

        it('Should initialise an immutable list of layers', function () {
            $scope.$$childTail.updateMenu();
            expect($scope.$$childTail.alternateView).toBe('resources/img/3dglobe.png');
            expect($scope.$$childTail.mapController.is3d()).toBe(false);
        });

        it('Should initialise an immutable list of layers', function () {
            var is3d = false;
            $scope.$$childTail.mapController.is3d = function () {
                return is3d;
            }

            expect($scope.$$childTail.alternateView).toBe('resources/img/3dglobe.png');

            is3d = true;

            $scope.$$childTail.updateMenu();
            $timeout.flush();
            expect($scope.$$childTail.alternateView).toBe('resources/img/2dglobe.png');
        });
    });