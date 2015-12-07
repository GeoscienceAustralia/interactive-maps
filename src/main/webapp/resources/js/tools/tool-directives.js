var angular = angular || {};

var app = angular.module('interactiveMaps.tool-directives',
    [
        'interactiveMaps.tool-services',
        'geowebtoolkit.utils',
        'interactiveMaps.map-services'
    ]);

app.directive('geoToolToggle', ['$timeout', 'toolService', function ($timeout, toolService) {
    "use strict";
    return {
        restrict: "EA",
        template: '<button type="button" ng-click="handleToggle()"><div ng-transclude></div></button> ',
        scope: {
            toggleOnCallback: '&',
            toggleOffCallback: '&',
            toolId: '@',
            toolNamespace: '@',
            controllerEmitEventName: '@',
            onResolveParentToolbar: '&'
        },
        controller: ['$scope', function ($scope) {
            var self = this;
            self.activate = function () {
                $scope.activate();
            };
            self.deactivate = function () {
                $scope.deactivate();
            };
            self.isToggleActive = function () {
                return $scope.isControlActive;
            };
            $scope._toggleCtrl = self;
            $scope.$emit($scope.controllerEmitEventName, self);
        }],
        link: function ($scope) {
            var tool;
            tool = toolService.createSimpleTool($scope.toolId, $scope.toolNamespace, function () {
                return $scope._toggleCtrl;
            }, function () {
                return $scope.isControlActive;
            }, function (toolbarScope, toolbarController) {
                $scope.toolParentScope = toolbarScope;
                $scope.toolParentController = toolbarController;
                $scope.onResolveParentToolbar({toolbarScope: $scope.toolParentScope});
            });
            $scope.isControlActive = false;
            $scope.activate = function () {
                $scope.isControlActive = true;
                $scope.toolParentController.activateToggle(tool);
                $scope.toggleOnCallback();
            };
            $scope.deactivate = function () {
                $scope.isControlActive = false;
                $scope.toolParentController.deactivateToggle(tool);
                $scope.toggleOffCallback();
            };
            $scope.handleToggle = function () {
                if ($scope.isControlActive) {
                    $scope.deactivate();
                } else {
                    $scope.activate();
                }
            };
            $timeout(function () {
                $scope.$emit('registerTool', tool);
            });

        },
        transclude: true,
        replace: true
    };
}]);


/*
 * Wrapper directive to take care of state for toggle on off, and which knows the structure of a tool config
 * @example <pre><code>var tool = {
 *     id: '',
 *     config: {
 *         symbol: 'custom html here'
 *         }
 *         // other config objects, this only uses symbol and id
 *     }
 * }</code></pre>
 * */
app.directive('geoConfigToolToggle', [function () {
    "use strict";
    var templateCache =
        '<geo-tool-toggle toggle-on-callback="localToggleOnCallback()"' +
        'toggle-off-callback="localToggleOffCallback()"' +
        'controller-emit-event-name="{{controllerEmitEventName}}"' +
        'on-resolve-parent-toolbar="onResolveParentToolbar({toolbarScope: toolbarScope})"' +
        'tool-id="{{toolConfig.id}}"' +
        'tool-namespace="{{toolConfig.id}}"' +
        'ng-class="{geoUiToggleOn:toggleOn}"' +
        'class="toolItem toolBarItem">' +
        '<div ng-bind-html="toolConfig.config.symbol | unsafe"></div>' +
        '</geo-tool-toggle>';
    return {
        restrict: 'E',
        template: templateCache,
        scope: {
            toolConfig: '=',
            onToggleOn: '&',
            onToggleOff: '&',
            controllerEmitEventName: '@',
            onResolveParentToolbar: '&'
        },
        controller: ['$scope', function ($scope) {
            $scope.localToggleOnCallback = function () {
                $scope.toggleOn = true;
                $scope.onToggleOn({toolConfig: $scope.toolConfig});
            };

            $scope.localToggleOffCallback = function () {
                $scope.toggleOn = false;
                $scope.onToggleOff({toolConfig: $scope.toolConfig});
            };
        }],
        link: function ($scope, $element, $attrs) {
            //$element.find('#tool_' + $scope.toolConfig.id).html($scope.toolConfig.symbol);
        },
        transclude: false
    };
}]);


/**
 *
 * */
