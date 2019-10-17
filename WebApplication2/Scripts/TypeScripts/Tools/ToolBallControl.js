/// <reference path="../_reference.d.ts" />
/// <reference path="./ITool.ts" />
/// <reference path="../_reference.d.ts" />
var ToolBallControl = /** @class */ (function () {
    function ToolBallControl() {
    }
    ToolBallControl.prototype.Start = function () {
        App.Layout.Controls.enabled = false;
        App.Layout.ControlsTrackball.noZoom = false;
        App.Layout.ControlsTrackball.noPan = false;
        App.Layout.ControlsTrackball.noRotate = false;
        App.Layout.ControlsTrackball.enabled = true;
        App.Layout.SetCursor("default");
    };
    ToolBallControl.prototype.End = function () {
        App.Layout.Controls.enabled = true;
        App.Layout.ControlsTrackball.noZoom = true;
        App.Layout.ControlsTrackball.noPan = true;
        App.Layout.ControlsTrackball.noRotate = true;
        App.Layout.ControlsTrackball.enabled = false;
        App.Layout.Camera.up.set(0, 0, 1);
    };
    ToolBallControl.prototype.MouseDown = function (evt) {
    };
    ToolBallControl.prototype.MouseMove = function (evt) {
    };
    ToolBallControl.prototype.MouseUp = function (evt) {
    };
    ToolBallControl.prototype.KeyDown = function (evt) {
    };
    return ToolBallControl;
}());
