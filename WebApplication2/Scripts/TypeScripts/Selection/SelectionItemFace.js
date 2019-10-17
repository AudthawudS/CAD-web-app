/// <reference path="../_reference.d.ts" />
var SelectionItemFace = /** @class */ (function () {
    function SelectionItemFace(ent, faceIndex, v1, v2, v3, matchTag) {
        this.EntityId = ent.uuid;
        this.N1 = v1;
        this.N2 = v2;
        this.N3 = v3;
        this.FaceIndex = faceIndex;
        this.SelectionType = SelectionType.Face;
        this.MatchTag = matchTag;
    }
    SelectionItemFace.prototype.GetId = function () {
        return "Face" + this.EntityId
            + this.N1 + this.N2 + this.N3;
    };
    SelectionItemFace.prototype.GetCenter = function (geometry) {
        var verts = geometry.vertices;
        var v1 = verts[this.N1];
        var v2 = verts[this.N2];
        var v3 = verts[this.N3];
        return v1.clone().add(v2).add(v3).divideScalar(3);
    };
    return SelectionItemFace;
}());
