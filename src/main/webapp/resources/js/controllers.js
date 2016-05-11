var angular = angular || {};
var console = console || {};
var $ = $ || {};

var app = angular.module('interactiveMaps.controllers', [ 'interactiveMaps.services', 'interactiveMaps.map-services' ]);

/* Application controller is the parent controller to all controlls, much like a $rootScope.
 * This is used instead of a rootscope due to how rootscope interacts with the creation of new scopes
 * The rootscope is used as a constructor for new scopes, ie, anything added to rootscope is added to
 * the newly constructed scope of another controller which can lead to issues and performance problems */
app.controller('applicationController', ['$scope', '$http', '$rootScope', '$routeParams', '$timeout', 'olv2MapControls', '$location', 'MasterLayersService', '$q',
    function ($scope, $http, $rootScope, $routeParams, $timeout, olv2MapControls, $location, MasterLayersService, $q) {
        'use strict';
        //Registration of a custom OLV2 control due to handling group layers and restoring selected group layers
        olv2MapControls.registerControl('interactivemapspermalink', OpenLayers.Control.InteractiveMapsPermalink);

        //Due to structure of some HTML parent/child relationship, rebroadcast layerAdded event to all child controllers
        $rootScope.$on('layerAdded', function (event, args) {
            $scope.$broadcast('layerAdded', args);
        });
        //Due to structure of some HTML parent/child relationship, rebroadcast mapControllerReady event to all child controllers
        $rootScope.$on('mapControllerReady', function (event, args) {
            $scope.$broadcast('mapControllerReady', args);
        });

        //Configurable footer and header update events replicated to specific events
        $scope.$on('configDataLoaded', function (event, config) {
            $scope.mapPrintTitle = config.title;
            $scope.$broadcast('headerUpdated', config.headerConfig);
            $scope.$broadcast('footerUpdated', config.footerConfig);
            if (config.search != null) {
                $scope.$broadcast('searchUpdated', config.search);
                $scope.searchConfig = config.search;
            } else {
                $scope.$broadcast('searchUpdated', null);
            }
            $scope.$broadcast('mapConfigUpdated', config);
        });

        //Due to structure of some HTML parent/child relationship, rebroadcast mapResetFired event to all child controllers
        $rootScope.$on('mapResetFired', function () {
            $scope.$broadcast('mapResetFired', null);
        });

        $scope.refreshClicked = function () {
            $scope.$broadcast('mapRefreshFired', null);
        };

        // Get the permalink URL for the control div
        $scope.sharePermalink = function () {
            var permaLink = '';

            if ($('.olControlPermalink').find('a').length > 0) {
                permaLink = $('.olControlPermalink').find('a')[0].href;
            } else {
                permaLink = $location.$$absUrl;
            }

            // Escape characters for facebook and twitter
            permaLink = permaLink.replace(new RegExp('&', 'g'), '%26');
            $scope.permalink = permaLink.replace(new RegExp('#', 'g'), '%23');
        };

        //No longer used?
        //$scope.currentPage = "default";

        $scope.$on('$routeChangeStart', function (event, currentRoute, prevRoute) {
            if (currentRoute && currentRoute.params && currentRoute.params.reload) {
                $location.path($location.path().replace('/r/reload/theme', '/theme'));
                $location.replace();
            }
        });

        $scope.$on('$locationChangeStart', function (event, newPath, oldPath) {
            if (newPath.indexOf('#/r/reload') > -1) {
                event.preventDefault();
                window.location.href = newPath.replace('/r/reload/theme', '/theme');
                window.location.reload();
            }
        });

        var getRequiredServerResources = function () {
            var deferred = $q.defer();
            var promises = [];
            if ($routeParams.mapId == null && $routeParams.themeId == null) {
                //Hide search
                $scope.$broadcast('searchUpdated', null);
            }

            // Set parameter isMap so we know when we are on a map


            // Set parameter isTheme so we know when we are on a theme
            $scope.isTheme = $routeParams.themeId != null;
            $q.all(promises).then(function () {
                deferred.resolve();
            });
            return deferred.promise;
        };
        //On change of route, ensure search in correct state and help routes work with local anchor links
        $scope.$on('$routeChangeSuccess', function () {
            $('geo-search-wfs').find('input[type="text"]').val('');
            getRequiredServerResources();
            $scope.isMap = !!($routeParams.mapId !== null && $routeParams.mapId !== undefined);

            if ($routeParams.scrollTo != null) {
                //HACK, timeout 100 used due to possible delay in help rendering for slow clients
                $timeout(function () {
                    $('#' + $routeParams.scrollTo)[0].scrollIntoView(true);
                }, 100);
            }
        });

        //Initialise controllers object, the container of various UI controllers
        $scope.controllers = {};
        //Add toolbar controller to the controller object
        $scope.$on('toolbarController', function (event, args) {
            $scope.controllers.toolbarController = args;
        });

        //Clear search results, update search with an event containing empty array so
        //Any ng-repeats on search results will not display
        $scope.$on('clearSearchFeatures', function () {
            $scope.$broadcast('searchFeaturesUpdated', []);
        });

        // Fired for a search result with a single feature
        $scope.processSearchResultSelected = function (event, args) {
            var endPointConfig;
            var features = [];
            if ($scope.searchConfig.endPoints != null) {
                for (var i = 0; i < $scope.searchConfig.endPoints.length; i++) {
                    if ($scope.searchConfig.endPoints[i].id === args.endPointId) {
                        endPointConfig = $scope.searchConfig.endPoints[i];
                        break;
                    }
                }
            }
            if (endPointConfig != null) {
                args.isLonLatOrderValid = endPointConfig.isLonLatOrderValid;
            }

            features.push(args);
            $scope.$broadcast('searchFeaturesUpdated', features);
        }

        $scope.$on('onSearchResultSelected', $scope.processSearchResultSelected);

        // Fired for a search result with multiple features
        $scope.processSearchResultExecuted = function (event, args) {
            var endPointConfig;
            var features = [];

            for (var i = 0; i < args.length; i++) {
                if ($scope.searchConfig.endPoints != null) {
                    for (var j = 0; j < $scope.searchConfig.endPoints.length; j++) {
                        if ($scope.searchConfig.endPoints[j].id === args[i].endPointId) {
                            endPointConfig = $scope.searchConfig.endPoints[j];
                            break;
                        }
                    }
                }
                if (endPointConfig != null) {
                    features.isLonLatOrderValid = endPointConfig.isLonLatOrderValid;
                }
                features.push(args[i]);
            }
            $scope.$broadcast('searchFeaturesUpdated', features);
        }

        $scope.$on('onSearchResultsExecuted', $scope.processSearchResultExecuted);

        //Update interrogate map-layer with features coming from an interrogate tool
        $scope.$on('interrogateFeatureAdded', function (event, args) {
            $scope.$broadcast('interrogateFeaturesUpdated', [args]);
        });

        //Clear interrogate map-layer
        $scope.$on('interrogateFeaturesCleared', function () {
            $scope.$broadcast('interrogateFeaturesUpdated', []);
        });
    } ]);

