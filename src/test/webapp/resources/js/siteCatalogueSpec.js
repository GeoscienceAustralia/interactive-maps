/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */
describe(
    'siteCatalogueController tests',
    function () {
        "use strict";
        var $compile, $scope, element, $httpBackend;

        beforeEach(module('testApp'));

        beforeEach(inject(function (_$compile_, _$rootScope_, $injector) {
            $compile = _$compile_;
            $scope = _$rootScope_;

            element = angular
                .element('<div ng-controller="siteCatalogueController">');

            $httpBackend = $injector.get('$httpBackend');

            $httpBackend
                .when('GET', 'api/config/site-config.json')
                .respond(
                {
                    "title": "Interactive Maps",
                    "blurb": "Interactive Maps is a discovery and exploration view of Geoscience Australia's geospatial services. The following scientific and decision support themes have curated content comprised of maps and functions. Each map has queries and functions with linked access to OGC (Open Geospatial Consortium) web services and metadata. This system replaces MapConnect and AMSIS applications.",
                    "headerConfig": {
                        "title": "Applying geoscience to Australia's most important challenges"
                    },
                    "themes": [
                        {
                            "id": "amsis",
                            "title": "Australian Marine Spatial Information System",
                            "previewImageUrl": "content/amsis/themePreview.png",
                            "previewDescription": "Australian Marine Spatial Information System (AMSIS) is a web based interactive mapping and decision support system that provides access to integrated government and non-government information in the Australian Marine Jurisdiction."
                        },
                        {
                            "id": "geographic-information",
                            "title": "Geographic Information",
                            "previewImageUrl": "content/geographic-information/themePreview.png",
                            "previewDescription": "Geoscience Australia provides authoritative geographic information services and products to enable evidence-based decision making, deliver government policy, assist industry development needs and support community wellbeing."
                        }
                    ]
                });

            $compile(element)(_$rootScope_);

            $scope.$digest();
        }));

        it('Should init the site config list successfully', function () {
            var siteConfig = {
                "title": "Interactive Maps",
                "blurb": "Interactive Maps is a discovery and exploration view of Geoscience Australia's geospatial services. The following scientific and decision support themes have curated content comprised of maps and functions. Each map has queries and functions with linked access to OGC (Open Geospatial Consortium) web services and metadata. This system replaces MapConnect and AMSIS applications.",
                "headerConfig": {
                    "title": "Applying geoscience to Australia's most important challenges"
                },
                "themes": [
                    {
                        "id": "amsis",
                        "title": "Australian Marine Spatial Information System",
                        "previewImageUrl": "content/amsis/themePreview.png",
                        "previewDescription": "Australian Marine Spatial Information System (AMSIS) is a web based interactive mapping and decision support system that provides access to integrated government and non-government information in the Australian Marine Jurisdiction."
                    },
                    {
                        "id": "geographic-information",
                        "title": "Geographic Information",
                        "previewImageUrl": "content/geographic-information/themePreview.png",
                        "previewDescription": "Geoscience Australia provides authoritative geographic information services and products to enable evidence-based decision making, deliver government policy, assist industry development needs and support community wellbeing."
                    }
                ]
            };

            spyOn($scope, '$emit');

            $scope.$$childHead.initialiseSiteConfig(siteConfig);

            expect($scope.$$childTail.themes.length === 2).toBe(true);
            expect($scope.$$childTail.themes[0].id).toBe("amsis");
            expect(angular.equals($scope.$$childTail.siteConfig, siteConfig)).toBe(true);
            expect($scope.$emit).toHaveBeenCalledWith('configDataLoaded', siteConfig);
        });
    });