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
//                    '<div gis-latitude-dms-validator lat-degrees-input="model.latDegreesInput" lat-minutes-input="model.latMinutesInput" lat-seconds-input="model.latSecondsInput">' +
//                        '<input type="text" name="latDegreesInput" ng-model="model.latDegreesInput" gis-latitude-dms-validator />' +
//                        '<input type="text" name="latMinutesInput" ng-model="model.latMinutesInput" gis-latitude-dms-validator />' +
//                        '<input type="text" name="latSecondsInput" ng-model="model.latSecondsInput" gis-latitude-dms-validator />' +
//                   '</div>' +
//                '</form>');
//
//
//            $scope.model = { latInput: null }
//            $compile(element)(_$rootScope_);
//
//            $scope.$digest();
//            form = $scope.form;
//        }));
//
//        it('should pass with a valid latitude of 90 0 0', function () {
//            form.latDegreesInput.$setViewValue('90');
//            form.latMinutesInput.$setViewValue('0');
//            form.latSecondsInput.$setViewValue('0');
//            $scope.$digest();
//            angular.element('latMinutesInput').controller('ngModel').$render();
//            expect($scope.model.latDegreesInput).toEqual('90');
//            expect($scope.model.latMinutesInput).toEqual('0');
//            expect($scope.model.latSecondsInput).toEqual('0');
//            expect(form.latDegreesInput.$valid).toBe(true);
//        });
//
//        it('should pass with a valid latitude of -90 0 0', function () {
//            form.latDegreesInput.$setViewValue('-90');
//            form.latMinutesInput.$setViewValue('0');
//            form.latSecondsInput.$setViewValue('0');
//            $scope.$digest();
//            expect($scope.model.latDegreesInput).toEqual('-90');
//            expect($scope.model.latMinutesInput).toEqual('0');
//            expect($scope.model.latSecondsInput).toEqual('0');
//            expect(form.latDegreesInput.$valid).toBe(true);
//        });
//
//        it('should pass with a valid latitude of 26 56 35', function () {
//            form.latDegreesInput.$setViewValue('26');
//            form.latMinutesInput.$setViewValue('56');
//            form.latSecondsInput.$setViewValue('35');
//            $scope.$digest();
//            expect($scope.model.latDegreesInput).toEqual('26');
//            expect($scope.model.latMinutesInput).toEqual('56');
//            expect($scope.model.latSecondsInput).toEqual('35');
//            expect(form.latDegreesInput.$valid).toBe(true);
//        });
//
//
//        it('should pass with a invalid latitude degrees of a 1 12', function () {
//            form.latDegreesInput.$setViewValue('a');
//            form.latMinutesInput.$setViewValue('1');
//            form.latSecondsInput.$setViewValue('12');
//            $scope.$digest();
//            expect($scope.model.latDegreesInput).toEqual('a');
//            expect($scope.model.latMinutesInput).toEqual('1');
//            expect($scope.model.latSecondsInput).toEqual('12');
//            expect(form.latDegreesInput.$valid).toBe(false);
//        });
//
//        it('should pass with a invalid latitude minutes of 115 a 12', function () {
//            form.latDegreesInput.$setViewValue('115');
//            form.latMinutesInput.$setViewValue('a');
//            form.latSecondsInput.$setViewValue('12');
//            $scope.$digest();
//            expect($scope.model.latDegreesInput).toEqual('115');
//            expect($scope.model.latMinutesInput).toEqual('a');
//            expect($scope.model.latSecondsInput).toEqual('12');
//            expect(form.latMinutesInput.$valid).toBe(false);
//        });
//
//        it('should pass with a invalid latitude seconds of 115 1 a', function () {
//            form.latDegreesInput.$setViewValue('115');
//            form.latMinutesInput.$setViewValue('1');
//            form.latSecondsInput.$setViewValue('a');
//            $scope.$digest();
//            expect($scope.model.latDegreesInput).toEqual('115');
//            expect($scope.model.latMinutesInput).toEqual('1');
//            expect($scope.model.latSecondsInput).toEqual('a');
//            expect(form.latSecondsInput.$valid).toBe(false);
//        });
    });