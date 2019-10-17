/// <reference path="../_reference.d.ts" />
var SelectionItemEdge = /** @class */ (function () {
    function SelectionItemEdge(ent, vStart, vEnd, matchTag) {
        this.EntityId = ent.uuid;
        this.N1 = vStart;
        this.N2 = vEnd;
        this.SelectionType = SelectionType.Edge;
        this.MatchTag = matchTag;
    }
    SelectionItemEdge.prototype.GetId = function () {
        return "Edge" + this.EntityId + this.N1 + this.N2;
    };
    SelectionItemEdge.prototype.GetCenter = function (geometry) {
        var vec1 = geometry.vertices[this.N1];
        var vec2 = geometry.vertices[this.N2];
        return vec1.clone().add(vec2).divideScalar(2);
    };
    return SelectionItemEdge;
}());
