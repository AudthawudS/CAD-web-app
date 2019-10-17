/// <reference path="../_reference.d.ts" />
var SelectionItemBufVert = /** @class */ (function () {
    function SelectionItemBufVert(ent, vertex, index, matchTag) {
        this.EntityId = ent.uuid;
        this.Vertex = vertex;
        this.Index = index;
        this.SelectionType = SelectionType.Node;
        this.MatchTag = matchTag;
    }
    SelectionItemBufVert.prototype.GetId = function () {
        return "Vertex" + this.EntityId + this.Index;
    };
    SelectionItemBufVert.prototype.GetCenter = function () {
        return this.Vertex.clone();
    };
    return SelectionItemBufVert;
}());
