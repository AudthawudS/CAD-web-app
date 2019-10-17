/// <reference path="../_reference.d.ts" />
/// <reference path="./IOperation.ts" />
var OperationEditEntity = /** @class */ (function () {
    function OperationEditEntity() {
        this._transforms = new Hashtable();
        var ents = App.Layout.Scene.children;
        for (var idx in ents) {
            var ent = ents[idx];
            if (!(ent instanceof THREE.Mesh)) {
                continue;
            }
            var matrix = ent.matrix.clone();
            this._transforms.put(ent.uuid, matrix);
        }
    }
    OperationEditEntity.prototype.Apply = function () {
        var ents = App.Layout.Scene.children;
        for (var idx in ents) {
            var ent = ents[idx];
            if (!(ent instanceof THREE.Mesh)) {
                continue;
            }
            if (this._transforms.containsKey(ent.uuid)) {
                var opMat = this._transforms.get(ent.uuid).clone();
                ent.matrix.identity();
                ent.applyMatrix(opMat);
                ent.matrixWorldNeedsUpdate = true;
            }
        }
    };
    OperationEditEntity.prototype.Undo = function () {
        // none
    };
    return OperationEditEntity;
}());