app.directive('geoAddLayerToggle', [function () {
    "use strict";
    return {
        restrict: "EA",
        template: '<button type="button" ng-click="toggleClicked()" ng-class="{geoUiToggleOn: isToggleOn}"><div ng-transclude></div></button> ',
        scope: {
            toggleOnCallback: '&',
            toggleOffCallback: '&',
            controllerEmitEventName: '@',
            mapController: '='
        },
        controller: ['$scope', function ($scope) {
            var self = this;

            self.activate = function () {
                $scope.activate();
            };
            self.deactivate = function () {
                $scope.deactivate();
            };
            self.isToggleActive = function () {
                return $scope.isToggleOn;
            };

            $scope.$emit($scope.controllerEmitEventName, self);
        }],
        link: function ($scope, $element) {
            $scope.isToggleOn = false;

            $scope.activate = function () {
                $scope.isToggleOn = true;
                $scope.toggleOnCallback();
            };
            $scope.deactivate = function () {
                $scope.isToggleOn = false;
                $scope.toggleOffCallback();
            };
            $scope.toggleClicked = function () {
                $scope.isToggleOn = !$scope.isToggleOn;
                if ($scope.isToggleOn) {
                    $scope.activate();
                } else {
                    $scope.deactivate();
                }
            };
        },
        transclude: true,
        replace: true
    };
} ]);

app.directive('geoPlotPointsToggle', [ function () {
    'use strict';
    var templateCache =
        '<button ng-click="toggleClicked()" class="geoUiToggleOff" type="button">' +
        '<div ng-transclude></div>' +
        '</button>';
    return {
        restrict: "E",
        replace: "true",
        template: templateCache,
        transclude: true,
        scope: {
            toggleIconSource: '@',
            controllerEmitEventName: '@',
            toggleOnCallback: '&',
            toggleOffCallback: '&',
            onLayerClickCallback: '&',
            mapController: '=',
            layerInteractionId: '='
        },
        controller: ['$scope', function ($scope) {
            var self = this;

            self.activate = function () {
                $scope.activate();
            };
            self.deactivate = function () {
                $scope.deactivate();
            };
            self.isToggleActive = function () {
                return $scope.isToggleOn;
            };

            $scope.$emit($scope.controllerEmitEventName, self);
        }],
        link: function ($scope, $element) {
            $scope.isToggleOn = false;

            $scope.activate = function () {
                $scope.mapController.registerMapClick(callback);
                $element.removeClass('geoUiToggleOff');
                $element.addClass('geoUiToggleOn');
                $scope.isToggleOn = true;
                $scope.toggleOnCallback();

            };
            $scope.deactivate = function () {
                $scope.mapController.unRegisterMapClick(callback);
                $element.removeClass('geoUiToggleOn');
                $element.addClass('geoUiToggleOff');
                $scope.isToggleOn = false;
                $scope.toggleOffCallback();
            };
            $scope.toggleClicked = function () {
                $scope.isToggleOn = !$scope.isToggleOn;
                if ($scope.isToggleOn) {
                    $scope.activate();
                } else {
                    $scope.deactivate();
                }
            };

            var callback = function (e) {
                var xyPoint = $scope.mapController.getPointFromEvent(e);
                $scope.onLayerClickCallback({
                    point: xyPoint,
                    interactionId: $scope.layerInteractionId
                });
            };
        }
    };
} ]);


app.directive('geoDrawToggle', [ function () {
    'use strict';
    var templateCache =
        '<button ng-click="toggleClicked()" class="geoUiToggleOff" type="button">' +
        '<div ng-transclude></div>' +
        '</button>';
    return {
        restrict: "E",
        replace: "true",
        template: templateCache,
        transclude: true,
        scope: {
            toggleIconSource: '@',
            controllerEmitEventName: '@',
            toggleOnCallback: '&',
            toggleOffCallback: '&',
            onLayerClickCallback: '&',
            mapController: '=',
            layerInteractionId: '='
        },
        controller: ['$scope', function ($scope) {
            var self = this;

            self.activate = function () {
                $scope.activate();
            };
            self.deactivate = function () {
                $scope.deactivate();
            };
            self.isToggleActive = function () {
                return $scope.isToggleOn;
            };

            $scope.$emit($scope.controllerEmitEventName, self);
        }],
        link: function ($scope, $element) {
            $scope.isToggleOn = false;

            $scope.activate = function () {
                $scope.mapController.registerMapClick(callback);
                $element.removeClass('geoUiToggleOff');
                $element.addClass('geoUiToggleOn');
                $scope.isToggleOn = true;
                $scope.toggleOnCallback();

            };
            $scope.deactivate = function () {
                $scope.mapController.unRegisterMapClick(callback);
                $element.removeClass('geoUiToggleOn');
                $element.addClass('geoUiToggleOff');
                $scope.isToggleOn = false;
                $scope.toggleOffCallback();
            };
            $scope.toggleClicked = function () {
                $scope.isToggleOn = !$scope.isToggleOn;
                if ($scope.isToggleOn) {
                    $scope.activate();
                } else {
                    $scope.deactivate();
                }
            };

            var callback = function (e) {
                var xyPoint = $scope.mapController.getPointFromEvent(e);
                $scope.onLayerClickCallback({
                    point: xyPoint,
                    interactionId: $scope.layerInteractionId
                });
            };
        }
    };
} ]);