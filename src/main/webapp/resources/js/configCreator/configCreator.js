var angular = angular || {};
var console = console || {};

var app = angular.module('interactiveMaps.configCreator',
    [
        'interactiveMaps.configCreator.mapPreview',
        'interactiveMaps.configCreator.services',
        'interactiveMaps.configCreator.mapLayerAccordion',
        'interactiveMaps.configCreator.baseMapLayerAccordion',
        'interactiveMaps.configCreator.toolsAccordion',
        'interactiveMaps.configCreator.navigationAccordion',
        'interactiveMaps.configCreator.mapDetailsAccordion',
        'interactiveMaps.configCreator.mapConfigAccordion',
        'interactiveMaps.configCreator.browseWMSDialog'
    ]);
