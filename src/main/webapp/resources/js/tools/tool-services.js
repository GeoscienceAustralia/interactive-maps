var angular = angular || {};

var app = angular.module('interactiveMaps.tool-services', []);

app.factory('toolService', [ function () {
    "use strict";

    return {
        /*This function creates the basic structure of a 'tool' for interactiveMaps.
         * Once a tool is created it is registered with toolbarController via registerTool event.
         * Easiest use of tools is to use the geoToolToggle directive for the most control or geoConfigToolToggle
         * for simplest use.*/
        createSimpleTool: function (id, namespace, resolveToggleController, resolveIsActive, registeredCallback) {
            var controller = resolveToggleController();
            var activeResolve = resolveIsActive;
            var regCallback = registeredCallback;
            return {
                id: id,
                toggleActivate: function () {
                    controller.activate();
                },
                toggleDeactivate: function () {
                    controller.deactivate();
                },
                postDeactivate: function () {

                },
                postActivate: function () {

                },
                preDeactivate: function () {

                },
                preActivate: function () {

                },
                isActive: function () {
                    return activeResolve();
                },
                getNamespace: function () {
                    return namespace;
                },
                toolRegistered: function (toolbarScope, toolbarController) {
                    regCallback(toolbarScope, toolbarController);
                }
            };
        }
    };
} ]);