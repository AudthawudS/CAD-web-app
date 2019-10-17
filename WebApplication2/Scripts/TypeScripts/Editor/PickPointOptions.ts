/// <reference path="../_reference.d.ts" />

class PickPointOptions
{
    public Message: string;

    public BasePoint: THREE.Vector3;

    public IsSnapEnabled: boolean;

    public SnapTolerancePx: number;

    public PlaneType: PlaneEditorType;

    public MouseMove: (options: PickPointOptions, screenPnt: THREE.Vector2, worldPnt: THREE.Vector3) => void;

    constructor(msg: string)
    {
        this.Message = msg;
        this.BasePoint = null;
        this.MouseMove = null;
        this.IsSnapEnabled = true;
        this.SnapTolerancePx = 20;// 20px
        this.PlaneType = PlaneEditorType.XY;
    }

}