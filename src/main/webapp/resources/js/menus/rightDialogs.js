var angular = angular || {};
var console = console || {};
var $ = $ || {};

var app = angular.module('interactiveMaps.menus.rightDialogs', [ 'interactiveMaps.services' ]);

app.controller('rightDialogsController', [ '$scope', function ($scope) {
	"use strict";
	var self = this;

	self.open = function () {
		$('#rightHandMenuNav').addClass('cbp-spmenu-open');
		moveControlsToOpenPosition();
	};

	self.close = function () {
		$('#rightHandMenuNav').removeClass('cbp-spmenu-open');
		moveControlsToClosePosition();
		$scope.rightHandContentDisplay = "";
	};

    self.openToSmall = function () {
        $('.olControlOverviewMap').addClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium')
            .removeClass('toolbarOpenLarge');
        $('.olControlPanZoomBar').addClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium')
            .removeClass('toolbarOpenLarge');
        $('.olControlMousePosition').addClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium')
            .removeClass('toolbarOpenLarge');
        $('.olControlScaleLine').addClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium')
            .removeClass('toolbarOpenLarge');
        $('.olControlPermalink').addClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium')
            .removeClass('toolbarOpenLarge');

        $('.ol-overviewmap').addClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium')
            .removeClass('toolbarOpenLarge');
        $('.ol-attribution').addClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium')
            .removeClass('toolbarOpenLarge');
        $('.ol-zoomslider').addClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium')
            .removeClass('toolbarOpenLarge');
        $('.ol-scale-line').addClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium')
            .removeClass('toolbarOpenLarge');
        $('.ol-mouse-position').addClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium')
            .removeClass('toolbarOpenLarge');

        $('.searchContainer').addClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium')
            .removeClass('toolbarOpenLarge');

        $('.resetMapExtentBtn').addClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium')
            .removeClass('toolbarOpenLarge');

        $('#rightHandMenuNav').addClass('cbp-spmenu-right-small')
            .removeClass('cbp-spmenu-right-large')
            .removeClass('cbp-spmenu-right-med');
    };

    self.openToMedium = function () {
        $('.olControlOverviewMap').addClass('toolbarOpenMedium')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenLarge');
        $('.olControlPanZoomBar').addClass('toolbarOpenMedium')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenLarge');
        $('.olControlMousePosition').addClass('toolbarOpenMedium')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenLarge');
        $('.olControlScaleLine').addClass('toolbarOpenMedium')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenLarge');
        $('.olControlPermalink').addClass('toolbarOpenMedium')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenLarge');

        $('.ol-overviewmap').addClass('toolbarOpenMedium')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenLarge');
        $('.ol-attribution').addClass('toolbarOpenMedium')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenLarge');
        $('.ol-zoomslider').addClass('toolbarOpenMedium')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenLarge');
        $('.ol-scale-line').addClass('toolbarOpenMedium')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenLarge');
        $('.ol-mouse-position').addClass('toolbarOpenMedium')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenLarge');

        $('.searchContainer').addClass('toolbarOpenMedium')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenLarge');

        $('.resetMapExtentBtn').addClass('toolbarOpenMedium')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenLarge');

        $('#rightHandMenuNav').addClass('cbp-spmenu-right-med')
            .removeClass('cbp-spmenu-right-large')
            .removeClass('cbp-spmenu-right-small');
    };

    self.openToLarge = function () {
        $('.olControlOverviewMap').addClass('toolbarOpenLarge')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium');
        $('.olControlPanZoomBar').addClass('toolbarOpenLarge')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium');
        $('.olControlMousePosition').addClass('toolbarOpenLarge')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium');
        $('.olControlScaleLine').addClass('toolbarOpenLarge')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium');
        $('.olControlPermalink').addClass('toolbarOpenLarge')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium');

        $('.ol-overviewmap').addClass('toolbarOpenLarge')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium');
        $('.ol-attribution').addClass('toolbarOpenLarge')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium');
        $('.ol-zoomslider').addClass('toolbarOpenLarge')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium');
        $('.ol-scale-line').addClass('toolbarOpenLarge')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium');
        $('.ol-mouse-position').addClass('toolbarOpenLarge')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium');

        $('#rightHandMenuNav').addClass('cbp-spmenu-right-large')
            .removeClass('cbp-spmenu-right-med')
            .removeClass('cbp-spmenu-right-small');

        $('.searchContainer').addClass('toolbarOpenLarge')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium');

        $('.resetMapExtentBtn').addClass('toolbarOpenLarge')
            .removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium');
    };

	var moveControlsToOpenPosition = function () {
        var toolConfig = getActiveToolConfig();
        if(toolConfig == null) {
            self.openToSmall();
        } else if(toolConfig.panelSize != null && toolConfig.panelSize.toLowerCase != null) {
            switch (toolConfig.panelSize.toLowerCase()) {
                case 'small':
                    self.openToSmall();
                    break;
                case 'med':
                case 'medium':
                    self.openToMedium();
                    break;
                case 'large':
                    self.openToLarge();
                    break;
            }
        } else {
            self.openToSmall();
        }
	};

	var moveControlsToClosePosition = function () {
        removeToolbarOpenClasses('.olControlOverviewMap');
        removeToolbarOpenClasses('.olControlPanZoomBar');
        removeToolbarOpenClasses('.olControlMousePosition');
        removeToolbarOpenClasses('.olControlScaleLine');
        removeToolbarOpenClasses('.olControlPermalink');

        removeToolbarOpenClasses('.ol-overviewmap');
        removeToolbarOpenClasses('.ol-attribution');
        removeToolbarOpenClasses('.ol-zoomslider');
        removeToolbarOpenClasses('.ol-scale-line');
        removeToolbarOpenClasses('.ol-mouse-position');

        removeToolbarOpenClasses('.searchContainer');
        removeToolbarOpenClasses('.resetMapExtentBtn');
	};

    function removeToolbarOpenClasses(id) {
        $(id).removeClass('toolbarOpenSmall')
            .removeClass('toolbarOpenMedium')
            .removeClass('toolbarOpenLarge');
    }

    function getActiveToolConfig() {
        for (var i = 0; i < $scope.geoConfig.toolsConfig.tools.length; i++) {
            var toolConfig = $scope.geoConfig.toolsConfig.tools[i];
            if(toolConfig.id === $scope.rightHandContentDisplay) {
                return toolConfig.config;
            }
        }
        return null;
    }

	self.setMenuContent = function (contentName) {
		$scope.rightHandContentDisplay = contentName;
        $scope.currentActiveTool = getActiveToolConfig();
	};

	$scope.closeRightHandMenu = function () {
		$scope.controllers.toolbarController.resetAllToggles();
		self.close();
	};

    $scope.shrinkPanel = function () {
        var hasMed = $('#rightHandMenuNav').hasClass('cbp-spmenu-right-med');
        var hasLrg = $('#rightHandMenuNav').hasClass('cbp-spmenu-right-large');
        if(hasMed) {
            self.openToSmall();
        }
        if(hasLrg) {
            self.openToMedium();
        }
    };

    $scope.expandPanel = function () {
        var hasSmall = $('#rightHandMenuNav').hasClass('cbp-spmenu-right-small');
        var hasMed = $('#rightHandMenuNav').hasClass('cbp-spmenu-right-med');
        if(hasSmall) {
            self.openToMedium();
        }
        if(hasMed) {
            self.openToLarge();
        }
    };

	$scope.$emit('rightMenuController', self);
	$scope.rightHandContentDisplay = "";

	$scope.$on('rightHandContentChange', function (event, args) {
		if ($scope.rightHandContentDisplay === args) {
			self.close();
		} else {
			$scope.rightHandContentDisplay = args;
			self.open();
		}
	});
} ]);