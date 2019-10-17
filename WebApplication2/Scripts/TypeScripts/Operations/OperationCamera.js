/// <reference path="../_reference.d.ts" />
/// <reference path="./IOperation.ts" />
var OperationCamera = /** @class */ (function () {
    function OperationCamera() {
        var camera = App.Layout.Camera;
        var controls = App.Layout.Controls;
        this._position = camera.position.clone();
        this._up = camera.up.clone();
        this._target = controls.target.clone();
    }
    OperationCamera.prototype.IsEqual = function (other) {
        if (this._position.equals(other._position) &&
            this._target.equals(other._target)) {
            return true;
        }
        return false;
    };
    OperationCamera.prototype.Apply = function () {
        var camera = App.Layout.Camera;
        var controls = App.Layout.Controls;
        camera.position.set(this._position.x, this._position.y, this._position.z);
        camera.up.set(this._up.x, this._up.y, this._up.z);
        controls.target.set(this._target.x, this._target.y, this._target.z);
    };
    OperationCamera.prototype.Undo = function () {
        // none
    };
    return OperationCamera;
}());
