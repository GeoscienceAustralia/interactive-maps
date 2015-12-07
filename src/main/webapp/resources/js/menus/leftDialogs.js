var angular = angular || {};
var console = console || {};
var $ = $ || {};

var app = angular.module('interactiveMaps.menus.leftDialogs', [ 'interactiveMaps.services' ]);

app.controller('leftDialogsController', [ '$scope', '$http', '$location', function ($scope, $http, $location) {
	"use strict";

	$scope.$on('aboutDialogReady', function (event, args) {
		$scope.aboutDialogController = args;
	});
	$scope.$on('legendDialogReady', function (event, args) {
		$scope.legendDialogController = args;
	});

	$scope.aboutToggleClicked = function () {
		if ($scope.leftHandContentDisplay === "About") {
			$scope.closeLeftHandMenu();
		} else {
			$scope.openLeftHandMenu();
			$scope.leftHandContentDisplay = "About";
		}
	};

   $scope.mapsToggleClicked = function () {
      if ($scope.leftHandContentDisplay === "Maps") {
         $scope.closeLeftHandMenu();
      } else {
         $scope.openLeftHandMenu();
         $scope.leftHandContentDisplay = "Maps";
      }
      
      // Get a list of all the themes from the config
      $http.get('api/config/site-config.json').success(function (response) {
         $scope.mapsToDisplay = response.themes;
          for (var i = 0; i < $scope.mapsToDisplay.length; i++) {
              var theme = $scope.mapsToDisplay[i];
              theme.url = "theme/" + theme.id;
          }
      }).error(function (data, status, headers, config) {
      });
      
      $scope.displayType = "theme";
   };
   
   $scope.displayRelatedMaps = function (id) {
      if ($scope.displayType == "theme") {
         // Get a list fo all the maps for the selected theme
         $http.get('api/config/' + id + '/app.json').success(function (response) {
            $scope.mapsToDisplay = response.maps;
             for (var i = 0; i < $scope.mapsToDisplay.length; i++) {
                 var map = $scope.mapsToDisplay[i];
                 map.url = "r/reload/theme/" + id + "/" + "map/" + map.id;
             }
         }).error(function (data, status, headers, config) {
         });

         $scope.displayType = "map";
         $scope.selectedThemeId = id;
         $scope.AllThemes = $scope.mapsToDisplay;
      } else if   ($scope.displayType == "map") {
         // Redirect to the selected map
         $location.path("r/reload/theme/" + $scope.selectedThemeId + "/map/" + id);
      }
   };
   
   // When the back button is selected load all the themes again
   $scope.resetMapList = function () {
      $scope.displayType = "theme";
      $scope.mapsToDisplay = $scope.AllThemes;
   };

	$scope.legendToggleClicked = function () {
		if ($scope.leftHandContentDisplay === "Legend") {
			$scope.closeLeftHandMenu();
		} else {
			$scope.openLeftHandMenu();
			$scope.leftHandContentDisplay = "Legend";
		}
	};

	$scope.layersToggleClicked = function () {
		if ($scope.leftHandContentDisplay === "Layers") {
			$scope.closeLeftHandMenu();
		} else {
			$scope.openLeftHandMenu();
			$scope.leftHandContentDisplay = "Layers";
		}
	};

	$scope.openLeftHandMenu = function () {
		$('#leftHandMenuNav').addClass('cbp-spmenu-open');
	};

	$scope.closeLeftHandMenu = function () {
		$('#leftHandMenuNav').removeClass('cbp-spmenu-open');
		$scope.leftHandContentDisplay = "";
	};
	var self = this;
	self.close = function () {
		$scope.closeLeftHandMenu();
	};

	self.open = function () {
		$scope.openLeftHandMenu();
	};

	self.setContentToDisplay = function (contentName) {
		$scope.leftHandContentDisplay = contentName;
	};

	$scope.$emit('leftMenuController', self);
	$scope.leftHandContentDisplay = "";
    var isMobile = (window.screen.width < 480 && window.screen.height < 800) ||
        (window.screen.width < 800 && window.screen.height < 480);
    if($scope.geoConfig && !isMobile) {
        if($scope.geoConfig.aboutConfig && $scope.geoConfig.aboutConfig.open === true) {
            $scope.leftHandContentDisplay = 'About';
            $scope.openLeftHandMenu();
        } else if($scope.geoConfig.layersConfig && $scope.geoConfig.layersConfig.open === true) {
            $scope.leftHandContentDisplay = 'Layers';
            $scope.openLeftHandMenu();
        } else if($scope.geoConfig.legendConfig && $scope.geoConfig.legendConfig.open === true) {
            $scope.leftHandContentDisplay = 'Legend';
            $scope.openLeftHandMenu();
        }
    }

} ]);
