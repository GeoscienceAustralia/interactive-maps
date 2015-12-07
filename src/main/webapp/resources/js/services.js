var angular = angular || {};
var console = console || {};

var app = angular.module('interactiveMaps.services', []);

app.service('interactiveMapsUtils', [ function () {
	"use strict";

	return {
		arrayToTable: function (array, numOfCols) {
			var arrayLength = array.length;
			var rows = [];
			var rowNum = 0;
			for (var i = 0; i < arrayLength; i++) {
				var rowMod = (i) % numOfCols;
				if (rowMod === 0) {
					rows.push({
						columns: []
					});
				}
				rows[rowNum].columns.push(array[i]);
				if (rowMod === numOfCols - 1) {
					rowNum++;
				}
			}

			return rows;
		}
	};
} ]);

app.service('geoTemplateService', [ function () {
	"use strict";
	var templates = [];

	templates['search'] = {
		id: 'FeaturePopup',
		data: {
			templates: {
				hover: '<b>${name}</b>',
				single: '${name}',
				item: '<li><a href="#" ${showPopup()}>${name}</a></li>'
			},
			featureContext: {
				fid: function (feature) {
					return feature.id;
				},
				name: function (feature) {
					return feature.data.NAME;
				}
			}
		}
	};
	return {
		resolveTemplateById: function (templateId) {
			return templates[templateId];
		},
		resolveSingleDynamicPropertyTemplate: function (propertyName) {
			return {
				id: 'FeaturePopup',
				data: {
					templates: {
						hover: '<b>${name}</b>',
						single: '${name}',
						item: '<li><a href="#" ${showPopup()}>${name}</a></li>'
					},
					featureContext: {
						fid: function (feature) {
							return feature.id;
						},
						name: function (feature) {
							return feature.data[propertyName];
						}
					}
				}
			};
		}
	};
} ]);