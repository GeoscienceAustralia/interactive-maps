/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */
describe(
    'map-services tests',
    function () {
        "use strict";
        var $httpBackend, masterLayerService;

        beforeEach(module('testApp'));

        beforeEach(inject(function (MasterLayersService, $injector) {
            $httpBackend = $injector.get('$httpBackend');
            masterLayerService = MasterLayersService;

            $httpBackend
                .when('GET', 'api/config/master-layer-list.json')
                .respond(
                {
                    "layers": [
                        {
                            "slug": "Airborne_Surveys_2014",
                            "mapType": "WMS",
                            "visibility": true,
                            "name": "Airborne Surveys 2014",
                            "url": "http://www.ga.gov.au/gisimg/services/earth_science/Geoscience_Australia_National_Geophysical_Grids/MapServer/WMSServer",
                            "layers": "AirborneSurveys2014",
                            "opacity": 1,
                            "layerTimeout": 5000,
                            "metadataText": "This layer provides the outlines and specifications of 1085 airborne geophysical surveys conducted by or for the Australian, State and Territory governments. Most of the data for surveys referred to in this Index are available free on- line via the Geophysical Archive Data Delivery System (GADDS - http://www.geoscience.gov.au/gadds). They comprise more than 34 million line kilometres of mainly total magnetic intensity and gamma-ray spectrometric data. Land elevation data derived from GPS recordings made during airborne magnetic and gamma-ray spectrometric surveys, and electromagnetic data are also available for some areas. The associated index (Percival, P.J., 2014. Index of airborne geophysical surveys (Fourteenth Edition). Geoscience Australia Record 2014/014) contains the specifications of surveys.",
                            "ogcLinks": [
                                {
                                    "description": "Data Metadata",
                                    "url": "http://www.ga.gov.au/metadata-gateway/metadata/record/gcat_f3ad4f15-96bd-0cf3-e044-00144fdd4fa6/Digital+files+for+the+Index+of+airborne+geophysical+surveys%2C+Fourteenth+edition%2C+2014"
                                },
                                {
                                    "description": "Service Metadata",
                                    "url": "http://www.ga.gov.au/geoportal/catalog/search/resource/details.page?uuid=%7B9CB92EA7-2927-4B52-B0EC-6258669448EC%7D"
                                },
                                {
                                    "description": "REST",
                                    "url": "http://www.ga.gov.au/gisimg/rest/services/earth_science/Geoscience_Australia_National_Geophysical_Grids/MapServer"
                                },
                                {
                                    "description": "WMS Capabilities",
                                    "url": "http://www.ga.gov.au/gisimg/services/earth_science/Geoscience_Australia_National_Geophysical_Grids/MapServer/WMSServer?request=GetCapabilities&service=WMS"
                                },
                                {
                                    "description": "ArcMap Layerfile",
                                    "url": "http://www.ga.gov.au/gisimg/rest/services/earth_science/Geoscience_Australia_National_Geophysical_Grids/MapServer?f=lyr&v=9.3"
                                }
                            ],
                            "queryFeatures": false
                        },
                        {
                            "slug": "All_Geochonology",
                            "id": "All",
                            "mapType": "WMS",
                            "visibility": true,
                            "name": "All Geochonology",
                            "url": "http://www.ga.gov.au/gis/services/earth_science/Geoscience_Australia_Geochronology/MapServer/WMSServer",
                            "layers": "Sm-Nd,U-PbSHRIMPmagmatic,U-PbSHRIMPmaximumDepositional,U-PbSHRIMPmetamorphic,U-PbTIMSconventional,Rb-Sr",
                            "opacity": 1,
                            "layerTimeout": 5000,
                            "metadataText": "This map service was created to replace the GA National Geoscience Datasets service: to that end it should be used in conjunction with other GA map services. There are layers for SHRIMP, Sm-Nd, Rb-Sr and U-Pb. While the data used for SHRIMP and Sm-Nd is from new data releases, the data for Rb-Sr and U-Pb is the same as used in the National Geoscience Datasets service. Some data for Antarctica is included.",
                            "ogcLinks": [
                                {
                                    "description": "Service Metadata",
                                    "url": "http://www.ga.gov.au/geoportal/catalog/search/resource/details.page?uuid=%7B6ED18696-C937-43B1-978C-3F78D7264419%7D"
                                },
                                {
                                    "description": "REST",
                                    "url": "http://www.ga.gov.au/gis/rest/services/earth_science/Geoscience_Australia_Geochronology/MapServer"
                                },
                                {
                                    "description": "WMS Capabilities",
                                    "url": "http://www.ga.gov.au/gis/services/earth_science/Geoscience_Australia_Geochronology/MapServer/WMSServer?request=GetCapabilities&service=WMS"
                                },
                                {
                                    "description": "ArcMap Layerfile",
                                    "url": "http://www.ga.gov.au/gis/rest/services/earth_science/Geoscience_Australia_Geochronology/MapServer?f=lyr&v=9.3"
                                }
                            ],
                            "queryFeatures": false
                        }
                    ]
                });

            $httpBackend
                .when('GET', 'api/config/master-tool-list.json')
                .respond(
                {
                    "tools": [
                        {
                            "slug": "Add_Layer",
                            "id": "addLayer",
                            "toolPanelUrl": "resources/partial/addLayerPanel.html",
                            "toolToggleUrl": "resources/partial/addLayerToggle.html",
                            "config": {
                                "titleText": "Add layers"
                            }
                        },
                        {
                            "slug": "Client_Measure",
                            "id": "clientMeasure",
                            "toolPanelUrl": "resources/partial/measurePanel.html",
                            "toolToggleUrl": "resources/partial/measureToggle.html",
                            "config": {
                                "titleText": "Measure distance between points"
                            }
                        }
                    ]
                });

        }));

        it('Should init the master list layer service successfully', function () {
            var pass = false;
            masterLayerService.initMasterLists().then(function () {
                pass = true;
            });

            $httpBackend.expectGET('api/config/master-layer-list.json');
            $httpBackend.expectGET('api/config/master-tool-list.json');
            $httpBackend.flush();
            expect(pass).toBe(true);
        });
    });