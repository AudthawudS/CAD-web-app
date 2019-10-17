/// <reference path="../_reference.d.ts" />

class PickPointRes
{
    public Point: THREE.Vector3;

    public PlaneType: PlaneEditorType;

    constructor(point: THREE.Vector3, planeType: PlaneEditorType)
    {
        this.Point = point;
        this.PlaneType = planeType;
    }
}