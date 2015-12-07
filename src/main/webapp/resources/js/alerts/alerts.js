var angular = angular || {};
var app = angular.module('interactiveMaps.alerts', []);

app.service('uiAlertSvc', [function () {
    "use strict";
    var service = {
        logError: function (message) {
            for (var i = 0; i < service.errorListeners.length; i++) {
                var listener = service.errorListeners[i];
                if (listener) {
                    listener(message);
                } else {
                    service.infoListeners.splice(i, 1);
                    i--;
                }
            }
        },
        logInfo: function (message) {
            for (var i = 0; i < service.infoListeners.length; i++) {
                var listener = service.infoListeners[i];
                if (listener) {
                    listener(message);
                } else {
                    service.infoListeners.splice(i, 1);
                    i--;
                }
            }
        },
        listenError: function (callback) {
            service.errorListeners.push(callback);
        },
        listenInfo: function (callback) {
            service.infoListeners.push(callback);
        },
        removeErrorListener: function (callback) {
            var index = service.errorListeners.indexOf(callback);
            if (index !== -1) {
                service.errorListeners.slice(index, 1);
            }
        },
        removeInfoListener: function (callback) {
            var index = service.infoListeners.indexOf(callback);
            if (index !== -1) {
                service.infoListeners.slice(index, 1);
            }
        },
        errorListeners: [],
        infoListeners: []
    };
    return service;
}]);


app.controller('alertCtrl', ['$scope', '$timeout', 'uiAlertSvc',
    function ($scope, $timeout, uiAlertSvc) {
        "use strict";
        $scope.alerts = [];
        $scope.closeable = true;
        $scope.close = function (index) {
            $scope.alerts.splice(index, 1);
        };
        $scope.addErrorAlert = function (message) {
            if (message.hasOwnProperty('message')) {
                //Debug only?

            }
            if (typeof message === 'string') {
                if ($scope.alerts.length > 4) {
                    $scope.alerts.splice(0, 1);
                }
                $scope.alerts.push({
                    type: 'danger',
                    msg: "Please contact Client Services at clientservices@ga.gov.au. " + message
                });
            }
            $timeout(function () {
                $scope.$apply();
            });
        };

        $scope.addInfoAlert = function (message) {
            if ($scope.alerts.length > 4) {
                $scope.alerts.splice(0, 1);
            }
            $scope.alerts.push({msg: message, type: 'info'});
            $timeout(clearLastMessage, 3000);
        };

        var clearLastMessage = function () {
            $scope.alerts.splice(0, 1);
        };

        $scope.addSuccessAlert = function (message) {
            $scope.alerts.push({msg: message, type: 'success'});
        };

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

        //Using decorated $log service
        uiAlertSvc.listenError(function (message) {
            $scope.addErrorAlert(message);
        });

        uiAlertSvc.listenInfo(function (message) {
            //$scope.addInfoAlert(message);
        });
    }]);