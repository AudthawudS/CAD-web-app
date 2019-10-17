/// <reference path="../_reference.d.ts" />
/// <reference path="../App.ts" />
var BCTool = /** @class */ (function () {
    function BCTool(skinMesh, model) {
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
    BCTool.Create = function (skinMesh, model) {
        if (!(skinMesh instanceof SkinMesh)) {
            // Convert from object to exact type
            skinMesh = SkinMesh.CreateFromObject(skinMesh);
        }
        var mesh = skinMesh.ConvertToMesh(EntityType.BCTool);
        var layout = App.Layout;
        var scene = layout.Scene;
        var bcTool = new BCTool(skinMesh, model);
        bcTool.ApplyMatrix(skinMesh.Transformation.ToMatrix4());
        return bcTool;
    };
    BCTool.prototype.GetBoundingBox = function () {
        var box = this._mesh.geometry.boundingBox.clone();
        box.applyMatrix4(this._mesh.matrixWorld);
        return box;
    };
    BCTool.prototype.ApplyMatrix = function (mat) {
        this._mesh.applyMatrix(mat);
    };
    BCTool.prototype.GetUniqueName = function (preferName) {
        // Collect all exist BC tool names
        //
        var names = new Array();
        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.BCTool);
        for (var entIdx in ents) {
            var ent = ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof BCToolParameters)) {
                throw new Error("BC Tool entity contains not valid internal data");
            }
            var bcParams = objData.Tag;
            names.push(bcParams.Model.Name);
        }
        var testName = preferName;
        var counter = 1;
        while (_.contains(names, testName)) {
            counter++;
            testName = "BC Tool " + counter.toString();
        }
        return testName;
    };
    return BCTool;
}());
var BoundCondModel = /** @class */ (function () {
    function BoundCondModel() {
        this.Name = "BC Tool 1";
        this.DiameterShaft = 8;
        this.HeightTopSphere = 2;
        this.DistanceCenterTop = 12;
        this.DiameterLargeSphere = 15;
        this.DiametrHole = 2;
        this.DistanceFlat = 2;
        this.DistanceCenterBottom = 3;
    }
    BoundCondModel.prototype.Clone = function () {
        // Deep copy
        var newObject = jQuery.extend(true, {}, this);
        return newObject;
    };
    return BoundCondModel;
}());
var BCToolParameters = /** @class */ (function () {
    function BCToolParameters(model) {
        this.Model = model;
    }
    return BCToolParameters;
}());
