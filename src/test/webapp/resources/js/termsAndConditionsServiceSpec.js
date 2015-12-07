/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */
describe(
    'interactiveMapsTermsAndConditions service tests',
    function () {
        "use strict";
        var interactiveMapsTermsAndConditions, service;

        beforeEach(module('testApp'));

        beforeEach(inject(function (interactiveMapsTermsAndConditions, $injector) {
            service = interactiveMapsTermsAndConditions;

            // http://stackoverflow.com/a/179514
            function deleteAllCookies() {
                var cookies = document.cookie.split(";");

                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    var eqPos = cookie.indexOf("=");
                    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            }

            deleteAllCookies();
        }));

        it('Should fail because user does hot nave a cookie', function () {
            expect(service.userHasValidTermsAndConditionsCookie({termsAndConditionsCookieName: "test"})).toBe(false);
        });

        it('Should pass as we set a new cookie', function () {
            service.setCookie({termsAndConditionsCookieName: "test", id: "ga", cookieExpirationInDays: "1"});
            expect(service.userHasValidTermsAndConditionsCookie({termsAndConditionsCookieName: "test"})).toBe(true);
        });
    });
