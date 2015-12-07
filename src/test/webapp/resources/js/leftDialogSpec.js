/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine, spyOn */

describe('leftDialog tests',
    function () {
        'use strict';
        var $compile, $scope, element, $httpBackend;

        beforeEach(module('testApp'));

        beforeEach(inject(function (_$compile_, _$rootScope_, $injector, $location) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $compile = _$compile_;
            $scope = _$rootScope_;

            element = angular
                .element('<div ng-controller="leftDialogsController">');

            $compile(element)(_$rootScope_);

            $httpBackend = $injector.get('$httpBackend');

            $httpBackend
                .when('GET', 'api/config/amsis/app.json')
                .respond(
                {
                    "title": "AMSIS",
                    "id": "amsis",
                    "blurb": "Australian Marine Spatial Information System (AMSIS) is a web based interactive mapping and decision support system that improves access to integrated government and non-government information in the Australian Marine Jurisdiction. The data has been sourced from Geoscience Australia, other Australian government agencies and some industry sources. AMSIS also contains the offshore mineral locations data that was used to create the Offshore Minerals Map. Information in this application should not be relied upon as the sole source of information for commercial and operational decisions. AMSIS should not be used for navigational purposes.",
                    "headerConfig": {
                        "title": "Applying geoscience to Australia's most important challenges",
                        "backgroundImageUrl": "resources/img/header_bg.png"
                    },
                    "maps": [
                        {
                            "title": "Seas and Submerged Lands Act 1973",
                            "tags": "MaritimeBoundaries",
                            "id": "sasla1973",
                            "previewImageUrl": "content/amsis/sasla1973/mapPreview.png",
                            "previewDescription": "An Act relating to Sovereignty in respect of certain Waters of the Sea and in respect of the Airspace over, and the Sea bed and Subsoil beneath, those Waters and to Sovereign Rights in respect of the Continental Shelf and the Exclusive Economic Zone and to certain rights of control in respect of the Contiguous Zone."
                        },
                        {
                            "title": "Offshore Petroleum and Greenhouse Gas Storage Act 2006",
                            "tags": "Petroleum",
                            "id": "opggsa2006",
                            "previewImageUrl": "content/amsis/opggsa2006/mapPreview.png",
                            "previewDescription": "An Act about petroleum exploration and recovery, and the injection and storage of greenhouse gas substances, in offshore areas, and for other purposes."
                        }
                    ]});

            spyOn($location, 'path').and.returnValue('Fake Location');
            $scope.path = $location.path();

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

            $scope.$digest();
        }));

        it('Should reset the map list', function () {
            $scope.$$childTail.resetMapList();
            expect($scope.$$childTail.displayType === "theme").toBe(true);
        });

        it('Should find all related maps for a given id', function () {
            $scope.$$childTail.displayType = "theme";

            $scope.$$childTail.displayRelatedMaps('amsis');
            expect($scope.$$childTail.displayType === "map");
            expect($scope.$$childTail.selectedThemeId === "amsis");

            $httpBackend.expectGET('api/config/amsis/app.json');
            $httpBackend.flush();
        });

        it('Should redirect to the selected map', function () {
            $scope.$$childTail.displayType = "map";
            $scope.$$childTail.displayRelatedMaps('amsis');

            expect($scope.path).toBe('Fake Location');
        });

        it('Should get a list of all the themes from the site config', function () {
            $scope.$$childTail.mapsToggleClicked();

            $httpBackend.expectGET('api/config/site-config.json');
            $httpBackend.flush();

            expect($scope.$$childTail.mapsToDisplay[0].id).toBe('amsis');
            expect($scope.$$childTail.mapsToDisplay[1].id).toBe('geographic-information');
        });
    });