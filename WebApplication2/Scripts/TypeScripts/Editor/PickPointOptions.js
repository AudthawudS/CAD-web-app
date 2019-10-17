/// <reference path="../_reference.d.ts" />
var PickPointOptions = /** @class */ (function () {
    function PickPointOptions(msg) {
        this.Message = msg;
        this.BasePoint = null;
        this.MouseMove = null;
        this.IsSnapEnabled = true;
        this.SnapTolerancePx = 20; // 20px
        this.PlaneType = PlaneEditorType.XY;
    }
    return PickPointOptions;
}());
