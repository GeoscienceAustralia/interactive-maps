var angular = angular || {};
var console = console || {};
var $ = $ || {};

var app = angular.module('interactiveMaps.configCreator.mapPreview', [ 'interactiveMaps.services' ]);

app.controller('configCreatorController', ['$scope', '$log', '$timeout', '$http', 'GeoMapService', 'configCreatorService', '$localStorage', '$routeParams', '$location', 'MasterLayersService',
    function ($scope, $log, $timeout, $http, GeoMapService, configCreatorService, $localStorage, $routeParams, $location, MasterLayersService) {
        "use strict";
        $scope.$emit('configDataLoaded', {headerConfig: {title: 'Config Creator (Beta)'}});
        MasterLayersService.initMasterLists();
        if ($routeParams.themeId && $routeParams.mapId) {
            //Load existing map config
            $http.get('api/config/' + $routeParams.themeId + '/maps/' + $routeParams.mapId + '.json').success(function (response) {
                $timeout(function () {
                    $scope.config = response;
                    $scope.config.layerMaps = MasterLayersService.loadFromMasterLayerList($scope.config.layerMaps);
                    $scope.config.baseMaps = MasterLayersService.loadFromMasterLayerList($scope.config.baseMaps);
                    $scope.config.toolsConfig.tools = MasterLayersService.loadFromMasterToolList($scope.config.toolsConfig.tools);
                    $scope.modelChanged();
                });
            });
        }

        $scope.$on('$routeUpdate', function (event, routeData) {
            if (routeData.params.accordionName) {
                initAccordionNames();
            }
        });

        function initAccordionNames() {
            $scope.accordions = {
                mapDetailsIsOpen: $routeParams.accordionName ? $routeParams.accordionName == 'details' : true,
                navigationIsOpen: $routeParams.accordionName ? $routeParams.accordionName == 'nav' : false,
                toolsIsOpen: $routeParams.accordionName ? $routeParams.accordionName == 'tools' : false,
                baseLayersIsOpen: $routeParams.accordionName ? $routeParams.accordionName == 'baselayers' : false,
                mapLayersIsOpen: $routeParams.accordionName ? $routeParams.accordionName == 'maplayers' : false,
                mapConfigIsOpen: $routeParams.accordionName ? $routeParams.accordionName == 'config' : false
            };
        }

        $scope.initConfig = function () {
            $scope.previewButtonText = "Preview";
            $scope.config = {};
            $scope.config.baseMaps = [];
            $scope.config.layerMaps = [];
            $scope.baseLayerConfig = {};
            $scope.config.centerPosition = {};
            $scope.layerMap = {};
            $scope.configPreviewReady = false;
            $scope.configPreview = {};
            $scope.configPreview.val = '';
            initAccordionNames();
            $scope.isFullScreen = false;
            $scope.config.initialExtent = [
                [0, 0],
                [0, 0]
            ];
            $scope.config.framework = $scope.config.framework || 'olv2';
        };

        $scope.$watch('accordions.mapConfigIsOpen', function (newVal, oldVal) {
            if (newVal === true) {
                $location.search('accordionName', 'config');
                $scope.$broadcast('mapConfigOpen', null);
            } else {
                $scope.$broadcast('mapConfigClosed', null);
            }
        });

        $scope.$watch('accordions.mapDetailsIsOpen', function (newVal, oldVal) {
            if (newVal === true) {
                $location.search('accordionName', 'details');
                $scope.$broadcast('mapDetailsOpen', null);
            } else {
                $scope.$broadcast('mapDetailsClosed', null);
            }
        });

        $scope.$watch('accordions.navigationIsOpen', function (newVal, oldVal) {
            if (newVal === true) {
                $location.search('accordionName', 'nav');
                $scope.$broadcast('navigationOpen', null);
            } else {
                $scope.$broadcast('navigationClosed', null);
            }
        });

        $scope.$watch('accordions.baseLayersIsOpen', function (newVal, oldVal) {
            if (newVal === true) {
                $location.search('accordionName', 'baselayers');
                $scope.$broadcast('baseLayersOpen', null);
            } else {
                $scope.$broadcast('baseLayersClosed', null);
            }
        });

        $scope.$watch('accordions.mapLayersIsOpen', function (newVal, oldVal) {
            if (newVal === true) {
                $location.search('accordionName', 'maplayers');
                $scope.$broadcast('mapLayersOpen', null);
            } else {
                $scope.$broadcast('mapLayersClosed', null);
            }
        });

        $scope.$watch('accordions.toolsIsOpen', function (newVal, oldVal) {
            if (newVal === true) {
                $location.search('accordionName', 'tools');
                $scope.$broadcast('toolsOpen', null);
            } else {
                $scope.$broadcast('toolsClosed', null);
            }
        });

        $scope.$on('resetAccordionFields', function (accordionName) {
            console.log(accordionName);
            switch (accordionName) {
                case 'mapLayers':
                    $scope.clearMapLayerFields();
                    break;
            }
        });

        $scope.clearMapLayerFields = function () {

        };

        window.onbeforeunload = function (event) {
            event.returnValue = "Export your JSON file otherwise your changes will be lost";
        };

        $scope.$on('$locationChangeStart', function (event, args) {
            if (args.indexOf('#/configCreator') === -1) {
                var answer = window.confirm("Are you sure you want to leave this page?");
                if (!answer) {
                    event.preventDefault();
                }
            }
        });

        $scope.applyDefaultValues = function () {
            if (!$scope.config) {
                $log.error('No config set!');
                return;
            }
            $scope.config.datumProjection =
                ($scope.config.datumProjection == null || $scope.config.datumProjection === '') ?
                    "EPSG:3857" : $scope.config.datumProjection;
            $scope.config.displayProjection =
                ($scope.config.displayProjection == null || $scope.config.displayProjection === '') ?
                    "EPSG:4326" : $scope.config.displayProjection;
            $scope.config.baseMaps = $scope.config.baseMaps || [];
            $scope.config.layerMaps = $scope.config.layerMaps || [];
        };

        $scope.initConfig();

        $scope.updateConfig = function (config) {
            $timeout(function () {
                $scope.config = config;
                $scope.modelChanged();
            });
        };

        $scope.updateLayers = function (layers) {
            $timeout(function () {
                $scope.config.layerMaps = layers;
                $scope.modelChanged();
            });
        };

        $scope.buttonText = "Show Full Screen";

        window.addEventListener('message', function (event) {
            var mapFrame = document.getElementById('mapFrame');
            if (event.data === 'mapControllerReady') {
                $scope.mapController = mapFrame.contentWindow.mapController;
            }
        });

        $http.get('resources/js/configCreator/commonBaseLayers.json').success(function (response) {
            $scope.commonBaseLayers = response.baseLayers;
        });

        $http.get('api/config/master-layer-list.json').success(function (response) {
            $scope.layerCriteria = response.layers;
        });

        $http.get('resources/js/configCreator/commonTools.json').success(function (response) {
            $scope.commonTools = response.configTools;
            $scope.commonTools.aboutConfig = response.aboutConfig;
            $scope.commonTools.layersConfig = response.layersConfig;
            $scope.commonTools.baseLayersConfig = response.baseLayersConfig;
            $scope.commonTools.legendConfig = response.legendConfig;
            $scope.commonTools.requiresTermsAndConditions = response.requiresTermsAndConditions;
            $scope.commonTools.termsAndConditionsText = response.termsAndConditionsText;
            $scope.commonTools.cookieExpirationInDays = response.cookieExpirationInDays;
        });

        $scope.modelChanged = function () {
            if ($scope.config) {
                $scope.applyDefaultValues();
                $scope.configPreview.val = JSON.stringify($scope.config, null, "\t");
            }
        };

        $scope.onSelected = function (item) { /* item, model, label */
            $scope.layerMap = angular.copy(item);
        };

        $scope.$watch('configPreview.val', function () {
            if ($scope.configPreview.val) {
                if ($scope.configPreview.val !== JSON.stringify($scope.config,null, "\t")) {
                    $scope.config = angular.fromJson($scope.configPreview.val,true);
                    //$scope.configCreatorService.updateJSONConfigOutput();
                    configCreatorService.updateJSONConfigOutput();
                }
            }
            else {
                $scope.initConfig();
            }
        });

        $scope.hasMinimumConfigValues = function () {
            return $scope.config.baseMaps !== null && $scope.config.baseMaps.length > 0;
        };


        $scope.showMapLayerSearch = function () {

        };

        $scope.isPreconfiguredBaseLayer = function () {
            return $scope.baseLayerConfig && $scope.baseLayerConfig.mapType && !window.isNaN($scope.baseLayerConfig.mapType);
        };

        $scope.showCustomBaseLayerOptions = function () {
            if (!$scope.baseLayerConfig || !$scope.baseLayerConfig.mapType) {
                return false;
            }
            return window.isNaN($scope.baseLayerConfig.mapType);
        };

        $scope.addLayerMap = function (layerMap) {
            $scope.config.layerMaps.push(angular.copy(layerMap));
            $scope.modelChanged();
            $scope.previewMap();
        };

        $scope.removeLayerMap = function (index) {
            $scope.config.layerMaps.splice(index, 1);
            $scope.modelChanged();
        };

        $scope.updateLayerConfig = function () {
            $scope.config.layerMaps[$scope.currentLayerMapEditIndex] = $scope.layerMap;
        };

        $scope.refreshing = false;
        $scope.previewMap = function () {
            if (!$scope.configPreview.val) {
                $scope.config.baseMaps.push(angular.copy($scope.commonBaseLayers[0]));
                $scope.modelChanged();
            }
            if ($scope.refreshing) {
                return;
            }

            if (!$scope.hasMinimumConfigValues()) {
                return;
            }

            window.localStorage.setItem('configCreatorMap', JSON.stringify($scope.config));

            $scope.refreshing = true;
            $scope.configPreviewReady = false;

            $timeout(function () {
                $scope.configPreviewReady = true;
                $scope.refreshing = false;
                $scope.previewButtonText = "Update";
            });

        };

        $scope.showFullScreen = function () {
            if ($scope.isFullScreen === false) {
                $scope.isFullScreen = true;
                $scope.buttonText = "Hide Full Screen";
                console.log($scope);
                $timeout(function () {
                    GeoMapService.mapResized($scope.mapController.getMapInstance(), $scope.config.framework || 'olv2');
                });
            } else {
                $scope.isFullScreen = false;
                $scope.buttonText = "Show Full Screen";
            }
        };
    }]);