/// <reference path="../_reference.d.ts" />
/// <reference path="../App.ts" />
var RefPoints = /** @class */ (function () {
    function RefPoints(skinMesh, model) {
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
    RefPoints.Create = function (skinMesh, model) {
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
    };
    RefPoints.prototype.GetBoundingBox = function () {
        var box = this._mesh.geometry.boundingBox.clone();
        box.applyMatrix4(this._mesh.matrixWorld);
        return box;
    };
    RefPoints.prototype.ApplyMatrix = function (mat) {
        this._mesh.applyMatrix(mat);
    };
    RefPoints.prototype.GetUniqueName = function (preferName) {
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
    return RefPoints;
}());
var RefPointModel = /** @class */ (function () {
    function RefPointModel() {
        this.Name = "";
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    RefPointModel.prototype.Clone = function () {
        // Deep copy
        var newObject = jQuery.extend(true, {}, this);
        return newObject;
    };
    return RefPointModel;
}());
var RefpOintParameters = /** @class */ (function () {
    function RefpOintParameters(model) {
        this.Model = model;
    }
    return RefpOintParameters;
}());
