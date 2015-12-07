/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */

describe('applicationMap tests',
    function () {
        'use strict';
        var $compile, $scope, element, $httpBackend, childScope;

        beforeEach(module('testApp'));

        beforeEach(inject(function (_$compile_, _$rootScope_, $injector, $location) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $compile = _$compile_;
            $scope = _$rootScope_;

            element = angular
                .element('<div ng-controller="applicationMapPageController">');

            $scope.geoConfig = {
                "layerMaps": [
                    {
                        "isGroupedLayers": true,
                        "groupTitle": "Geochemical Analyses",
                        "groupId": "geochemical",
                        "visibility": true,
                        "defaultLayerId": "RockGeochemistry"
                    }
                ],

                "groupedLayers": [
                    {
                        "groupId": "geochemical",
                        "layerMaps": [
                            {
                                "slug": "Rock_Geochemistry",
                                "extent": [
                                    [99, 10],
                                    [169, -55]
                                ],
                                "id": "RockGeochemistry",
                                "mapType": "WMS",
                                "visibility": true,
                                "name": "Rock Geochemistry",
                                "url": "http://www.ga.gov.au/gis/services/earth_science/Geoscience_Australia_Geochemical_Analyses/MapServer/WMSServer",
                                "layers": "RockGeochemistry",
                                "opacity": 1,
                                "layerTimeout": 5000,
                                "metadataText": "This map service was created to replace the GA National Geoscience Datasets service: to that end it should be used in conjunction with other GA map services. OZCHEM is Geoscience Australia's national whole-rock geochemical database. This map service contains over 50000 analyses of rocks, regolith and stream sediments from many regions of Australia. Each analysis includes a geographic location and a geological description, which includes the host stratigraphic unit, where known, and the lithology. Most samples have been collected by Geoscience Australia's field parties.",
                                "ogcLinks": [
                                    {
                                        "description": "Data Metadata",
                                        "url": "http://www.ga.gov.au/metadata-gateway/metadata/record/gcat_a05f7892-d0ec-7506-e044-00144fdd4fa6/OZCHEM+National+Whole+Rock+Geochemistry+Dataset"
                                    }
                                ],
                                "queryFeatures": true
                            },
                            {
                                "slug": "Regolith_Geochemistry",
                                "id": "RegolithGeochemistry",
                                "mapType": "WMS",
                                "visibility": true,
                                "name": "Regolith Geochemistry",
                                "url": "http://www.ga.gov.au/gis/services/earth_science/Geoscience_Australia_Geochemical_Analyses/MapServer/WMSServer",
                                "layers": "RegolithGeochemistry",
                                "opacity": 1,
                                "layerTimeout": 5000,
                                "metadataText": "This map service was created to replace the GA National Geoscience Datasets service: to that end it should be used in conjunction with other GA map services. OZCHEM is Geoscience Australia's national whole-rock geochemical database. This map service contains over 50000 analyses of rocks, regolith and stream sediments from many regions of Australia. Each analysis includes a geographic location and a geological description, which includes the host stratigraphic unit, where known, and the lithology. Most samples have been collected by Geoscience Australia's field parties.",
                                "ogcLinks": [
                                    {
                                        "description": "Data Metadata",
                                        "url": "http://www.ga.gov.au/metadata-gateway/metadata/record/gcat_a05f7892-d0ec-7506-e044-00144fdd4fa6/OZCHEM+National+Whole+Rock+Geochemistry+Dataset"
                                    }
                                ],
                                "queryFeatures": true
                            }
                        ]
                    }
                ]
            };

            $compile(element)(_$rootScope_);
            childScope = $scope.$new();
            $scope.$digest();

        }));

        it('Should return a formatted set of coordiantes', function () {
            var coords = {"lon": 141.55555555, "lat": 45.3333333};
            expect($scope.$$childHead.mapControlOptions.formatOutput(coords)).toBe('Long 141.556°, Lat 45.333°');
        });

        it('Should return the first group id', function () {
            expect($scope.$$childHead.permalinkControlOptions.customData()[0].groupId).toBe('geochemical');
        });

        it('Should return the passed ins et of options', function () {
            var options = {"test": "1"};
            expect($scope.$$childHead.loadOverviewMapOptions(options)).toEqual(options);
        });
    });