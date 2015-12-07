var themConfigExample = {
    //(-) == Not current used
    //(^) == Mandatory
    //(?) == Optional
    //(?^) == Optional dependent
    //(^-) == Not currently used but will be returned in web services and needs to be stored
    //(-)Title of the theme
    "title": "Petroleum with Topography",
    //(^-)ID of the theme which must match up with value in category json
    "id": "PT",
    //(-) preview image which is used in app.json, not in theme.
    "previewImageUrl": "resources/img/map-previews/Maritime.png",
    //(-) description
    "previewDescription": "AMSIS is a web based interactive mapping and decision support system that improves access to integrated government and non-government information in the Australian Marine Jurisdiction.",
    //(^) srs value sent to the servers when the map is created. This should end up as the base maps projection
    "datumProjection": "EPSG:102100",
    //(^) Display projection will default some controls to the specified projection as well as results returned from functions
    "displayProjection": "EPSG:4326",
    //(-) == Not used, was to control background colour of the base map to look better when waiting to load
    // Application uses a colour specified in CSS and seems to do the trick.
    // Might be an issue if base layer transparency is controlled
    "backgroundcolour": "#21468b",
    //(?^) - Centre position in displayProjection coords. Not required if using initialExtent
    "centerPosition": {"lat": "-2944965",
        "lon": "15300000"},
    //(?^) - Inital zoom level, used with centerPosition. Not required if using initialExtent
    "zoomLevel": 3,
    //(?^) - Initial extent, can be used instead of centerPosition + zoomLevel. geoJson Position in displayProjection CRS
    "initialExtent": [
        [100, -20],
        [100, -40],
        [160, -20],
        [160, -40]
    ],
    //(?) - Specifies if the theme requires the agreement of terms and conditions
    "requiresTermsAndConditions": false,
    //(?) - Customised header background and title
    "headerConfig": {
        "title": "AMSIS -Dev",
        "backgroundImageUrl": "resources/img/header_bg.png"
    },
    //(^) - Customised about panel, if enabled: false, button will not be present
    "aboutConfig": {
        "enabled": true,
        //Either bodyUrl and/or bodyText, bodyText is shown first if both.
        "bodyUrl": "resources/custom/amsis/PT/about.html",
        "bodyText": "AMSIS is a web based interactive mapping and decision support system that improves access to integrated government and non-government information in the Australian Marine Jurisdiction."
    },
    //(^) - config for layer picker, if enabled :false, button will not be present
    "layersConfig": {
        "enabled": true
    },
    //(^)
    "baseLayersConfig": {
        "enabled": true
    },
    //(^)
    "legendConfig": {
        "enabled": false,
        "legendImgUrl": "resources/img/legends/topolegend.png",
        "legendUrl": "resources/custom/amsis/PT/legend.html"
    },
    //(?)
    "toolsConfig": {
        "enabled": true,
        "timeout": 5000,
        "tools": [
            {
                "id": "clientMeasure",
                "toolPanelUrl": "resources/partial/measurePanel.html",
                "toolToggleUrl": "resources/partial/measureToggle.html"
            },
            {
                "id": "distanceBoundary",
                "toolPanelUrl": "resources/partial/boundaryToolPanel.html",
                "toolToggleUrl": "resources/partial/boundaryToolToggle.html"
            },
            {
                "id": "dynamicLayer",
                "toolPanelUrl": "resources/partial/newLayerPanel.html",
                "toolToggleUrl": "resources/partial/newLayerToggle.html"
            },
            {
                "id": "layerExplorer",
                "toolPanelUrl": "resources/partial/layerExplorerPanel.html",
                "toolToggleUrl": "resources/partial/layerExplorerToggle.html"
            },
            {
                "id": "legalInterest",
                "toolPanelUrl": "resources/partial/interrogateDataPanel.html",
                "toolToggleUrl": "resources/partial/interrogateDataToggle.html",
                "config": {
                    "titleText": "Legal interest",
                    "propertiesOfInterest": ["NAME"]
                }
            }
        ]

    },
    //(^) At least one, last visible wins as default
    "baseMaps": [
        {"mapType": "XYZTileCache", "visibility": false, "name": "World Image", "url": "http://www.ga.gov.au/gisimg/rest/services/topography/World_Bathymetry_Image_WM/MapServer", "mapBGColor": "194584", "opacity": 1.0, "wrapDateLine": true, "attribution": "World <a target='_blank' href='http://creativecommons.org/licenses/by/3.0/au/deed.en'>CC-By-Au</a> and <a target='_blank' href='http://www.naturalearthdata.com/'>Natural Earth</a>"},
        {"mapType": "GoogleStreet", "visibility": true, "name": "Google Street", "opacity": 1.0, "wrapDateLine": true}
    ],
    //(^) Can be empty.
    "layerMaps": [
        {
            "mapType": "WMS",
            "visibility": false,
            "name": "Australian Seabed Features",
            "url": "http://www.ga.gov.au/gis/services/marine_coastal/Australian_Seabed_Features/MapServer/WMSServer",
            "layers": "Geomorphic_Features",
            "opacity": 1.0,
            "layerTimeout": 5000
        },
        {
            "mapType": "WMS",
            "visibility": false,
            "name": "Topographic",
            "url": "http://www.ga.gov.au/gis/services/topography/Australian_Topography_NoAntiAliasing/MapServer/WMSServer",
            "layers": "Framework Boundaries,Framework Boundaries SS,Roads SS,Roads MS,Roads,State Names on Boundaries,State Names Anno MS,State Names Anno SS,Populated Places,Populated Places MS,Populated Places SS,Cities",
            "tileType": "large",
            "attribution": "Geoscience Australia Topography <a target='_blank' href='http://creativecommons.org/licenses/by/3.0/au/deed.en'>CC-By-Au</a>",
            "opacity": 1.0,
            "layerTimeout": 5000},
        //If a grouped set of layers is to be displayed, isGroupedLayers must be present
        //groupTitle will set the value of the heading in the group container
        //groupId has to match a groupId of one of the groupedLayers
        {"isGroupedLayers": true, "groupTitle": "Exclusive Layers", "groupId": "specialGroup", "visibility": true}
    ],
    //(?) - groupId must match a layer with both isGroupedLayers and same groupId
    //ID must be unique amongst all layers in the config, including that of other grouped layers
    //name must also be unique amongst all layers in the config, including that of other grouped layers
    "groupedLayers": [
        {
            "groupId": "specialGroup",
            "layerMaps": [
                {
                    "id": "foo1",
                    "groupId": "specialGroup",
                    "mapType": "WMS",
                    "visibility": true,
                    "name": "Exclusive - Landsat",
                    "url": "http://www.ga.gov.au/gisimg/services/topography/World_Bathymetry_Image_WM/MapServer/WMSServer",
                    "layers": "Australian Landsat",
                    "opacity": 1.0,
                    "tileType": "large"
                },
                {
                    "id": "foo2",
                    "groupId": "specialGroup",
                    "mapType": "WMS",
                    "visibility": true,
                    "name": "Exclusive - Geomorphic Seabed",
                    "url": "http://www.ga.gov.au/gis/services/marine_coastal/Australian_Seabed_Features/MapServer/WMSServer",
                    "layers": "Geomorphic_Features",
                    "opacity": 1.0
                },
                {
                    "id": "foo3",
                    "groupId": "specialGroup",
                    "mapType": "WMS",
                    "visibility": true,
                    "name": "Exclusive - Topographic",
                    "url": "http://www.ga.gov.au/gis/services/topography/Australian_Topography_NoAntiAliasing/MapServer/WMSServer",
                    "layers": "Framework Boundaries,Framework Boundaries SS,Roads SS,Roads MS,Roads,State Names on Boundaries,State Names Anno MS,State Names Anno SS,Populated Places,Populated Places MS,Populated Places SS,Cities",
                    "tileType": "large",
                    "attribution": "Geoscience Australia Topography <a target='_blank' href='http://creativecommons.org/licenses/by/3.0/au/deed.en'>CC-By-Au</a>",
                    "opacity": 1.0
                }
            ]
        }
    ],
    //Search configurable endpoints for features
    //typeAheadTemplateUrl allows customisation of the type ahead results, not the right panel results
    //primaryWfsProperty is the value that will display if a single result is selected from the type ahead list
    //TODO panel url for customised result views
    "search": {
        "type": "wfs",
        "typeAheadTemplateUrl": "resources/partial/placeNameSearchResultTemplate.html",
        "primaryWfsProperty": "NameU",
        "endPoints": [
            {
                "id": "placeNameSearch",
                "url": "/gis/services/topography/Gazetteer_of_Australia/MapServer/WFSServer?",
                "featureType": "GazetteerOfAustralia",
                "featurePrefix": "topography_Gazetteer_of_Australia",
                "version": "1.1.0",
                "geometryName": "Shape",
                "featureAttributes": "NameU",
                "visibility": 0,
                "datumProjection": "EPSG:4326",
                "isLonLatOrderValid": false,
                "inputFormat": "geoJSON"
            }
        ]
    }
};