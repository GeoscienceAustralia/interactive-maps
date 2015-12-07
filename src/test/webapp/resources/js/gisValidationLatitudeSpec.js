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
                    '<input type="text" name="latInput" ng-model="model.latInput" gis-latitude-validator="model.latInput"/>' +
                    '</form>');

            $scope.model = { latInput: null }
            $compile(element)(_$rootScope_);

            $scope.$digest();
            form = $scope.form;
        }));

        it('should pass with a valid longitude of 90', function () {
            form.latInput.$setViewValue('90');
            $scope.$digest();
            expect($scope.model.latInput).toEqual('90');
            expect(form.latInput.$valid).toBe(true);
        });

        it('should pass with a valid longitude 0f -90', function () {
            form.latInput.$setViewValue('-90');
            $scope.$digest();
            expect($scope.model.latInput).toEqual('-90');
            expect(form.latInput.$valid).toBe(true);
        });

        it('should fail with an invalid longitude 0f -181', function () {
            form.latInput.$setViewValue('-181');
            $scope.$digest();
            expect($scope.model.latInput).toEqual('-181');
            expect(form.latInput.$valid).toBe(false);
        });

        it('should fail with a character', function () {
            form.latInput.$setViewValue('a');
            $scope.$digest();
            expect(form.latInput.$valid).toBe(false);
        });
    });