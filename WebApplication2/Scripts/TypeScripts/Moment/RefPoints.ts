/// <reference path="../_reference.d.ts" />
/// <reference path="../App.ts" />

class RefPoints {
    private _mesh: THREE.Mesh;

    private _grid: THREE.GridHelper;

    private _params: RefpOintParameters;

    private _skinMesh: SkinMesh;

    constructor(skinMesh: SkinMesh, model: RefPointModel) {
       
        var layout = App.Layout;
        var scene = App.Layout.Scene;

        model.Name = this.GetUniqueName(model.Name);

        this._params = new RefpOintParameters(model);
        this._skinMesh = skinMesh;       
     

        this._mesh = this._skinMesh.ConvertToMesh(EntityType.ReferencePoint);
        //var refPointEnt = new RefPointEntity();
        //refPointEnt.uuid = this.SkinMesh.EntityId;
        //scene.add(refPointEnt);
        //scene.add(this._mesh);

         var objData = GetObjectData(this._mesh);
        objData.Tag = this._params;
        var refPointEnt = new RefPointEntity();
        refPointEnt.uuid = this._skinMesh.EntityId;
        refPointEnt.userData = objData.Tag;
        scene.add(refPointEnt);

        if (this._skinMesh.Transformation) {
            var matrix = this._skinMesh.Transformation.ToMatrix4();
            refPointEnt.applyMatrix(matrix);
        }

        //var material = Rendering.GetMeshMaterial(MeshMaterialType.Default);
        //this._mesh.material = material;

        //this._mesh.geometry.computeBoundingBox();
        //var boxSize = this._mesh.geometry.boundingBox.size();
        //var gridSize = Math.max(boxSize.x, boxSize.y, boxSize.z) * 1.5;

        //this._grid = new THREE.GridHelper(gridSize, gridSize / 5);
        //this._grid.setColors(0x000000, 0x0000AA);
        //this._grid.rotateX(3.14 / 2);
        //this._grid.userData = new ObjectData(EntityType.ReferencePointgrid, false);
        //this._mesh.add(this._grid);

        //Rendering.SetRenderingMode(Rendering.GetRenderingMode());
    }

    public static Create(skinMesh: SkinMesh, model: RefPointModel): RefPoints {
        if (!(skinMesh instanceof SkinMesh)) {
            // Convert from object to exact type
            skinMesh = SkinMesh.CreateFromObject(skinMesh);
        }
        var mesh = skinMesh.ConvertToMesh(EntityType.ReferencePoint);
        var layout = App.Layout;
        var scene = layout.Scene;

        var RefPointtool = new RefPoints(skinMesh, model);
      //  RefPointtool.ApplyMatrix(skinMesh.Transformation.ToMatrix4());

        return RefPointtool;

    }

    public GetBoundingBox(): THREE.Box3 {
        var box = this._mesh.geometry.boundingBox.clone();
        box.applyMatrix4(this._mesh.matrixWorld);
        return box;
    }

    public ApplyMatrix(mat: THREE.Matrix4) {
        this._mesh.applyMatrix(mat);
    }

    private GetUniqueName(preferName: string): string {
        // Collect all exist BC tool names
        //
        var names = new Array<string>();
        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.BCTool);
        for (var entIdx in ents) {
            var ent = <THREE.Mesh>ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof BCToolParameters)) {
                throw new Error("BC Tool entity contains not valid internal data");
            }
            var bcParams = <BCToolParameters>objData.Tag;
            names.push(bcParams.Model.Name);
        }

        var testName = preferName;
        var counter = 1;
        while (_.contains(names, testName)) {
            counter++;
            testName = "BC Tool " + counter.toString();
        }
        return testName;
    }
}


class RefPointModel {
    public Name: string;
    public x: number;
    public y: number;
    public z: number;

    constructor() {
        this.Name = "";
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    public Clone(): RefPointModel {
        // Deep copy
        var newObject = jQuery.extend(true, {}, this);
        return newObject;
    }
}
class RefpOintParameters {
    public Model: RefPointModel;

    constructor(model: RefPointModel) {
        this.Model = model;
    }
}