/// <reference path="../_reference.d.ts" />
var ToolDelete = /** @class */ (function () {
    function ToolDelete() {
    }
    ToolDelete.prototype.Start = function () {
        App.Layout.Controls.enabled = true;
        App.Layout.SetCursor("pointer");
    };
    ToolDelete.prototype.End = function () {
        App.Layout.SetCursor("default");
    };
    ToolDelete.prototype.MouseDown = function (evt) {
        if (evt.button == 0) {
            // Disable orbit control on left mouse
            App.Layout.Controls.enabled = false;
        }
    };
    ToolDelete.prototype.MouseUp = function (evt) {
        var layout = App.Layout;
        // Enable orbit control on up event
        App.Layout.Controls.enabled = true;
        var mousePos = new THREE.Vector2(evt.clientX, evt.clientY);
        var offset = new THREE.Vector2(5, 5);
        var rect = new THREE.Box2(mousePos.clone().sub(offset), mousePos.clone().add(offset));
        var pickEnt = layout.Selector.GetEntityByScreenRect(rect);
        if (pickEnt == null) {
            return;
        }
        App.Layout.Scene.remove(pickEnt);
    };
    ToolDelete.prototype.MouseMove = function (evt) {
    };
    ToolDelete.prototype.KeyDown = function (evt) {
    };
    return ToolDelete;
}());
