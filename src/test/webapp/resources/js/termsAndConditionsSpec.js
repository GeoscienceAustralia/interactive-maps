/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */

describe('applicationController tests',
    function () {
        var $compile, $scope, element, modalInstance, Ctrl, $controller;

        beforeEach(module('testApp'));

        beforeEach(inject(function (_$compile_, _$rootScope_, _$controller_, $injector, $location) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $compile = _$compile_;
            $scope = _$rootScope_;
            $controller = _$controller_;

            modalInstance = {                    // Create a mock object using spies
                close: jasmine.createSpy('modalInstance.close'),
                dismiss: jasmine.createSpy('modalInstance.dismiss'),
                result: {
                    then: jasmine.createSpy('modalInstance.result.then')
                }
            };
            Ctrl = $controller('termsAndConditionsController', {
                $scope: $scope,
                $modalInstance: modalInstance,
                geoConfig: { "requiresTermsAndConditions": true, "termsAndConditionsUrl": "content/amsis/termsAndConditions.html",
                    "cookieExpirationInDays": 7, "termsAndConditionsCookieName": "amsis"}
            });
        }));

        it('Should close the modal on ok', function () {
            $scope.ok();
            expect(modalInstance.close).toHaveBeenCalled();
            document.cookie = "";
        });

        it('Should close the modal on cancel', function () {
            $scope.cancel();
            expect(modalInstance.close).toHaveBeenCalled();
        });
    });