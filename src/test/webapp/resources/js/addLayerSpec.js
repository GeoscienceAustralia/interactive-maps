/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */

describe('addLayer tests',
    function () {
        var $compile, scope, elm, control, $httpBackend;

        beforeEach(module('testApp'));

        beforeEach(inject(function (_$compile_, _$rootScope_, $injector, $sniffer) {
            $compile = _$compile_;
            $scope = _$rootScope_;

            element = angular
                .element('<div ng-controller="addLayerPanelController">');

            $httpBackend = $injector.get('$httpBackend');

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
                                }
                            ],
                            "queryFeatures": false
                        }
                    ]
                });

            $scope.geoConfig = {
                "layerMaps": [
                    {
                        "slug": "Antarctica_10_Million_Geology",
                        "mapType": "WMS",
                        "visibility": true,
                        "name": "Antarctica 10 million Geology",
                        "url": "http://ogc.bgs.ac.uk/cgi-bin/BGS_GA_Bedrock_Geology/wms",
                        "layers": "BGS_GA_BEDROCK_GEOLOGY,ATA_GA_10M_BA",
                        "metadataText": "Antarctic OneGeology WMS Service. Service provided by the British Geological Survey from data provided by Geoscience Australia. The data is copyright Geoscience Australia. Data is at 1: 10 million scale. Data derived from SCHEMATIC GEOLOGICAL MAP OF ANTARCTICA 1991, compiled by RJ Tingey.",
                        "ogcLinks": [
                            {
                                "description": "WMS Capabilities",
                                "url": "http://ogc.bgs.ac.uk/cgi-bin/BGS_GA_Bedrock_Geology/wms?request=GetCapabilities&service=WMS"
                            }
                        ],
                        "opacity": 1
                    },
                    {
                        "slug": "Australian_Topography",
                        "id": "topography",
                        "mapType": "ArcGISCache",
                        "visibility": true,
                        "name": "Australian Topography",
                        "url": "http://www.ga.gov.au/gis/rest/services/topography/Australian_Topography_WM/MapServer",
                        "opacity": 1,
                        "layerTimeout": 5000,
                        "queryFeatures": false
                    }
                ],
                "addLayerMaps": [
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
                            }
                        ],
                        "queryFeatures": false
                    }
                ]
            };

            $compile(element)(_$rootScope_);

            $scope.$digest();
        }));

        it('Should initialise an immutable list of layers', function () {
            $scope.$$childHead.initialiseImmutableLayersList();
            expect($scope.$$childHead.immutableLayers.length == 2).toBe(true);
        });

        it('Should add a new layer to geoConfig.addLayerMaps and geoConfig.layerMaps', function () {
            var layer = {
                "slug": "Australian_Topographic_250K_Mosaic",
                "mapType": "ArcGISCache",
                "visibility": true,
                "name": "Australian Topographic 250K Mosaic",
                "url": "http://www.ga.gov.au/gisimg/rest/services/topography/NATMAP_Digital_Maps_250K_2008Edition_WM/MapServer",
                "metadataText": "This cached map service contains the NATMAP 1:250,000 scale maps from the NATMAP Digital Maps 2008 DVD, produced by Geoscience Australia's National Mapping Division and its predecessor, the Australian Surveying and Land Information Group (AUSLIG), in the form of a single mosaic based on GDA94 geographic projection. This is the largest scale at which published topographic maps cover the entire continent. The maps have been revised using a variety of data sources, including SPOT and Landsat satellite imagery, other government agency information and data supplied by private companies and individuals.",
                "ogcLinks": [
                    {
                        "description": "Service Metadata",
                        "url": "http://www.ga.gov.au/geoportal/catalog/search/resource/details.page?uuid=%7B03582FA9-453D-4A61-80D9-968CA66C62BD%7D"
                    }
                ],
                "opacity": 1,
                "layerTimeout": 5000
            };

            $scope.$$childHead.onSelected(layer);
            expect($scope.$$childHead.immutableLayers.length === 2).toBe(true);
            expect($scope.geoConfig.addLayerMaps.length === 2).toBe(true);
            expect($scope.geoConfig.layerMaps.length === 3).toBe(true);
            expect($scope.$$childHead.selected === "").toBe(true);
        });

        it('Should not add a new layer to geoConfig.addLayerMaps and geoConfig.layerMaps', function () {
            var layer = {
                "slug": "Australian_Topography",
                "id": "topography",
                "mapType": "ArcGISCache",
                "visibility": true,
                "name": "Australian Topography",
                "url": "http://www.ga.gov.au/gis/rest/services/topography/Australian_Topography_WM/MapServer",
                "opacity": 1,
                "layerTimeout": 5000,
                "queryFeatures": false
            };

            $scope.$$childHead.onSelected(layer);
            expect($scope.$$childHead.immutableLayers.length === 2).toBe(true);
            expect($scope.geoConfig.addLayerMaps.length === 1).toBe(true);
            expect($scope.geoConfig.layerMaps.length === 2).toBe(true);
            expect($scope.$$childHead.selected === "").toBe(true);
        });

        it('Should add new layer to the layerCriteria', function () {
            var layer = {
                "layers": [
                    {
                        "slug": "Australian_Topographic_250K_Mosaic",
                        "mapType": "ArcGISCache",
                        "visibility": true,
                        "name": "Australian Topographic 250K Mosaic",
                        "url": "http://www.ga.gov.au/gisimg/rest/services/topography/NATMAP_Digital_Maps_250K_2008Edition_WM/MapServer",
                        "metadataText": "This cached map service contains the NATMAP 1:250,000 scale maps from the NATMAP Digital Maps 2008 DVD, produced by Geoscience Australia's National Mapping Division and its predecessor, the Australian Surveying and Land Information Group (AUSLIG), in the form of a single mosaic based on GDA94 geographic projection. This is the largest scale at which published topographic maps cover the entire continent. The maps have been revised using a variety of data sources, including SPOT and Landsat satellite imagery, other government agency information and data supplied by private companies and individuals.",
                        "ogcLinks": [
                            {
                                "description": "Service Metadata",
                                "url": "http://www.ga.gov.au/geoportal/catalog/search/resource/details.page?uuid=%7B03582FA9-453D-4A61-80D9-968CA66C62BD%7D"
                            }
                        ],
                        "opacity": 1,
                        "layerTimeout": 5000
                    }
                ]};

            $scope.$$childHead.initialiseMasterList(layer);

            expect($scope.$$childTail.layerCriteria.length === 1).toBe(true);
            expect($scope.$$childTail.layerCriteria[0].name).toBe('Australian Topographic 250K Mosaic');
        });

        it('Should not add new layer to the layerCriteria as it is already in geoConfig.layerMaps', function () {
            var layer = {
                "layers": [
                    {
                        "slug": "Australian_Topography",
                        "id": "topography",
                        "mapType": "ArcGISCache",
                        "visibility": true,
                        "name": "Australian Topography",
                        "url": "http://www.ga.gov.au/gis/rest/services/topography/Australian_Topography_WM/MapServer",
                        "opacity": 1,
                        "layerTimeout": 5000,
                        "queryFeatures": false
                    }
                ]};

            $scope.$$childHead.initialiseMasterList(layer);

            expect($scope.$$childTail.layerCriteria.length === 0).toBe(true);
        });

        it('Should add a new layer to geoConfig.layerMaps and then remove it', function () {
            var layer = {
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
                    }
                ],
                "queryFeatures": false,
                isActive: true
            };

            $scope.$$childHead.addRemoveLayer(layer);
            expect($scope.$$childHead.immutableLayers.length === 2).toBe(true);
            expect($scope.geoConfig.addLayerMaps[0].isActive).toBe(true);
            expect($scope.geoConfig.layerMaps.length === 3).toBe(true);

            layer.isActive = false;
            $scope.$$childHead.addRemoveLayer(layer);
            expect($scope.geoConfig.layerMaps.length === 2).toBe(true);
        });

        it('Should return false as the layer is in geoConfig.layerMaps and the immutable list ahs not yet being created', function () {
            var layer = {
                "slug": "Australian_Topography",
                "id": "topography",
                "mapType": "ArcGISCache",
                "visibility": true,
                "name": "Australian Topography",
                "url": "http://www.ga.gov.au/gis/rest/services/topography/Australian_Topography_WM/MapServer",
                "opacity": 1,
                "layerTimeout": 5000,
                "queryFeatures": false
            };

            expect($scope.$$childHead.filterLayers(layer)).toBe(false);
        });

        it('Should return false as the layer is in geoConfig.layerMaps and the immutable list', function () {
            var immutableList = [
                {
                    "slug": "Australian_Topography",
                    "id": "topography",
                    "mapType": "ArcGISCache",
                    "visibility": true,
                    "name": "Australian Topography",
                    "url": "http://www.ga.gov.au/gis/rest/services/topography/Australian_Topography_WM/MapServer",
                    "opacity": 1,
                    "layerTimeout": 5000,
                    "queryFeatures": false
                }
            ];

            var layer = {
                "slug": "Australian_Topography",
                "id": "topography",
                "mapType": "ArcGISCache",
                "visibility": true,
                "name": "Australian Topography",
                "url": "http://www.ga.gov.au/gis/rest/services/topography/Australian_Topography_WM/MapServer",
                "opacity": 1,
                "layerTimeout": 5000,
                "queryFeatures": false
            };

            expect($scope.$$childHead.filterLayers(layer)).toBe(false);
        });

        it('Should return true as the layer is not in geoConfig.layerMaps', function () {
            var layer = {
                "slug": "Australian_Topographic_250K_Mosaic",
                "mapType": "ArcGISCache",
                "visibility": true,
                "name": "Australian Topographic 250K Mosaic",
                "url": "http://www.ga.gov.au/gisimg/rest/services/topography/NATMAP_Digital_Maps_250K_2008Edition_WM/MapServer",
                "metadataText": "This cached map service contains the NATMAP 1:250,000 scale maps from the NATMAP Digital Maps 2008 DVD, produced by Geoscience Australia's National Mapping Division and its predecessor, the Australian Surveying and Land Information Group (AUSLIG), in the form of a single mosaic based on GDA94 geographic projection. This is the largest scale at which published topographic maps cover the entire continent. The maps have been revised using a variety of data sources, including SPOT and Landsat satellite imagery, other government agency information and data supplied by private companies and individuals.",
                "ogcLinks": [
                    {
                        "description": "Service Metadata",
                        "url": "http://www.ga.gov.au/geoportal/catalog/search/resource/details.page?uuid=%7B03582FA9-453D-4A61-80D9-968CA66C62BD%7D"
                    }
                ],
                "opacity": 1,
                "layerTimeout": 5000
            };

            expect($scope.$$childHead.filterLayers(layer)).toBe(true);
        });
    });