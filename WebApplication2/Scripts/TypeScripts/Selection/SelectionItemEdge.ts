/// <reference path="../_reference.d.ts" />

class SelectionItemEdge implements SelectionItem
{
    public EntityId: string;

    public MatchTag: number;

    public SelectionType: SelectionType;

    public N1: number;

    public N2: number;

    constructor(ent: THREE.Object3D, vStart: number, vEnd: number, matchTag: number)
    {
        this.EntityId = ent.uuid;
        this.N1 = vStart;
        this.N2 = vEnd;

        this.SelectionType = SelectionType.Edge;
        this.MatchTag = matchTag;
    }

    public GetId(): string
    {
        return "Edge" + this.EntityId + this.N1 + this.N2;
    }

    public GetCenter(geometry: THREE.Geometry): THREE.Vector3
    {
        var vec1 = geometry.vertices[this.N1];
        var vec2 = geometry.vertices[this.N2];
        return vec1.clone().add(vec2).divideScalar(2);
    }
}