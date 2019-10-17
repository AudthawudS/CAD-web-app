/// <reference path="../_reference.d.ts" />

/// <summary>
/// Should be sync with EntityType.cs
/// Note: add only to end of enum
/// </summary>
enum EntityType
{
    Unknown,
    Selection,
    Grid,
    NavigationCube,
    NavigationArrows,
    Model,
    Mesh,
    BCTool,
    BCToolGrid,
    TriSurface,
    ForceArrow,
    FixedSymb,
    MomentSymb,
    ReferencePoint,
    ReferencePointgrid
}

class ObjectData
{
    public IsSystem: boolean;

    public EntityType: EntityType;

    public Edges: Array<EdgeIndex>;

    public Elements: Array<FRDElement>;

    public Tag: any;

    constructor(entType: EntityType, isSystem: boolean)
    {
        this.IsSystem = isSystem;
        this.EntityType = entType;
    }
}

function IsObjectData(obj: any)
{
    return obj instanceof ObjectData;
}

function GetObjectData(objEnt: THREE.Object3D): ObjectData
{
    if (!IsObjectData(objEnt.userData))
    {
        return null;
    }
    return <ObjectData>objEnt.userData;
}

function GetEntityType(objEnt: THREE.Object3D): EntityType
{
    var objData = GetObjectData(objEnt);
    if (objData == null)
    {
        return EntityType.Unknown;
    }
    if (objData.EntityType == undefined)
    {
        return EntityType.Unknown;
    }
    return objData.EntityType;
}