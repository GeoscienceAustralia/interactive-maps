/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */

describe('gisValidation tests',
    function () {
//        var $compile, scope, form,  elm, control, changeInputValue;
//
//        beforeEach(module('testApp'));
//
//        beforeEach(inject(function (_$compile_, _$rootScope_, $injector, $sniffer) {
//            $compile = _$compile_;
//            $scope = _$rootScope_;
//
//            element = angular.element(
//                '<form name="form">' +
//                    '<div gis-longitude-dms-validator lon-degrees-input="model.lonDegreesInput" lon-minutes-input="model.lonMinutesInput" lon-seconds-input="model.lonSecondsInput">' +
//                        '<input type="text" name="lonDegreesInput" ng-model="model.lonDegreesInput" gis-longitude-dms-validator />' +
//                        '<input type="text" name="lonMinutesInput" ng-model="model.lonMinutesInput" gis-longitude-dms-validator />' +
//                        '<input type="text" name="lonSecondsInput" ng-model="model.lonSecondsInput" gis-longitude-dms-validator />' +
//                   '</div>' +
//                '</form>');
//
//
//            $scope.model = { lonInput: null }
//            $compile(element)(_$rootScope_);
//
//            $scope.$digest();
//            form = $scope.form;
//        }));
//
//        it('should pass with a valid longitude of 180 0 0', function () {
//            form.lonDegreesInput.$setViewValue('180');
//            form.lonMinutesInput.$setViewValue('0');
//            form.lonSecondsInput.$setViewValue('0');
//            $scope.$digest();
//            expect($scope.model.lonDegreesInput).toEqual('180');
//            expect($scope.model.lonMinutesInput).toEqual('0');
//            expect($scope.model.lonSecondsInput).toEqual('0');
//            expect(form.lonDegreesInput.$valid).toBe(true);
//        });
//
//        it('should pass with a valid longitude of -180 0 0', function () {
//            form.lonDegreesInput.$setViewValue('-180');
//            form.lonMinutesInput.$setViewValue('0');
//            form.lonSecondsInput.$setViewValue('0');
//            $scope.$digest();
//            expect($scope.model.lonDegreesInput).toEqual('-180');
//            expect($scope.model.lonMinutesInput).toEqual('0');
//            expect($scope.model.lonSecondsInput).toEqual('0');
//            expect(form.lonDegreesInput.$valid).toBe(true);
//        });
//
//        it('should pass with a valid longitude of 115 1 12', function () {
//            form.lonDegreesInput.$setViewValue('115');
//            form.lonMinutesInput.$setViewValue('1');
//            form.lonSecondsInput.$setViewValue('12');
//            $scope.$digest();
//            expect($scope.model.lonDegreesInput).toEqual('115');
//            expect($scope.model.lonMinutesInput).toEqual('1');
//            expect($scope.model.lonSecondsInput).toEqual('12');
//            expect(form.lonDegreesInput.$valid).toBe(true);
//        });
//
//        it('should pass with a valid longitude of 115 1 12', function () {
//            form.lonDegreesInput.$setViewValue('115');
//            form.lonMinutesInput.$setViewValue('1');
//            form.lonSecondsInput.$setViewValue('12');
//            $scope.$digest();
//            expect($scope.model.lonDegreesInput).toEqual('115');
//            expect($scope.model.lonMinutesInput).toEqual('1');
//            expect($scope.model.lonSecondsInput).toEqual('12');
//            expect(form.lonDegreesInput.$valid).toBe(true);
//        });
//
//        it('should pass with a invalid longitude degrees of a 1 12', function () {
//            form.lonDegreesInput.$setViewValue('a');
//            form.lonMinutesInput.$setViewValue('1');
//            form.lonSecondsInput.$setViewValue('12');
//            $scope.$digest();
//            expect($scope.model.lonDegreesInput).toEqual('a');
//            expect($scope.model.lonMinutesInput).toEqual('1');
//            expect($scope.model.lonSecondsInput).toEqual('12');
//            expect(form.lonDegreesInput.$valid).toBe(false);
//        });
//
//        it('should pass with a invalid longitude minutes of 115 a 12', function () {
//            form.lonDegreesInput.$setViewValue('115');
//            form.lonMinutesInput.$setViewValue('a');
//            form.lonSecondsInput.$setViewValue('12');
//            $scope.$digest();
//            expect($scope.model.lonDegreesInput).toEqual('115');
//            expect($scope.model.lonMinutesInput).toEqual('a');
//            expect($scope.model.lonSecondsInput).toEqual('12');
//            expect(form.lonMinutesInput.$valid).toBe(false);
//        });
//
//        it('should pass with a invalid longitude seconds of 115 1 a', function () {
//            form.lonDegreesInput.$setViewValue('115');
//            form.lonMinutesInput.$setViewValue('1');
//            form.lonSecondsInput.$setViewValue('a');
//            $scope.$digest();
//            expect($scope.model.lonDegreesInput).toEqual('115');
//            expect($scope.model.lonMinutesInput).toEqual('1');
//            expect($scope.model.lonSecondsInput).toEqual('a');
//            expect(form.lonSecondsInput.$valid).toBe(false);
//        });
    });