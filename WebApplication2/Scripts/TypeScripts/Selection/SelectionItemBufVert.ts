/// <reference path="../_reference.d.ts" />

class SelectionItemBufVert implements SelectionItem
{
    public EntityId: string;

    public MatchTag: number;

    public SelectionType : SelectionType;

    public Vertex: THREE.Vector3;

    public Index: number;

    constructor(ent : THREE.Object3D, vertex : THREE.Vector3, index: number, matchTag: number)
    {
        this.EntityId = ent.uuid;
        this.Vertex = vertex;
        this.Index = index;

        this.SelectionType = SelectionType.Node;
        this.MatchTag = matchTag;
    }

    public GetId() : string
    {
        return "Vertex" + this.EntityId + this.Index;
    }

    public GetCenter(): THREE.Vector3
    {
        return this.Vertex.clone();
    }

}
