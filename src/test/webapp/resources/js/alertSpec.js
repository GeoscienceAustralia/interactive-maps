/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */
describe(
    'siteCatalogueController tests',
    function () {
        "use strict";
        var $compile, $scope, element, $httpBackend;

        beforeEach(module('testApp'));

        beforeEach(inject(function (_$compile_, _$rootScope_, $injector) {
            $compile = _$compile_;
            $scope = _$rootScope_;

            element = angular
                .element('<div ng-controller="alertCtrl">');

            $compile(element)(_$rootScope_);

            $scope.$digest();
        }));

        it('Should add an alert message', function () {
            $scope.$$childHead.addSuccessAlert("Successfully added alert");
            expect($scope.$$childHead.alerts[0].msg).toEqual("Successfully added alert");
            expect($scope.$$childHead.alerts[0].type).toEqual("success");
        });

        it('Should add an alert message of type info', function () {
            $scope.$$childHead.addInfoAlert("Successfully added info alert");
            expect($scope.$$childHead.alerts[0].msg).toEqual("Successfully added info alert");
            expect($scope.$$childHead.alerts[0].type).toEqual("info");
        });

        it('Should add an alert message of type error', function () {
            $scope.$$childHead.addErrorAlert("Successfully added error alert");
            expect($scope.$$childHead.alerts[0].msg).toEqual("Please contact Client Services at clientservices@ga.gov.au. Successfully added error alert");
            expect($scope.$$childHead.alerts[0].type).toEqual("danger");
        });

        it('Should add an alert message', function () {
            $scope.$$childHead.addSuccessAlert("Successfully added alert");
            expect($scope.$$childHead.alerts[0].msg).toEqual("Successfully added alert");
            expect($scope.$$childHead.alerts[0].type).toEqual("success");
        });
    });