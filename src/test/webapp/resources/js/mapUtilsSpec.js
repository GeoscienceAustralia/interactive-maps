/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */
describe(
    'interactiveMapsUtils tests',
    function () {
        "use strict";
        var service;

        beforeEach(module('testApp'));

        beforeEach(inject(function (interactiveMapsUtils, $injector) {
            service = interactiveMapsUtils;
        }))

        it('Should convert a table to an array', function () {
            var numbers = ["1", "2", "3"];
            var output = service.arrayToTable(numbers, 1);

            expect(output.length === 3).toBe(true);
            var testObj = {columns: ['1']};
            expect(output[0]).toEqual(testObj);
        });
    });