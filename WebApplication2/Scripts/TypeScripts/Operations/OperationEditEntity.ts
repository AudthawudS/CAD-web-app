/// <reference path="../_reference.d.ts" />
/// <reference path="./IOperation.ts" />

class OperationEditEntity implements IOperation
{
    private _transforms: IHashtable<string, THREE.Matrix4>;

    constructor()
    {
        this._transforms = new Hashtable<string, THREE.Matrix4>();

        var ents = App.Layout.Scene.children;
        for (var idx in ents)
        {
            var ent = ents[idx];
            if (!(ent instanceof THREE.Mesh))
            {
                continue;
            }
            var matrix = ent.matrix.clone();

            this._transforms.put(ent.uuid, matrix);            
        }
    }

    public Apply(): void
    {
        var ents = App.Layout.Scene.children;
        for (var idx in ents)
        {
            var ent = ents[idx];

            if (!(ent instanceof THREE.Mesh))
            {
                continue;
            }

            if (this._transforms.containsKey(ent.uuid))
            {
                var opMat = this._transforms.get(ent.uuid).clone();
                ent.matrix.identity();
                ent.applyMatrix(opMat);
                ent.matrixWorldNeedsUpdate = true;
            }
        }
    }

    public Undo()
    {
        // none
    }
}