/* globals angular, $*/

(function () {
    "use strict";
    var app = angular.module('interactiveMaps.menus.bottomMenu',[]);
    app.controller('bottomMenuController', ['$scope','$timeout', function ($scope,$timeout) {
        $scope.alternateView = 'resources/img/3dglobe.png';
        $('#bottomMenu').mouseenter(function () {
            $('#bottomMenu').addClass('cbp-spmenu-open');
        });
        $('#bottomMenu').mouseleave(function () {
            $('#bottomMenu').removeClass('cbp-spmenu-open');
        });
        $scope.updateMenu = function () {
            $timeout(function () {
                if($scope.mapController != null) {
                    if($scope.mapController.is3d()) {
                        $scope.alternateView = 'resources/img/2dglobe.png';
                    } else {
                        $scope.alternateView = 'resources/img/3dglobe.png';
                    }
                }
            });
        };
        $scope.updateMenu();
        $scope.switch3d = function () {
            $scope.updateMenu();
            if($scope.mapController != null) {
                $scope.mapController.switch3d();
            }
        };

    }]);

})();