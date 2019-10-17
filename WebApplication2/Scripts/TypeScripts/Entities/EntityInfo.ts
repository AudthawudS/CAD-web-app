/// <reference path="../_reference.d.ts" />

class EntityInfo
{
    public EntType: EntityType;

    public SkinMesh: SkinMesh;

    ////////// BC TOOL REGION ///////////////

    public BCToolModel: BoundCondModel;
    public RefPointModel: RefPointModel;

    //////////////////////////////////////

    constructor(skinMesh: SkinMesh, entType: EntityType)
    {
        this.SkinMesh = skinMesh;
        this.EntType = entType;
    }
}