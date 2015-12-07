var angular = angular || {};
var console = console || {};

var app = angular.module('interactiveMaps.validation.gisValidation', [ 'geowebtoolkit.utils' ]);


// Validates longitude between -180 and 180 for WGS84
app.directive('gisLongitudeValidator', [ 'gisValidationHelperService',
    function (gisValidationHelperService) {
        "use strict";
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                scope.$watch(attrs.gisLongitudeValidator, function (newVal) {
                    if (newVal != null) {
                        if (newVal.length > 0) {
                            if (gisValidationHelperService.isNumber(newVal)) {
                                if (newVal >= -180 && newVal <= 180) {
                                    ctrl.$setValidity('lonValid', true);
                                    return newVal;
                                } else {
                                    ctrl.$setValidity('lonValid', false);
                                    return undefined;
                                }
                            } else if (!ctrl.$pristine) {
                                ctrl.$setValidity('lonValid', false);
                                return undefined;
                            }
                        }
                    }
                });
            }
        };
    }]);

// Validates latitude between -90 and 90 for WGS84
app.directive('gisLatitudeValidator', [ 'gisValidationHelperService',
    function (gisValidationHelperService) {
        "use strict";
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                scope.$watch(attrs.gisLatitudeValidator, function (newVal) {
                    if (newVal != null) {
                        if (newVal.length > 0) {
                            if (gisValidationHelperService.isNumber(newVal)) {
                                if (newVal >= -90 && newVal <= 90) {
                                    ctrl.$setValidity('latValid', true);
                                    return newVal;
                                } else {
                                    ctrl.$setValidity('latValid', false);
                                    return undefined;
                                }
                            } else if (!ctrl.$pristine) {
                                ctrl.$setValidity('latValid', false);
                                return undefined;
                            }
                        }
                    }
                });
            }
        };
    }]);

// Validates longitude between -180 and 180 for WGS84, validator watches all 3 input boxes
// and to save complex logic it just does a conversion for all 3 each time
app.directive('gisLongitudeDmsValidator', [ 'gisValidationHelperService', '$parse',
    function (gisValidationHelperService, $parse) {
        "use strict";
        return {
            require: '^form',
            link: function (scope, elm, attrs, ctrl) {
                scope.$watch(attrs.lonDegreesInput, function (newVal) {
                    if ($parse(attrs.lonDegreesInput)(scope) != null) {
                        if ($parse(attrs.lonDegreesInput)(scope).length > 0) {
                            var convertedVal = gisValidationHelperService.convertDMSToDD($parse(attrs.lonDegreesInput)(scope), $parse(attrs.lonMinutesInput)(scope), $parse(attrs.lonSecondsInput)(scope));

                            if (gisValidationHelperService.isNumber(newVal)) {
                                if (convertedVal >= -180 && convertedVal <= 180) {
                                    ctrl.lonDegreesInput.$setValidity('lonDegrees', true);
                                    return undefined;
                                } else {
                                    ctrl.lonDegreesInput.$setValidity('lonDegrees', false);
                                    return undefined;
                                }
                            } else if (!ctrl.$pristine) {
                                ctrl.lonDegreesInput.$setValidity('lonDegrees', false);
                                return undefined;
                            }
                        }
                    }
                });

                scope.$watch(attrs.lonMinutesInput, function (newVal) {
                    if ($parse(attrs.lonMinutesInput)(scope) != null) {
                        if ($parse(attrs.lonMinutesInput)(scope).length > 0) {
                            var convertedVal = gisValidationHelperService.convertDMSToDD($parse(attrs.lonDegreesInput)(scope), $parse(attrs.lonMinutesInput)(scope), $parse(attrs.lonSecondsInput)(scope));

                            if (gisValidationHelperService.isNumber(newVal)) {
                                if (convertedVal >= -180 && convertedVal <= 180) {
                                    ctrl.lonMinutesInput.$setValidity('lonMinutes', true);
                                    return undefined;
                                } else {
                                    ctrl.lonMinutesInput.$setValidity('lonMinutes', false);
                                    return undefined;
                                }
                            } else if (!ctrl.$pristine) {
                                ctrl.lonMinutesInput.$setValidity('lonMinutes', false);
                                return undefined;
                            }
                        }
                    }
                });

                scope.$watch(attrs.lonSecondsInput, function (newVal) {
                    if ($parse(attrs.lonSecondsInput)(scope) != null) {
                        if ($parse(attrs.lonSecondsInput)(scope).length > 0) {
                            var convertedVal = gisValidationHelperService.convertDMSToDD($parse(attrs.lonDegreesInput)(scope), $parse(attrs.lonMinutesInput)(scope), $parse(attrs.lonSecondsInput)(scope));

                            if (gisValidationHelperService.isNumber(newVal)) {
                                if (convertedVal >= -180 && convertedVal <= 180) {
                                    ctrl.lonSecondsInput.$setValidity('lonSeconds', true);
                                    return undefined;
                                } else {
                                    ctrl.lonSecondsInput.$setValidity('lonSeconds', false);
                                    return undefined;
                                }
                            } else if (!ctrl.$pristine) {
                                ctrl.lonSecondsInput.$setValidity('lonSeconds', false);
                                return undefined;
                            }
                        }
                    }
                });
            }
        };
    }]);

