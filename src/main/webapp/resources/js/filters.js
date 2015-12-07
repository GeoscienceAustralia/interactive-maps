var angular = angular || {};

var app = angular.module('interactiveMaps.filters', []);
app.filter('reverse', function () {
    "use strict";
    return function (items) {
        return items.slice().reverse();
    };
});

app.filter('unsafe', ['$sce', function ($sce) {
    "use strict";
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);

app.filter('hasTag', function () {
    "use strict";
    return function (items, tag) {
        var result = [];
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.tags == null) {
                continue;
            }
            var listOftags = item.tags.split(',');
            for (var j = 0; j < listOftags.length; j++) {
                var mapTag = listOftags[j].trim();
                if (mapTag === tag.id) {
                    result.push(item);
                }
            }
        }
        return result;
    };
});

app.filter('hasNoTag', function () {
    "use strict";
    return function (items) {
        var result = [];
        if (items == null) {
            return result;
        }
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.tags == null) {
                result.push(item);
            }
        }
        return result;
    };
});