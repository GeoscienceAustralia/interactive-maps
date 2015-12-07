/* global angular, $ */
(function () {
    "use strict";
    var app = angular.module('interactiveMaps.configCreator.mapConfigAccordion', [ 'interactiveMaps.services','geowebtoolkit.core.data-services' ]);

    app.controller('mapConfigAccordion', ['$scope', '$log', '$timeout', '$http', 'GeoMapService', 'configCreatorService',
        function ($scope, $log, $timeout, $http, GeoMapService, configCreatorService) {

            $scope.resetConfig = function () {
                if(confirm("Are you sure you want to reset? All config data will be lost.")) {
                    $scope.initConfig();
                }
            };

            $scope.saveJSON = function () {
                var string = JSON.stringify($scope.configPreview, null, "\t");
                var encodedString = configCreatorService.b64EncodeUnicode(string);
                console.log(encodedString);
                var dataUrl = 'data:application/octet-stream;base64,' + encodedString;
                var anchor = document.createElement('a');
                anchor.setAttribute('href', dataUrl);
                anchor.setAttribute('download', $scope.config.id + '.json');

                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
            };

            $scope.populateTestData = function () {
                $scope.configOutputEmpty = false;
                var config = {
                    "title": "Tool testing",
                    "id": "tooltest-1",
                    "previewImageUrl": "content/minerals/geomorphology/mapPreview.png",
                    "previewDescription": "AMSIS is a web based interactive mapping and decision support system that improves access to integrated government and non-government information in the Australian Marine Jurisdiction.",
                    "datumProjection": "EPSG:3857",
                    "displayProjection": "EPSG:4326",
                    "initialExtent": [
                        [30, 10],
                        [180, -70]
                    ],
                    "zoomLevel": 0,
                    "requiresTermsAndConditions": true,
                    "termsAndConditionsText": "TERMS TEXT REQUIRED",
                    "cookieExpirationInDays": 7,
                    "headerConfig": {
                        "title": "AMSIS -Dev"
                    },
                    "aboutConfig": {
                        "enabled": true,
                        "bodyUrl": "content/sandpit/dummy/about.html"
                    },
                    "layersConfig": {
                        "enabled": true
                    },
                    "baseLayersConfig": {
                        "enabled": true
                    },
                    "legendConfig": {
                        "enabled": true,
                        "legendUrl": "content/amsis/sasla1973/legend.html"
                    },
                    "toolsConfig": {
                        "enabled": true,
                        "timeout": 5000,
                        "tools": [
                            {
                                "id": "info",
                                "enabled": true,
                                "toolPanelUrl": "resources/partial/infoPanel.html",
                                "toolToggleUrl": "resources/partial/infoToggle.html",
                                "sortNumber": 1,
                                "config": {
                                    "titleText": "Download Dataset",
                                    "panelHeading": "Download Dataset",
                                    "infoList": [
                                        { "id": "Seas and Submerged Lands Act 1973 - Australian Maritime Boundaries 2014 - Geodatabase", "url": "http://www.ga.gov.au/metadata-gateway/metadata/record/gcat_043dbb8c-66d9-6897-e054-00144fdd4fa6/Seas+and+Submerged+Lands+Act+1973+-+Australian+Maritime+Boundaries+2014+-+Geodatabase" }
                                    ]
                                }
                            },
                            {
                                "id": "addLayer",
                                "enabled": true,
                                "toolPanelUrl": "resources/partial/addLayerPanel.html",
                                "toolToggleUrl": "resources/partial/addLayerToggle.html",
                                "sortNumber": 2,
                                "config": {
                                    "titleText": "Add layers"
                                }
                            },
//                    {
//                        "id": "dynamicLayer",
//                        "toolPanelUrl": "resources/partial/layerExplorerPanel.html",
//                        "toolToggleUrl": "resources/partial/layerExplorerToggle.html",
//                        "config": {
//                            "titleText": "Add dynamic layers",
//                            "symbol": "<img src=\"resources/img/Layers.png\"/>"
//                        }
//                    },
                            {
                                "id": "export",
                                "enabled": true,
                                "toolPanelUrl": "resources/partial/exportPanel.html",
                                "toolToggleUrl": "resources/partial/exportToggle.html",
                                "sortNumber": 3,
                                "config": {
                                    "titleText": "Print PDF",
                                    "panelHeading": "Print PDF",
                                    "url": "/gisgp/rest/services/topography/Print_Service/GPServer/PrintPoint/",
                                    "templatesList": ["Landscape_A4", "Portrait_A4", "Landscape_A3", "Portrait_A3"],
                                    "markerUrl": "content/marker/marker-print.png",
                                    "markerWidth": "55",
                                    "markerHeight": "40"
                                }
                            },
                            {
                                "id": "draw",
                                "enabled": true,
                                "toolPanelUrl": "resources/partial/drawPanel.html",
                                "toolToggleUrl": "resources/partial/drawToggle.html",
                                "sortNumber": 4,
                                "config": {
                                    "titleText": "Drawing Tools",
                                    "panelHeading": "Drawing Tools"
                                }
                            },
                            {
                                "id": "clientMeasure",
                                "enabled": true,
                                "toolPanelUrl": "resources/partial/measurePanel.html",
                                "toolToggleUrl": "resources/partial/measureToggle.html",
                                "sortNumber": 5,
                                "config": {
                                    "titleText": "Distance between points",
                                    "panelHeading": "Distance between points"
                                }
                            },
                            {
                                "id": "distanceBoundary",
                                "enabled": true,
                                "toolPanelUrl": "resources/partial/boundaryToolPanel.html",
                                "toolToggleUrl": "resources/partial/boundaryToolToggle.html",
                                "sortNumber": 6,
                                "config": {
                                    "titleText": "Distance to Boundary",
                                    "panelHeading": "Distance to Boundary",
                                    "markerUrl": "content/marker/marker-distance.png",
                                    "markerWidth": "55",
                                    "markerHeight": "40",
                                    "boundaries": [
                                        {
                                            "id": "Australian Coastline",
                                            "url": "/gisgp/rest/services/marine_coastal/AMSIS_DistanceTo_Service/GPServer/DistanceToAustralianCoast/"
                                        },
                                        {
                                            "id": "Coastal Waters",
                                            "url": "/gisgp/rest/services/marine_coastal/AMSIS_DistanceTo_Service/GPServer/DistanceToCoastalWatersLimit/"
                                        },
                                        {
                                            "id": "Territorial Sea",
                                            "url": "/gisgp/rest/services/marine_coastal/AMSIS_DistanceTo_Service/GPServer/DistanceToTerritorialSeaZoneLimit/"
                                        },
                                        {
                                            "id": "Contiguous Zone",
                                            "url": "/gisgp/rest/services/marine_coastal/AMSIS_DistanceTo_Service/GPServer/DistanceToContiguousZoneLimit/"
                                        },
                                        {
                                            "id": "Exclusive Economic Zone",
                                            "url": "/gisgp/rest/services/marine_coastal/AMSIS_DistanceTo_Service/GPServer/DistanceToExclusiveEconomicZoneLimit/"
                                        },
                                        {
                                            "id": "Exclusive Economic Zone as Amended by the Perth Treaty 1997",
                                            "url": "/gisgp/rest/services/marine_coastal/AMSIS_DistanceTo_Service/GPServer/DistanceToExclusiveEconomicZoneAmendedPerthLimit/"
                                        },
                                        {
                                            "id": "Continental Shelf",
                                            "url": "/gisgp/rest/services/marine_coastal/AMSIS_DistanceTo_Service/GPServer/DistanceToContinentalShelf/"
                                        }
                                    ]
                                }
                            },
                            {
                                "id": "identifyTool",
                                "enabled": true,
                                "toolPanelUrl": "resources/partial/interrogateDataPanel.html",
                                "toolToggleUrl": "resources/partial/interrogateDataToggle.html",
                                "sortNumber": 7,
                                "config": {
                                    "titleText": "Identify Features",
                                    "panelHeading": "Identify Features",
                                    "symbol": "<img src=\"content/marker/identify.png\"/>",
                                    "propertiesOfInterest": ["NAME", "OBJNAM", "CATLIM", "CATBDY", "NOBJNM", "NATION", "STATES", "VERTJN", "SORHCS", "PHCS", "LEGSOU", "FRLI_REF", "DATE", "LEVEL_ADMIN", "IP_OWNER", "LICENCE", "DISCLAIMER", "COMMENT"],
                                    "propertiesAlias": ["Name", "Object Name", "Catlim", "Catbdy", "Nobjnm", "Nation", "States", "Vertjn", "Sorhcs", "Phcs", "Legsou", "Frli Ref", "Date", "Level Admin", "Ip Owner", "Licence", "Disclaimer", "Comment"],
                                    "primaryPropertyName": "CATLIM",
                                    "showEmptyFeatures": true,
                                    "requiresGeometry": true,
                                    "markerUrl": "content/marker/marker-identify.png",
                                    "markerWidth": "55",
                                    "markerHeight": "40"
                                }
                            },
                            {
                                "id": "legalInterest",
                                "enabled": true,
                                "toolPanelUrl": "resources/partial/interrogateDataPanel.html",
                                "toolToggleUrl": "resources/partial/interrogateDataToggle.html",
                                "sortNumber": 8,
                                "config": {
                                    "titleText": "Interrogate legal interests",
                                    "panelHeading": "Interrogate legal interests",
                                    "symbol": "<img src=\"resources/img/legal.png\"/>",
                                    "propertiesOfInterest": ["NAME", "OBJNAM", "CATLIM", "CATBDY", "NOBJNM", "NATION", "STATES", "VERTJN", "SORHCS", "PHCS", "LEGSOU", "FRLI_REF", "DATE", "LEVEL_ADMIN", "IP_OWNER", "LICENCE", "DISCLAIMER", "COMMENT"],
                                    "propertiesAlias": ["Name", "Object Name", "Catlim", "Catbdy", "Nobjnm", "Nation", "States", "Vertjn", "Sorhcs", "Phcs", "Legsou", "Frli Ref", "Date", "Level Admin", "Ip Owner", "Licence", "Disclaimer", "Comment"],
                                    "primaryPropertyName": "NAME",
                                    "showEmptyFeatures": true,
                                    "requiresGeometry": true,
                                    "markerUrl": "content/marker/marker-legal.png",
                                    "markerWidth": "55",
                                    "markerHeight": "40",
                                    "endpoints": [
                                        {
                                            "url": "/gis/services/legislation/CWTH_SSLA_1973_Contiguous_Zone_AMB2014/MapServer/WFSServer",
                                            "featureType": "Contiguous_Zone_Seas_and_Submerged_Lands_Limits_of_Contiguous_Zone_Proclamation_1999_AMB2014_Limit",
                                            "featurePrefix": "legislation_CWTH_SSLA_1973_Contiguous_Zone_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        },
                                        {
                                            "url": "/gis/services/legislation/CWTH_SSLA_1973_Contiguous_Zone_AMB2014/MapServer/WFSServer",
                                            "featureType": "Contiguous_Zone_Seas_and_Submerged_Lands_Limits_of_Contiguous_Zone_Proclamation_1999_AMB2014_Area",
                                            "featurePrefix": "legislation_CWTH_SSLA_1973_Contiguous_Zone_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        },
                                        {
                                            "url": "/gis/services/legislation/CWTH_CW_Act_1980_Coastal_Waters_AMB2014/MapServer/WFSServer",
                                            "featureType": "Coastal_Waters_State_and_Northern_Territory_Powers_Act_1980_AMB2014_Limit",
                                            "featurePrefix": "legislation_CWTH_CW_Act_1980_Coastal_Waters_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        },
                                        {
                                            "url": "/gis/services/legislation/CWTH_CW_Act_1980_Coastal_Waters_AMB2014/MapServer/WFSServer",
                                            "featureType": "Coastal_Waters_State_and_Northern_Territory_Powers_Act_1980_AMB2014_Area",
                                            "featurePrefix": "legislation_CWTH_CW_Act_1980_Coastal_Waters_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        },
                                        {
                                            "url": "/gis/services/legislation/CWTH_SSLA_1973_Territorial_Sea_AMB2014/MapServer/WFSServer",
                                            "featureType": "Territorial_Sea_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_7_09_11_1990_AMB2014_Limit",
                                            "featurePrefix": "legislation_CWTH_SSLA_1973_Territorial_Sea_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        },
                                        {
                                            "url": "/gis/services/legislation/CWTH_SSLA_1973_Territorial_Sea_AMB2014/MapServer/WFSServer",
                                            "featureType": "Territorial_Sea_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_7_09_11_1990_AMB2014_Area",
                                            "featurePrefix": "legislation_CWTH_SSLA_1973_Territorial_Sea_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        },
                                        {
                                            "url": "/gis/services/legislation/CWTH_SSLA_1973_Continental_Shelf_AMB2014/MapServer/WFSServer",
                                            "featureType": "Continental_Shelf_AMB2014_Limit",
                                            "featurePrefix": "legislation_CWTH_SSLA_1973_Continental_Shelf_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        },
                                        {
                                            "url": "/gis/services/legislation/CWTH_SSLA_1973_Continental_Shelf_AMB2014/MapServer/WFSServer",
                                            "featureType": "Continental_Shelf_AMB2014_Area",
                                            "featurePrefix": "legislation_CWTH_SSLA_1973_Continental_Shelf_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        },
                                        {
                                            "url": "/gis/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_As_Proclaimed_AMB2014/MapServer/WFSServer",
                                            "featureType": "Exclusive_Economic_Zone_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_10B_26_07_1994_AMB2014_Limit",
                                            "featurePrefix": "legislation_CWTH_SSLA_1973_Exclusive_Economic_Zone_As_Proclaimed_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        },
                                        {
                                            "url": "/gis/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_As_Proclaimed_AMB2014/MapServer/WFSServer",
                                            "featureType": "Exclusive_Economic_Zone_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_10B_26_07_1994_AMB2014_Area",
                                            "featurePrefix": "legislation_CWTH_SSLA_1973_Exclusive_Economic_Zone_As_Proclaimed_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        },
                                        {
                                            "url": "/gis/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_Amended_by_Perth_Treaty_AMB2014/MapServer/WFSServer",
                                            "featureType": "Exclusive_Economic_Zone_As_Amended_by_the_Perth_Treaty_1997_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_10B_26_07_1994_AMB2014_Limit",
                                            "featurePrefix": "legislation_CWTH_SSLA_1973_Exclusive_Economic_Zone_Amended_by_Perth_Treaty_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        },
                                        {
                                            "url": "/gis/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_Amended_by_Perth_Treaty_AMB2014/MapServer/WFSServer",
                                            "featureType": "Exclusive_Economic_Zone_As_Amended_by_the_Perth_Treaty_1997_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_10B_26_07_1994_AMB2014_Area",
                                            "featurePrefix": "legislation_CWTH_SSLA_1973_Exclusive_Economic_Zone_Amended_by_Perth_Treaty_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        },
                                        {
                                            "url": "/gis/services/legislation/CWTH_OPGGSA_2006_Scheduled_Areas_AMB2014/MapServer/WFSServer",
                                            "featureType": "Scheduled_Areas_under_the_Offshore_Petroleum_and_Greenhouse_Gas_Storage_Act_AMB2014_Points",
                                            "featurePrefix": "legislation_CWTH_OPGGSA_2006_Scheduled_Areas_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        },
                                        {
                                            "url": "/gis/services/legislation/CWTH_OPGGSA_2006_Scheduled_Areas_AMB2014/MapServer/WFSServer",
                                            "featureType": "Scheduled_Areas_under_the_Offshore_Petroleum_and_Greenhouse_Gas_Storage_Act_AMB2014_Limit",
                                            "featurePrefix": "legislation_CWTH_OPGGSA_2006_Scheduled_Areas_AMB2014",
                                            "geometryName": "Shape",
                                            "queryType": "WFS"
                                        }
                                    ]
                                }
                            }
                        ]
                    },
                    "baseMaps": [
                        {
                            "mapType": "XYZTileCache",
                            "visibility": true,
                            "name": "World Image",
                            "url": "http://www.ga.gov.au/gisimg/rest/services/topography/World_Bathymetry_Image_WM/MapServer",
                            "mapBGColor": "194584",
                            "opacity": 1.0,
                            "wrapDateLine": true,
                            "maxZoomLevel": 12,
                            "attribution": "World <a target='_blank' href='http://creativecommons.org/licenses/by/3.0/au/deed.en'>CC-By-Au</a> and <a target='_blank' href='http://www.naturalearthdata.com/'>Natural Earth</a>"
                        },
                        {
                            "mapType": "GoogleStreet",
                            "visibility": false,
                            "name": "Google Street",
                            "opacity": 1.0,
                            "wrapDateLine": true,
                            "maxZoomLevel": 12,
                            "attribution": "Geoscience Australia <a target='_blank' href='http://creativecommons.org/licenses/by/3.0/au/deed.en'>CC-By-Au</a> and Google Maps"
                        },
                        {
                            "mapType": "XYZTileCache",
                            "visibility": false,
                            "name": "World Political Boundaries",
                            "url": "http://www.ga.gov.au/gis/rest/services/topography/World_Political_Boundaries_WM/MapServer",
                            "mapBGColor": "2356b9",
                            "opacity": 1.0,
                            "wrapDateLine": true,
                            "maxZoomLevel": 12,
                            "attribution": "Political <a target='_blank' href='http://creativecommons.org/licenses/by/3.0/au/deed.en'>CC-By-Au</a> and <a target='_blank' href='http://www.naturalearthdata.com/'>Natural Earth</a>"
                        }
                    ],
                    "layerMaps": [
                        {
                            "id": "topography",
                            "mapType": "ArcGISCache",
                            "visibility": true,
                            "name": "Australian Topography",
                            "url": "http://www.ga.gov.au/gis/rest/services/topography/Australian_Topography_2014_WM/MapServer",
                            "opacity": 1.0,
                            "layerTimeout": 5000,
                            "metadataText": "The Australian Topographic map service is seamless national dataset coverage for the whole of Australia. The map portrays detailed graphic representation of features that appear on the Earth's surface. These features include cultural, hydrography and relief themes.",
                            "ogcLinks": [
                                {"description": "REST", "url": "http://www.ga.gov.au/gis/rest/services/topography/Australian_Topography_2014_WM/MapServer"},
                                {"description": "WMS Capabilities", "url": "http://www.ga.gov.au/gis/services/topography/Australian_Topography_2014_WM/MapServer/WMSServer?request=GetCapabilities&service=WMS"},
                                {"description": "ArcMap Layerfile", "url": "http://www.ga.gov.au/gis/rest/services/topography/Australian_Topography_2014_WM/MapServer?f=lyr&v=9.3"},
                                {"description": "Service Metadata", "url": "http://www.ga.gov.au/geoportal/catalog/search/resource/details.page?uuid=%7B86C897AA-BD75-44E3-9628-73560C3184D4%7D"}
                            ],
                            "queryFeatures": false
                        },
                        {
                            "mapType": "WMS",
                            "visibility": true,
                            "name": "Exclusive Economic Zone as Amended by the Perth Treaty 1997 AMB 2014",
                            "url": "http://www.ga.gov.au/gis/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_Amended_by_Perth_Treaty_AMB2014/MapServer/WMSServer",
                            "layers": "Exclusive_Economic_Zone_As_Amended_by_the_Perth_Treaty_1997_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_10B_26_07_1994_AMB2014_Area,Exclusive_Economic_Zone_As_Amended_by_the_Perth_Treaty_1997_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_10B_26_07_1994_AMB2014_Limit",
                            "metadataText": "Line and polygon depicting the Australian EEZ as modified by the application of the Treaty between the Government of Australia and the Government of the Republic of Indonesia establishing an Exclusive Economic Zone Boundary and Certain Seabed Boundaries (Perth, 14 march 1997) [1997] ATNIF 9 - (not yet in force). NOTE: This is the standard depiction of the Australian EEZ.",
                            "ogcLinks": [
                                {"description": "REST", "url": "http://www.ga.gov.au/gis/rest/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_Amended_by_Perth_Treaty_AMB2014/MapServer"},
                                {"description": "WMS Capabilities", "url": "http://www.ga.gov.au/gis/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_Amended_by_Perth_Treaty_AMB2014/MapServer/WMSServer?request=GetCapabilities&service=WMS"},
                                {"description": "ArcMap Layerfile", "url": "http://www.ga.gov.au/gis/rest/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_Amended_by_Perth_Treaty_AMB2014/MapServer?f=lyr&v=9.3"},
                                {"description": "Service Metadata", "url": "http://www.ga.gov.au/geoportal/catalog/search/resource/details.page?uuid=%7B93C61A4B-F83E-4A42-842A-5C4DC99D87A0%7D"}
                            ],
                            "opacity": 0.3,
                            "queryFeatures": true,
                            "queryUrl": "/gis/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_Amended_by_Perth_Treaty_AMB2014/MapServer/WMSServer",
                            "queryUrlType": "WMS",
                            "queryVersion": "1.1.1",
                            "queryLayers": "Exclusive_Economic_Zone_As_Amended_by_the_Perth_Treaty_1997_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_10B_26_07_1994_AMB2014_Area,Exclusive_Economic_Zone_As_Amended_by_the_Perth_Treaty_1997_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_10B_26_07_1994_AMB2014_Limit"
                        },
                        {
                            "mapType": "WMS",
                            "visibility": true,
                            "name": "Exclusive Economic Zone as Proclaimed 1973 AMB 2014",
                            "url": "http://www.ga.gov.au/gis/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_As_Proclaimed_AMB2014/MapServer/WMSServer",
                            "layers": "Exclusive_Economic_Zone_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_10B_26_07_1994_AMB2014_Area,Exclusive_Economic_Zone_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_10B_26_07_1994_AMB2014_Limit",
                            "metadataText": "Lines and polygons depicting the outer limit and extent of the Austraian EEZ as proclaimed by the Seas and Submerged Lands Act 1973 - Proclamation under section 10B (26/07/1994). NOTE: Although this proclamation reamins in force, for many matters the limit modified by the action of the Treaty between the Government of Australia and the Government of the Republic of Indonesia establishing an Exclusive Economic Zone Boundary and Certain Seabed Boundaries (Perth, 14 march 1997) [1997] ATNIF 9 - (not yet in force) applies.",
                            "ogcLinks": [
                                {"description": "REST", "url": "http://www.ga.gov.au/gis/rest/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_As_Proclaimed_AMB2014/MapServer"},
                                {"description": "WMS Capabilities", "url": "http://www.ga.gov.au/gis/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_As_Proclaimed_AMB2014/MapServer/WMSServer?request=GetCapabilities&service=WMS"},
                                {"description": "ArcMap Layerfile", "url": "http://www.ga.gov.au/gis/rest/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_As_Proclaimed_AMB2014/MapServer?f=lyr&v=9.3"},
                                {"description": "Service Metadata", "url": "http://www.ga.gov.au/geoportal/catalog/search/resource/details.page?uuid=%7B5CA54826-0ACC-446C-9D2E-4306571234AE%7D"}
                            ],
                            "opacity": 0.3,
                            "queryFeatures": true,
                            "queryUrl": "/gis/services/legislation/CWTH_SSLA_1973_Exclusive_Economic_Zone_As_Proclaimed_AMB2014/MapServer/WMSServer",
                            "queryUrlType": "WMS",
                            "queryVersion": "1.1.1",
                            "queryLayers": "Exclusive_Economic_Zone_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_10B_26_07_1994_AMB2014_Limit,Exclusive_Economic_Zone_Seas_and_Submerged_Lands_Act_1973_Proclamation_under_section_10B_26_07_1994_AMB2014_Area"
                        },
                        {
                            "mapType": "WMS",
                            "visibility": true,
                            "name": "Contiguous Zone AMB 2014",
                            "url": "http://www.ga.gov.au/gis/services/legislation/CWTH_SSLA_1973_Contiguous_Zone_AMB2014/MapServer/WMSServer",
                            "layers": "Contiguous_Zone_Seas_and_Submerged_Lands_Limits_of_Contiguous_Zone_Proclamation_1999_AMB2014_Area,Contiguous_Zone_Seas_and_Submerged_Lands_Limits_of_Contiguous_Zone_Proclamation_1999_AMB2014_Limit",
                            "metadataText": "Lines and polygons depicting the limit and extent of the Contiguous Zone. Seas and Submerged Lands (Limits of Contiguous Zone) Proclamation 1999. ",
                            "ogcLinks": [
                                {"description": "REST", "url": "http://www.ga.gov.au/gis/rest/services/legislation/CWTH_SSLA_1973_Contiguous_Zone_AMB2014/MapServer"},
                                {"description": "WMS Capabilities", "url": "http://www.ga.gov.au/gis/services/legislation/CWTH_SSLA_1973_Contiguous_Zone_AMB2014/MapServer/WMSServer?request=GetCapabilities&service=WMS"},
                                {"description": "ArcMap Layerfile", "url": "http://www.ga.gov.au/gis/rest/services/legislation/CWTH_SSLA_1973_Contiguous_Zone_AMB2014/MapServer?f=lyr&v=9.3"},
                                {"description": "Service Metadata", "url": "http://www.ga.gov.au/geoportal/catalog/search/resource/details.page?uuid=%7B4F376E79-99A5-4A02-8E67-CC433EA6A6EB%7D"}
                            ],
                            "opacity": 0.3,
                            "queryFeatures": true,
                            "queryUrl": "/gis/services/legislation/CWTH_SSLA_1973_Contiguous_Zone_AMB2014/MapServer/WMSServer",
                            "queryUrlType": "WMS",
                            "queryVersion": "1.1.1",
                            "queryLayers": "Contiguous_Zone_Seas_and_Submerged_Lands_Limits_of_Contiguous_Zone_Proclamation_1999_AMB2014_Area,Contiguous_Zone_Seas_and_Submerged_Lands_Limits_of_Contiguous_Zone_Proclamation_1999_AMB2014_Limit"
                        },
                        {
                            "mapType": "WMS",
                            "visibility": true,
                            "name": "Continental Shelf AMB 2014",
                            "url": "http://www.ga.gov.au/gis/services/legislation/CWTH_SSLA_1973_Continental_Shelf_AMB2014/MapServer/WMSServer",
                            "layers": "Continental_Shelf_AMB2014_Area,Continental_Shelf_AMB2014_Limit",
                            "metadataText": "Line depicting the limit of the continental shelf made under the Seas and Submerged Lands (Limits of Continental Shelf) Proclamation 2012.",
                            "ogcLinks": [
                                {"description": "REST", "url": "http://www.ga.gov.au/gis/rest/services/legislation/CWTH_SSLA_1973_Continental_Shelf_AMB2014/MapServer"},
                                {"description": "WMS Capabilities", "url": "http://www.ga.gov.au/gis/services/legislation/CWTH_SSLA_1973_Continental_Shelf_AMB2014/MapServer/WMSServer?request=GetCapabilities&service=WMS"},
                                {"description": "ArcMap Layerfile", "url": "http://www.ga.gov.au/gis/rest/services/legislation/CWTH_SSLA_1973_Continental_Shelf_AMB2014/MapServer?f=lyr&v=9.3"},
                                {"description": "Service Metadata", "url": "http://www.ga.gov.au/geoportal/catalog/search/resource/details.page?uuid=%7B93C50EEF-B0F6-43F9-A415-2D0052234AEF%7D"}
                            ],
                            "opacity": 0.3,
                            "queryFeatures": true,
                            "queryUrl": "/gis/services/legislation/CWTH_SSLA_1973_Continental_Shelf_AMB2014/MapServer/WMSServer",
                            "queryUrlType": "WMS",
                            "queryVersion": "1.1.1",
                            "queryLayers": "Continental_Shelf_AMB2014_Area,Continental_Shelf_AMB2014_Limit"
                        },
                        {
                            "mapType": "WMS",
                            "visibility": true,
                            "name": "Straight Baselines AMB 2014",
                            "url": "http://www.ga.gov.au/gis/services/legislation/CWTH_SSLA_1973_Straight_Baselines_AMB2014/MapServer/WMSServer",
                            "layers": "Baselines_Straight_Seas_and_Submerged_Lands_Territorial_Sea_Baseline_Proclamation_2006_AMB2014_Limit",
                            "metadataText": "Straight Baseline defined under the Seas and Submerged Lands (Territorial Sea Baseline) Proclamation 2006.",
                            "ogcLinks": [
                                {"description": "REST", "url": "http://www.ga.gov.au/gis/rest/services/legislation/CWTH_SSLA_1973_Straight_Baselines_AMB2014/MapServer"},
                                {"description": "WMS Capabilities", "url": "http://www.ga.gov.au/gis/services/legislation/CWTH_SSLA_1973_Straight_Baselines_AMB2014/MapServer/WMSServer?request=GetCapabilities&service=WMS"},
                                {"description": "ArcMap Layerfile", "url": "http://www.ga.gov.au/gis/rest/services/legislation/CWTH_SSLA_1973_Straight_Baselines_AMB2014/MapServer?f=lyr&v=9.3"},
                                {"description": "Service Metadata", "url": "http://www.ga.gov.au/geoportal/catalog/search/resource/details.page?uuid=%7B8111844D-5185-4AFA-9532-EF5C0B075F92%7D"}
                            ],
                            "opacity": 0.3,
                            "queryFeatures": true,
                            "queryUrl": "/gis/services/legislation/CWTH_SSLA_1973_Straight_Baselines_AMB2014/MapServer/WMSServer",
                            "queryUrlType": "WMS",
                            "queryVersion": "1.1.1",
                            "queryLayers": "Baselines_Straight_Seas_and_Submerged_Lands_Territorial_Sea_Baseline_Proclamation_2006_AMB2014_Limit"
                        },
                        {
                            "mapType": "WMS",
                            "visibility": true,
                            "name": "Normal Baselines AMB 2014",
                            "url": "http://www.ga.gov.au/gis/services/legislation/CWTH_SSLA_1973_Normal_Baselines_AMB2014/MapServer/WMSServer",
                            "layers": "Baselines_Normal_Seas_and_Submerged_Lands_Territorial_Sea_Baseline_Proclamation_2006_AMB2014_Limit",
                            "metadataText": "Normal Baseline defined under the Seas and Submerged Lands (Territorial Sea Baseline) Proclamation 2006.",
                            "ogcLinks": [
                                {"description": "REST", "url": "http://www.ga.gov.au/gis/rest/services/legislation/CWTH_SSLA_1973_Normal_Baselines_AMB2014/MapServer"},
                                {"description": "WMS Capabilities", "url": "http://www.ga.gov.au/gis/services/legislation/CWTH_SSLA_1973_Normal_Baselines_AMB2014/MapServer/WMSServer?request=GetCapabilities&service=WMS"},
                                {"description": "ArcMap Layerfile", "url": "http://www.ga.gov.au/gis/rest/services/legislation/CWTH_SSLA_1973_Normal_Baselines_AMB2014/MapServer?f=lyr&v=9.3"},
                                {"description": "Service Metadata", "url": "http://www.ga.gov.au/geoportal/catalog/search/resource/details.page?uuid=%7BEC7C6D5F-D794-4774-8A97-9BE98EC1373D%7D"}
                            ],
                            "opacity": 0.3,
                            "queryFeatures": true,
                            "queryUrl": "/gis/services/legislation/CWTH_SSLA_1973_Normal_Baselines_AMB2014/MapServer/WMSServer",
                            "queryUrlType": "WMS",
                            "queryVersion": "1.1.1",
                            "queryLayers": "Baselines_Normal_Seas_and_Submerged_Lands_Territorial_Sea_Baseline_Proclamation_2006_AMB2014_Limit"
                        }
                    ]
                };

                $scope.updateConfig(config);
            };


        }]);
})();
