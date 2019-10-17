/// <reference path="../_reference.d.ts" />

class SelectionItemEntity implements SelectionItem
{
    public EntityId: string;

    public MatchTag: number;

    public refname: string;

    public SelectionType : SelectionType;

    constructor(ent: THREE.Object3D)
    {
        this.EntityId = ent.uuid;
        this.MatchTag = -1;
        this.refname = ent.name;
        this.SelectionType = SelectionType.Entity;
    }

    public GetId() : string
    {
        return "Entity" + this.EntityId;
    }

    public GetCenter(): THREE.Vector3
    {
        var ent = App.Layout.GetEntityById(this.EntityId);
        if(!((<any>ent).geometry instanceof THREE.Geometry))
        {
            return new THREE.Vector3();
        }
        var geom = <THREE.Geometry>((<any>ent).geometry);
        return geom.boundingBox.center();
    }

}