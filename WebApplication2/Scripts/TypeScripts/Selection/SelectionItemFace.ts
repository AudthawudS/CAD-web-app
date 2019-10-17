/// <reference path="../_reference.d.ts" />

class SelectionItemFace implements SelectionItem
{
    public EntityId: string;

    public MatchTag: number;

    public SelectionType : SelectionType;

    public FaceIndex: number;

    public N1: number;

    public N2: number;

    public N3: number;

    constructor(ent: THREE.Object3D, faceIndex: number, v1: number, v2: number, v3: number, matchTag: number)
    {
        this.EntityId = ent.uuid;
        this.N1 = v1;
        this.N2 = v2;
        this.N3 = v3;
        this.FaceIndex = faceIndex;

        this.SelectionType = SelectionType.Face;
        this.MatchTag = matchTag;
    }

    public GetId() : string
    {
        return "Face" + this.EntityId
            + this.N1 + this.N2 + this.N3;
    }

    public GetCenter(geometry: THREE.Geometry): THREE.Vector3
    {
        var verts = geometry.vertices;
        var v1 = verts[this.N1];
        var v2 = verts[this.N2];
        var v3 = verts[this.N3];
        return v1.clone().add(v2).add(v3).divideScalar(3);
    }
}
