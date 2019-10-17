/// <reference path="../_reference.d.ts" />
/// <reference path="./IOperation.ts" />

class OperationDelete implements IOperation
{
    private _object: THREE.Object3D;

    constructor(obj: THREE.Object3D)
    {
        this._object = obj;
    }

    public Apply(): void
    {
        var self = this;
        if (_.contains(App.Layout.Scene.children, self._object))
        {
            App.Layout.Scene.remove(self._object);
        }
    }

    public Undo()
    {
        var self = this;
        if (!_.contains(App.Layout.Scene.children, self._object))
        {
            App.Layout.Scene.add(self._object);
        }
    }
}