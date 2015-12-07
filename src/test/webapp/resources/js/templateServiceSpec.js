/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */
describe(
    'geoTemplateService tests',
    function () {
        "use strict";
        var service;

        beforeEach(module('testApp'));

        beforeEach(inject(function (geoTemplateService, $injector) {
            service = geoTemplateService;
        }))

        it('Should return a valid search template', function () {
            var template = service.resolveTemplateById("search");

            var searchTemplate = {
                id: 'FeaturePopup',
                data: {
                    templates: {
                        hover: '<b>${name}</b>',
                        single: '${name}',
                        item: '<li><a href="#" ${showPopup()}>${name}</a></li>'
                    },
                    featureContext: {
                        fid: function (feature) {
                            return feature.id;
                        },
                        name: function (feature) {
                            return feature.data.NAME;
                        }
                    }
                }
            };

            expect(angular.equals(template, searchTemplate)).toBe(true);
        });

        it('Should return a valid template with a dynamic property name', function () {
            var template = service.resolveSingleDynamicPropertyTemplate("search");
            var testPropertyName = 'AMSIS';

            var searchTemplate = {
                id: 'FeaturePopup',
                data: {
                    templates: {
                        hover: '<b>${name}</b>',
                        single: '${name}',
                        item: '<li><a href="#" ${showPopup()}>${name}</a></li>'
                    },
                    featureContext: {
                        fid: function (feature) {
                            return feature.id;
                        },
                        name: function (feature) {
                            return feature.data[testPropertyName];
                        }
                    }
                }
            };

            expect(angular.equals(template, searchTemplate)).toBe(true);
        });
    });