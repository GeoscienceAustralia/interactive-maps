/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */

describe('gisValidation tests',
    function () {
        var $compile, scope, form, elm, control, changeInputValue;

        beforeEach(module('testApp'));

        beforeEach(inject(function (_$compile_, _$rootScope_, $injector, $sniffer) {
            $compile = _$compile_;
            $scope = _$rootScope_;

            element = angular.element(
                    '<form name="form">' +
                    '<input type="text" name="lonInput" ng-model="model.lonInput" gis-longitude-validator="model.lonInput"/>' +
                    '</form>');

            $scope.model = { lonInput: null }
            $compile(element)(_$rootScope_);

            $scope.$digest();
            form = $scope.form;
        }));

        it('should pass with a valid longitude of 180', function () {
            form.lonInput.$setViewValue('180');
            $scope.$digest();
            expect($scope.model.lonInput).toEqual('180');
            expect(form.lonInput.$valid).toBe(true);
        });

        it('should pass with a valid longitude 0f -180', function () {
            form.lonInput.$setViewValue('-180');
            $scope.$digest();
            expect($scope.model.lonInput).toEqual('-180');
            expect(form.lonInput.$valid).toBe(true);
        });

        it('should fail with an invalid longitude 0f -181', function () {
            form.lonInput.$setViewValue('-181');
            $scope.$digest();
            expect($scope.model.lonInput).toEqual('-181');
            expect(form.lonInput.$valid).toBe(false);
        });

        it('should fail with a character', function () {
            form.lonInput.$setViewValue('a');
            $scope.$digest();
            expect(form.lonInput.$valid).toBe(false);
        });
    });