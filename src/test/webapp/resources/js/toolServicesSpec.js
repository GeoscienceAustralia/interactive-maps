/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */
describe(
    'tool-services tests',
    function () {
        "use strict";
        var service;

        beforeEach(module('testApp'));

        beforeEach(inject(function (toolService, $injector) {
            service = toolService;
        }));
    });