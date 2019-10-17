/// <reference path="../_reference.d.ts" />
/// <reference path="./IOperation.ts" />

class OperationCamera implements IOperation
{
    private _position: THREE.Vector3;

    private _target: THREE.Vector3;

    private _up: THREE.Vector3;

    constructor()
    {
        var camera = App.Layout.Camera;
        var controls = App.Layout.Controls;

        this._position = camera.position.clone();
        this._up = camera.up.clone();
        this._target = controls.target.clone();
    }

    public IsEqual(other: OperationCamera) : boolean
    {
        if (this._position.equals(other._position) &&
            this._target.equals(other._target))
        {
            return true;
        }
        return false;
    }

    public Apply()
    {
        var camera = App.Layout.Camera;
        var controls = App.Layout.Controls;

        camera.position.set(this._position.x, this._position.y, this._position.z);
        camera.up.set(this._up.x, this._up.y, this._up.z);
        controls.target.set(this._target.x, this._target.y, this._target.z);
    }

    public Undo()
    {
        // none
    }
}