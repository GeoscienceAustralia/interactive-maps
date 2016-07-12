//JSLint Initialisers
var describe = describe || {};
var beforeEach = beforeEach || {};
var module = module || {};
var inject = inject || {};
var it = it || {};
var expect = expect || {};
var runs = runs || {};
var angular = angular || {};
var afterEach = afterEach || {};
/*var spyOn = spyOn || {};
 var waitsFor = waitsFor || {};*/
//JSLint Initialisers
describe(
    'geowebtoolkit geo-map-control tests',
    function () {
        "use strict";
        var $compile, $scope, $timeout, element, listener, log;

        // Load the myApp module, which contains the directive
        beforeEach(module('testApp'));

        // Store references to $rootScope and $compile
        // so they are available to all tests in this describe block
        beforeEach(inject(function (_$compile_, _$rootScope_, _$timeout_, _$log_) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $compile = _$compile_;
            $timeout = _$timeout_;
            $scope = _$rootScope_;
            log = _$log_;
            listener = jasmine.createSpy('listener');
            $scope.$on('mapControllerReady', function (event, args) {
                listener(args);
                $scope.mapController = args;
            });
            element = angular
                .element('<geo-map map-element-id="interactivemap" datum-projection="EPSG:102100" display-projection="EPSG:4326">' +
                    '<geo-map-layer layer-name="Australian Landsat Mosaic"' +
                    'layer-url="http://www.ga.gov.au/gisimg/services/topography/World_Simple/MapServer/WMSServer"' +
                    'wrap-date-line="true"' +
                    'zoom-to-max="true"' +
                    'map-bg-color="#194584"' +
                    'layer-type="WMS"' +
                    'is-base-layer="true"' +
                    '>' +
                    '<geo-map-control map-control-name="OverviewMap"></geo-map-control>' +
                    '<geo-map-control map-control-name="Permalink"></geo-map-control>' +
                    '<geo-map-control map-control-name="ScaleLine"></geo-map-control>' +
                    '<geo-map-control map-control-name="panzoombar"></geo-map-control>' +
                    '<geo-map-control map-control-name="attribution"></geo-map-control>' +
                    '<geo-map-control map-control-name="mouseposition"></geo-map-control>' +
                    '<geo-map-control map-control-name="measureline" map-control-id="myMeasureTest"></geo-map-control>' +
                    '<geo-map-control map-control-name="measurepolygon" ></geo-map-control>' +
                    '<div id="interactivemap"></div></geo-map>');
            $compile(element)($scope);
            $scope.$digest();
            $timeout.flush();
        }));
        //Tests
        it('Should have called event "mapControllerReady" with mapController', function () {
            expect($scope.mapController !== null);
            expect(listener).toHaveBeenCalledWith($scope.mapController);
        });

        it('Should added 5 additional controls', function () {
            var controls = $scope.mapController.getMapInstance().controls;
            expect(controls.length > 8).toBe(true);
        });

        it('Should report "myMeasureTest" control as being not active', function () {
            //Not being used
            expect($scope.mapController.isControlActive('myMeasureTest')).toBe(false);
        });
        it('Should report "myMeasureTest" control as being active', function () {
            //Set as active via straight openlayers, toolkit abstraction should reflect change.
            $scope.mapController.getMapInstance().getControlsBy('id', 'myMeasureTest')[0].active = true;
            expect($scope.mapController.isControlActive('myMeasureTest')).toBe(true);
        });
    });