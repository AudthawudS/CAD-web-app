/// <reference path="../_reference.d.ts" />
var SelectionItemEntity = /** @class */ (function () {
    function SelectionItemEntity(ent) {
        this.EntityId = ent.uuid;
        this.MatchTag = -1;
        this.refname = ent.name;
        this.SelectionType = SelectionType.Entity;
    }
    SelectionItemEntity.prototype.GetId = function () {
        return "Entity" + this.EntityId;
    };
    SelectionItemEntity.prototype.GetCenter = function () {
        var ent = App.Layout.GetEntityById(this.EntityId);
        if (!(ent.geometry instanceof THREE.Geometry)) {
            return new THREE.Vector3();
        }
        var geom = (ent.geometry);
        return geom.boundingBox.center();
    };
    return SelectionItemEntity;
}());
