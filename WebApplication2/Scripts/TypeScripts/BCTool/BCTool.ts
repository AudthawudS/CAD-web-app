/// <reference path="../_reference.d.ts" />
/// <reference path="../App.ts" />

class BCTool
{
    private _mesh:THREE.Mesh;

    private _grid:THREE.GridHelper;

    private _params: BCToolParameters;

    private _skinMesh : SkinMesh;

    constructor(skinMesh : SkinMesh, model:BoundCondModel)
    {
        var layout = App.Layout;
        var scene = App.Layout.Scene;

        model.Name = this.GetUniqueName(model.Name);

        this._params = new BCToolParameters(model);
        this._skinMesh = skinMesh;

        this._mesh = this._skinMesh.ConvertToMesh(EntityType.BCTool);
        scene.add(this._mesh);

        var objData = GetObjectData(this._mesh);
        objData.Tag = this._params;

        var material = Rendering.GetMeshMaterial(MeshMaterialType.Default);
        this._mesh.material = material;

        this._mesh.geometry.computeBoundingBox();
        var boxSize = this._mesh.geometry.boundingBox.size();
        var gridSize = Math.max(boxSize.x, boxSize.y, boxSize.z) * 1.5;

        this._grid = new THREE.GridHelper(gridSize, gridSize / 5);
        this._grid.setColors(0x000000, 0x0000AA);
        this._grid.rotateX(3.14 / 2);
        this._grid.userData = new ObjectData(EntityType.BCToolGrid, false);
        this._mesh.add(this._grid);

        Rendering.SetRenderingMode(Rendering.GetRenderingMode());
    }

    public static Create(skinMesh:SkinMesh, model:BoundCondModel):BCTool
    {
        if (!(skinMesh instanceof SkinMesh))
        {
            // Convert from object to exact type
            skinMesh = SkinMesh.CreateFromObject(skinMesh);
        }
        var mesh = skinMesh.ConvertToMesh(EntityType.BCTool);

        var layout = App.Layout;
        var scene = layout.Scene;

        var bcTool = new BCTool(skinMesh, model);
        bcTool.ApplyMatrix(skinMesh.Transformation.ToMatrix4());

        return bcTool;
    }

    public GetBoundingBox():THREE.Box3
    {
        var box = this._mesh.geometry.boundingBox.clone();
        box.applyMatrix4(this._mesh.matrixWorld);
        return box;
    }

    public ApplyMatrix(mat:THREE.Matrix4)
    {
        this._mesh.applyMatrix(mat);
    }

    private GetUniqueName(preferName: string) : string
    {
        // Collect all exist BC tool names
        //
        var names = new Array<string>();
        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.BCTool);
        for (var entIdx in ents)
        {
            var ent = <THREE.Mesh>ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof BCToolParameters))
            {
                throw new Error("BC Tool entity contains not valid internal data");
            }
            var bcParams = <BCToolParameters>objData.Tag;
            names.push(bcParams.Model.Name);
        }

        var testName = preferName;
        var counter = 1;
        while (_.contains(names, testName))
        {
            counter++;
            testName = "BC Tool " + counter.toString();
        }
        return testName;
    }
}


class BoundCondModel
{
    public Name : string;

    public DiameterShaft:number;

    public HeightTopSphere:number;

    public DistanceCenterTop:number;

    public DiameterLargeSphere:number;

    public DiametrHole:number;

    public DistanceFlat:number;

    public DistanceCenterBottom: number;

    constructor()
    {
        this.Name = "BC Tool 1";
        this.DiameterShaft = 8;
        this.HeightTopSphere = 2;
        this.DistanceCenterTop = 12;
        this.DiameterLargeSphere = 15;
        this.DiametrHole = 2;
        this.DistanceFlat = 2;
        this.DistanceCenterBottom = 3;
    }

    public Clone(): BoundCondModel
    {
        // Deep copy
        var newObject = jQuery.extend(true, {}, this);
        return newObject;
    }
}

class BCToolParameters
{
    public Model:BoundCondModel;

    constructor(model:BoundCondModel)
    {
        this.Model = model;
    }
}