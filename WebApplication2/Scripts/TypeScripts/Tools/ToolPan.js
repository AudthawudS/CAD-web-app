/// <reference path="../_reference.d.ts" />
/// <reference path="../App.ts" />
var ToolPan = /** @class */ (function () {
    function ToolPan() {
    }
    ToolPan.prototype.Start = function () {
        App.Layout.Controls.enabled = true;
        App.Layout.Controls.resetState(); //owner custom function
        App.Layout.SetCursor("move");
      //  UIInteractive.Instance.SetMessage("Use left button of mouse for Pan and right button for Rotate");
    };
    ToolPan.prototype.End = function () {
        //UIInteractive.Instance.SetMessage(null);
    };
    ToolPan.prototype.MouseDown = function (evt) { };
    ToolPan.prototype.MouseMove = function (evt) { };
    ToolPan.prototype.MouseUp = function (evt) { };
    ToolPan.prototype.KeyDown = function (evt) { };
    return ToolPan;
}());