/* Controller for configurable header
 * Mainly controls breadcrumbs and search*/
app.controller('headerController', [ '$scope', '$routeParams', '$q', '$timeout', '$location',
    function ($scope, $routeParams, $q, $timeout, $location) {
        'use strict';
        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name +
                "=([^&#]*)"), results = regex.exec(document.URL);

            return results == null ?
                "" :
                decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        //Check for permalink related querystring values and remove any querystring values from route if present
        function checkPositionQueryStrings() {
            var zoomValue = getParameterByName('zoom');
            if (zoomValue !== '') {
                var absoluteUrl = $location.absUrl();
                var applicationPath = absoluteUrl.split('?')[0];
                var finalPath = applicationPath + '#' + $location.path();
                window.location.replace(finalPath);
            }
        }

        //Previous used when header config had more things to configure.
        //Deprecated
        var modifyConfigSource = function (headerConfig) {
//		headerConfig.headerBackgroundImageStyle = {
//			'background-image': 'url(' + headerConfig.backgroundImageUrl + ')'
//		};
            return headerConfig;
        };

        //When the route changes, modify mapName and themeName to build breadcrumbs
        function updateHeader() {
            $scope.themeId = $routeParams.themeId;
            $scope.mapId = $routeParams.mapId;
            if ($routeParams.themeId != null) {
                $scope.themeName = getThemeAlias($routeParams.themeId);
            } else {
                $scope.themeName = null;
            }

            if ($routeParams.mapId == null) {
                $scope.mapName = null;
                checkPositionQueryStrings();
            }

            //route change back to home page
            if ($routeParams.mapId == null && $routeParams.themeId == null) {
                if ($scope.siteConfig != null) {
                    $scope.headerConfig = $scope.siteConfig.headerConfig;
                }
            }
        }

        $scope.$on('$routeChangeSuccess', function () {
            updateHeader();
        });

        //Update mapName on the update/change of a config
        $scope.$on('mapConfigUpdated', function (event, args) {
            if ($routeParams.mapId != null) {
                $scope.mapName = args.title;
            }
        });

        //Update themeName on the update/change of a config
        $scope.$on('configDataLoaded', function (event, args) {
            if ($routeParams.themeId != null) {
                //Wait for digest
                $timeout(function () {
                    $scope.themeName = getThemeAlias($routeParams.themeId);
                });
            }
        });

        //Used for breadcrumbs, get user-friendly theme name alias by themeId
        function getThemeAlias(themeId) {
            var result;
            if ($scope.themes == null) {
                return result;
            }
            for (var i = 0; i < $scope.themes.length; i++) {
                var theme = $scope.themes[i];
                if (theme.id === themeId) {
                    result = theme.title;
                    break;
                }
            }
            return result;
        }

        $scope.$on('headerUpdated', function (event, args) {
            $scope.headerConfig = modifyConfigSource(args);
        });
    } ]);


app.controller('footerController', [ '$scope', function ($scope) {
    'use strict';
    $scope.$on('footerUpdated', function (event, args) {
        //TODO update scope for footer
    });
} ]);