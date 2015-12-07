/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */

describe('exportPanel tests',
    function () {
        var $compile, scope, elm, control, $httpBackend;

        beforeEach(module('testApp'));

        beforeEach(inject(function (_$compile_, _$rootScope_, $injector, $sniffer) {
            $compile = _$compile_;
            $scope = _$rootScope_;

//            element = angular
//                .element('<div ng-controller="toolbarController"> <div id="right" ng-controller="rightDialogsController"><div id="export" ng-controller="exportPanelController"></div></div></div>');
//
//            $compile(element)(_$rootScope_);
//
//            var exportScope = angular.element(element.find('#export')).scope();
//            exportScope.tool = {
//                config: {
//                    markerHeight: "40",
//                    markerUrl: "content/marker/marker-print.png",
//                    markerWidth: "55",
//                    panelHeading: "Print to PDF",
//                    templatesList: [
//                        "Landscape_A4"
//                    ],
//                    titleText: "Print to PDF",
//                    url: "/gisgp/rest/services/topography/Print_Service/GPServer/PrintPoint/"
//                },
//                id: "export",
//                slug: "export",
//                toolPanelUrl: "resources/partial/exportPanel.html",
//                toolToggleUrl: "resources/partial/exportToggle.html"
//            };
//            $scope.$digest();
        }));

        it('', function () {

        });
    });
