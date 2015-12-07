/* global describe, beforeEach, module, inject, it, expect, runs, angular, afterEach, jasmine */

describe('interactiveMaps.filters tests',
    function () {
        var $filter;

        beforeEach(module('testApp'));

        beforeEach(inject(function (_$filter_) {
            $filter = _$filter_;
        }));

        it('Should reverse the order of the array', function () {
            var test = ["1", "2", "3"]
            var result = $filter('reverse')(test);
            expect(result).toEqual(["3", "2", "1"]);
        });

        it('Should filter all objects matching the tag id', function () {
            var list = [
                {
                    "title": "Seas and Submerged Lands Act 1973",
                    "tags": "MaritimeBoundaries",
                    "id": "sasla1973",
                    "previewImageUrl": "content/amsis/sasla1973/mapPreview.png",
                    "previewDescription": "An Act relating to Sovereignty in respect of certain Waters of the Sea and in respect of the Airspace over, and the Sea bed and Subsoil beneath, those Waters and to Sovereign Rights in respect of the Continental Shelf and the Exclusive Economic Zone and to certain rights of control in respect of the Contiguous Zone."
                },
                {
                    "title": "Offshore Petroleum and Greenhouse Gas Storage Act 2006",
                    "tags": "Petroleum",
                    "id": "opggsa2006",
                    "previewImageUrl": "content/amsis/opggsa2006/mapPreview.png",
                    "previewDescription": "An Act about petroleum exploration and recovery, and the injection and storage of greenhouse gas substances, in offshore areas, and for other purposes."
                }
            ];

            var tag = {"id": "MaritimeBoundaries"};
            var result = $filter('hasTag')(list, tag);

            expect(result[0].id).toEqual("sasla1973");
            expect(result[0].tags).toEqual("MaritimeBoundaries");
        });

        it('Should filter all objects without a tag property', function () {
            var list = [
                {
                    "title": "Seas and Submerged Lands Act 1973",
                    "id": "sasla1973",
                    "previewImageUrl": "content/amsis/sasla1973/mapPreview.png",
                    "previewDescription": "An Act relating to Sovereignty in respect of certain Waters of the Sea and in respect of the Airspace over, and the Sea bed and Subsoil beneath, those Waters and to Sovereign Rights in respect of the Continental Shelf and the Exclusive Economic Zone and to certain rights of control in respect of the Contiguous Zone."
                },
                {
                    "title": "Offshore Petroleum and Greenhouse Gas Storage Act 2006",
                    "tags": "Petroleum",
                    "id": "opggsa2006",
                    "previewImageUrl": "content/amsis/opggsa2006/mapPreview.png",
                    "previewDescription": "An Act about petroleum exploration and recovery, and the injection and storage of greenhouse gas substances, in offshore areas, and for other purposes."
                }
            ];

            var result = $filter('hasNoTag')(list);

            expect(result.length === 1).toBe(true);
            expect(result[0].id).toEqual("sasla1973");
        });
    });