/// <reference path="../_reference.d.ts" />
/// <summary>
/// Should be sync with EntityType.cs
/// Note: add only to end of enum
/// </summary>
var EntityType;
(function (EntityType) {
    EntityType[EntityType["Unknown"] = 0] = "Unknown";
    EntityType[EntityType["Selection"] = 1] = "Selection";
    EntityType[EntityType["Grid"] = 2] = "Grid";
    EntityType[EntityType["NavigationCube"] = 3] = "NavigationCube";
    EntityType[EntityType["NavigationArrows"] = 4] = "NavigationArrows";
    EntityType[EntityType["Model"] = 5] = "Model";
    EntityType[EntityType["Mesh"] = 6] = "Mesh";
    EntityType[EntityType["BCTool"] = 7] = "BCTool";
    EntityType[EntityType["BCToolGrid"] = 8] = "BCToolGrid";
    EntityType[EntityType["TriSurface"] = 9] = "TriSurface";
    EntityType[EntityType["ForceArrow"] = 10] = "ForceArrow";
    EntityType[EntityType["FixedSymb"] = 11] = "FixedSymb";
    EntityType[EntityType["MomentSymb"] = 12] = "MomentSymb";
    EntityType[EntityType["ReferencePoint"] = 13] = "ReferencePoint";
    EntityType[EntityType["ReferencePointgrid"] = 14] = "ReferencePointgrid";
})(EntityType || (EntityType = {}));
var ObjectData = /** @class */ (function () {
    function ObjectData(entType, isSystem) {
        this.IsSystem = isSystem;
        this.EntityType = entType;
    }
    return ObjectData;
}());
function IsObjectData(obj) {
    return obj instanceof ObjectData;
}
function GetObjectData(objEnt) {
    if (!IsObjectData(objEnt.userData)) {
        return null;
    }
    return objEnt.userData;
}
function GetEntityType(objEnt) {
    var objData = GetObjectData(objEnt);
    if (objData == null) {
        return EntityType.Unknown;
    }
    if (objData.EntityType == undefined) {
        return EntityType.Unknown;
    }
    return objData.EntityType;
}
