/// <reference path="../_reference.d.ts" />
var EntitySelectorClass = /** @class */ (function () {
    function EntitySelectorClass() {
    }
    EntitySelectorClass.prototype.GetEntities = function (skipSystems) {
        var outItems = new Array();
        var scene = App.Layout.Scene;
        for (var i = 0; i < scene.children.length; i++) {
            var obj3d = scene.children[i];
            var ent = obj3d;
            if (ent.geometry == undefined) {
                continue;
            }
            if (skipSystems) {
                if (IsObjectData(obj3d.userData)) {
                    var objData = obj3d.userData;
                    if (objData.IsSystem) {
                        continue;
                    }
                }
            }
            outItems.push(obj3d);
        }
        return outItems;
    };
    EntitySelectorClass.prototype.GetEntitiesByType = function (entType) {
        var outItems = new Array();
        var scene = App.Layout.Scene;
        for (var i = 0; i < scene.children.length; i++) {
            var obj3d = scene.children[i];
            var ent = obj3d;
            var objData = GetObjectData(obj3d);
            if (objData == null) {
                continue;
            }
            if (objData.EntityType != entType) {
                continue;
            }
            outItems.push(obj3d);
        }
        return outItems;
    };
    EntitySelectorClass.prototype.GetEntityById = function (id) {
        var scene = App.Layout.Scene;
        for (var i = 0; i < scene.children.length; i++) {
            var obj3d = scene.children[i];
            if (obj3d.uuid == id) {
                return obj3d;
            }
        }
        return null;
    };
    return EntitySelectorClass;
}());
var EntitySelector = new EntitySelectorClass();