// Validates latitude between -90 and 90 for WGS84, validator watches all 3 input boxes
//and to save complex logic it just does a conversion for all 3 each time
app.directive('gisLatitudeDmsValidator', [ 'gisValidationHelperService', '$parse',
    function (gisValidationHelperService, $parse) {
        "use strict";
        return {
            require: '^form',
            link: function (scope, elm, attrs, ctrl) {
                scope.$watch(attrs.latDegreesInput, function (newVal) {
                    if ($parse(attrs.latDegreesInput)(scope) != null) {
                        if ($parse(attrs.latDegreesInput)(scope).length > 0) {
                            var convertedVal = gisValidationHelperService.convertDMSToDD($parse(attrs.latDegreesInput)(scope), $parse(attrs.latMinutesInput)(scope), $parse(attrs.latSecondsInput)(scope));

                            if (gisValidationHelperService.isNumber(newVal)) {
                                if (convertedVal >= -90 && convertedVal <= 90) {
                                    ctrl.latDegreesInput.$setValidity('latDegrees', true);
                                    return undefined;
                                } else {
                                    ctrl.latDegreesInput.$setValidity('latDegrees', false);
                                    return undefined;
                                }
                            } else if (!ctrl.$pristine) {
                                ctrl.latDegreesInput.$setValidity('latDegrees', false);
                                return undefined;
                            }
                        }
                    }
                });

                scope.$watch(attrs.latMinutesInput, function (newVal) {
                    if ($parse(attrs.latMinutesInput)(scope) != null) {
                        if ($parse(attrs.latMinutesInput)(scope).length > 0) {
                            var convertedVal = gisValidationHelperService.convertDMSToDD($parse(attrs.latDegreesInput)(scope), $parse(attrs.latMinutesInput)(scope), $parse(attrs.latSecondsInput)(scope));

                            if (gisValidationHelperService.isNumber(newVal)) {
                                if (convertedVal >= -180 && convertedVal <= 180) {
                                    ctrl.latMinutesInput.$setValidity('latMinutes', true);
                                    return undefined;
                                } else {
                                    ctrl.latMinutesInput.$setValidity('latMinutes', false);
                                    return undefined;
                                }
                            } else if (!ctrl.$pristine) {
                                ctrl.latMinutesInput.$setValidity('latMinutes', false);
                                return undefined;
                            }
                        }
                    }
                });

                scope.$watch(attrs.latSecondsInput, function (newVal) {
                    if ($parse(attrs.latSecondsInput)(scope) != null) {
                        if ($parse(attrs.latSecondsInput)(scope).length > 0) {
                            var convertedVal = gisValidationHelperService.convertDMSToDD($parse(attrs.latDegreesInput)(scope), $parse(attrs.latMinutesInput)(scope), $parse(attrs.latSecondsInput)(scope));

                            if (gisValidationHelperService.isNumber(newVal)) {
                                if (convertedVal >= -180 && convertedVal <= 180) {
                                    ctrl.latSecondsInput.$setValidity('latSeconds', true);
                                    return undefined;
                                } else {
                                    ctrl.latSecondsInput.$setValidity('latSeconds', false);
                                    return undefined;
                                }
                            } else if (!ctrl.$pristine) {
                                ctrl.latSecondsInput.$setValidity('latSeconds', false);
                                return undefined;
                            }
                        }
                    }
                });
            }
        };
    }]);

app.service('gisValidationHelperService', [ function () {
    "use strict";
    return {
        isNumber: function (n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        // convert degrees minutes seconds to decimal degrees
        convertDMSToDD: function (degrees, minutes, seconds) {
            var decimalDegrees = Math.abs(degrees) + (Math.abs(minutes) / 60) + (Math.abs(seconds) / 3600);

            if (degrees < 0) {
                decimalDegrees = decimalDegrees * -1;
            }

            return decimalDegrees.toFixed(3);
        }
    };
}]);