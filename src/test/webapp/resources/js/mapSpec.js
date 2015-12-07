/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */

describe('applicationController tests',
    function () {
        'use strict';
        var $compile, $scope, element, $httpBackend, childScope;

        beforeEach(module('testApp'));

        beforeEach(inject(function (_$compile_, _$rootScope_, $injector, $location) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $compile = _$compile_;
            $scope = _$rootScope_;

            element = angular
                .element('<div ng-controller="applicationController">');

            $scope.searchConfig = { "endPoints": [
                {"id": "1"},
                {"id": "2"}
            ]
            };
            $compile(element)(_$rootScope_);
            childScope = $scope.$new();
            $scope.$digest();

        }));

        it('Should call broadcast when onSearchResultSelected is emitted', function () {
            spyOn($scope, '$broadcast').and.callThrough();

            var args = {"endPointId": {"id": "1"}};
            $scope.$$childHead.processSearchResultSelected('onSearchResultSelected', args);

            expect($scope.$broadcast).toHaveBeenCalledWith('searchFeaturesUpdated', [args]);
        });

        it('Should call broadcast when onSearchResultsExecuted is emitted', function () {
            spyOn($scope, '$broadcast').and.callThrough();

            var args = [
                {"endPointId": [
                    {"id": "1"}
                ]}
            ];
            $scope.$$childHead.processSearchResultExecuted('onSearchResultsExecuted', args);

            expect($scope.$broadcast).toHaveBeenCalledWith('searchFeaturesUpdated', args);
        });
    });