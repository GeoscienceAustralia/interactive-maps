/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */
describe(
    'themeService tests',
    function () {
        "use strict";
        var $httpBackend, service;

        beforeEach(module('testApp'));

        beforeEach(inject(function (themeService, $injector) {
            $httpBackend = $injector.get('$httpBackend');
            service = themeService;

            $httpBackend
                .when('GET', 'api/config/hazards/app.json')
                .respond(
                {
                    "id": "hazards",
                    "title": "Australian Hazards",
                    "blurb": "Historically, bushfires, floods, earthquakes, landslides and cyclones have caused loss of life and significant damage to property and infrastructure. The Australian continent has severe weather can range from isolated thunderstorms to intense low pressure systems affecting thousands of square kilometres. Large scale deep low pressure systems cause widespread flash flooding and gale to storm force winds extending over 400 to 1,000 square kilometres. Earthquakes in Australia are usually caused by movements along faults as a result of compression in the Earth's crust.",
                    "headerConfig": {
                        "title": "Applying geoscience to Australia's most important challenges"
                    },
                    "maps": [
                        {
                            "id": "earthquakehazards",
                            "title": "Earthquake Hazards",
                            "previewImageUrl": "content/hazards/earthquakehazards/mapPreview.png",
                            "previewDescription": "Earthquake hazard web map service created by Geoscience Australia. The service contains the 2013 Earthquake Hazard map, as a raster and contours."
                        },
                        {
                            "title": "Sentinel Hotspots",
                            "tags": "Other",
                            "previewImageUrl": "content/hazards/sentinel.png",
                            "previewDescription": "Sentinel is a national bushfire monitoring system that provides timely information about hotspots to emergency service managers across Australia. The mapping system allows users to identify fire locations with a potential risk to communities and property.",
                            "applicationUrl": "http://sentinel.ga.gov.au/#/announcement?utm_source=promotion&utm_medium=homepage&utm_content=Sentinel&utm_campaign=Online-Tools"
                        },
                        {
                            "title": "Recent Earthquakes",
                            "tags": "Other",
                            "previewImageUrl": "content/hazards/recentearthquakes.png",
                            "previewDescription": "Earthquakes are one of the natural hazards which Geoscience Australia monitors and assesses in order to inform risk mitigation and emergency management activities.",
                            "applicationUrl": "http://www.ga.gov.au/earthquakes/"
                        }
                    ],
                    "tags": [
                        {
                            "id": "Other",
                            "description": "Relevant hazard mapping applications.",
                            "title": "Related Applications"
                        }
                    ]
                });
        }));

        //it('Should return the config for the requested theme', function () {
        //    var config = service.getThemeConfig("hazards");
        //    $httpBackend.expectGET('api/config/hazards/app.json');
        //    $httpBackend.flush();
        //});
    });