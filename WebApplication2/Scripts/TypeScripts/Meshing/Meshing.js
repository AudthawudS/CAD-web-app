/// <reference path="../_reference.d.ts" />
/// <reference path="../Tasks/Taskmanager.ts" />
/// <reference path="../Progress/ProgressToken.ts" />
var MeshingClass = /** @class */ (function () {
    function MeshingClass() {
        var meshing = this;
    }
    MeshingClass.prototype.Run = function (meshingSize, proximityMeshSize, imprOptions, doneCallback) {
        var meshing = this;
        var engine = "SimMesh";
        var self = this;
        $.post("/Meshing?engine=" + engine + "&meshSize=" + meshingSize + "&proximitySize=" + proximityMeshSize, JSON.stringify(imprOptions), function (data, textStatus) {
            if (doneCallback) {
                if (!doneCallback(data)) {
                    // prevent next handling. In this case cancel can be called
                    return;
                }
            }
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self.LoadMesh(function () {
                App.Layout.ZoomToFit(false);
            });
            App.Ribbon.GotoEditor();
        })
            .fail(function () {
            if (doneCallback) {
                doneCallback(null);
            }
        });
    };
    MeshingClass.prototype.Run1 = function (meshingSize, proximityMeshSize, imprOptions, doneCallback) {
        var meshing = this;
        var engine = "SimMesh";
        var self = this;
        //$.post(
        //    "/Meshing?engine=" + engine + "&meshSize=" + meshingSize + "&proximitySize=" + proximityMeshSize,
        //    JSON.stringify(imprOptions),
        //    function (data, textStatus) {
        //        if (doneCallback) {
        //            if (!doneCallback(data)) {
        //                // prevent next handling. In this case cancel can be called
        //                return;
        //            }
        //        }
        //        if (!ErrorHandler.CheckJsonRes(data)) {
        //            return;
        //        }
        self.LoadMesh1(function () {
            App.Layout.ZoomToFit(false);
        });
        App.Ribbon.GotoEditor();
        //})
        //.fail(function () {
        //    if (doneCallback) {
        //        doneCallback(null);
        //    }
        //});
    };
    MeshingClass.prototype.LoadMesh = function (doneCallback) {
        var self = this;
        var layout = App.Layout;
        var scene = App.Layout.Scene;
        var servTask = TaskManager.Instance.CreateTask("Import mesh...");
        var loader = new SkinMeshLoader();
        loader.Load('/Meshing/GetMesh?tmp=' + Number(new Date()), function (skinMesh) {
            TaskManager.Instance.RemoveTask(servTask);
            var material = Rendering.GetMeshMaterial(MeshMaterialType.Default);
            // remove previous meshes
            self.RemoveMeshes();
            // Add new mesh
            //
            var mesh = skinMesh.ConvertToMesh(EntityType.Mesh);
            mesh.material = material;
            scene.add(mesh);
            // calculate bounding box
            mesh.geometry.computeBoundingBox();
            // Create grid
            if (Settings.IsGridEnabled) {
                Rendering.EnableGrid(true);
            }
            layout.AddLight();
            Rendering.SetRenderingMode(RenderingModeType.ShadingEdge);
            Project.IsDirty = true;
            if (doneCallback) {
                doneCallback();
            }
            return;
        }, function () {
            // Error handler
            TaskManager.Instance.RemoveTask(servTask);
            return;
        });
    };
    MeshingClass.prototype.LoadMesh1 = function (doneCallback) {
        debugger;
        var self = this;
        var layout = App.Layout;
        var scene = App.Layout.Scene;
        var servTask = TaskManager.Instance.CreateTask("Import mesh...");
        var loader = new SkinMeshLoader();
        loader.Load('/Meshing/GetMesh1?tmp=' + Number(new Date()), function (skinMesh) {
            TaskManager.Instance.RemoveTask(servTask);
            debugger;
            var material = Rendering.GetMeshMaterial(MeshMaterialType.Default);
            // remove previous meshes
            self.RemoveMeshes();
            // Add new mesh
            //
            var mesh = skinMesh.ConvertToMesh(EntityType.Mesh);
            mesh.material = material;
            scene.add(mesh);
            // calculate bounding box
            mesh.geometry.computeBoundingBox();
            // Create grid
            if (Settings.IsGridEnabled) {
                Rendering.EnableGrid(true);
            }
            layout.AddLight();
            Rendering.SetRenderingMode(RenderingModeType.ShadingEdge);
            Project.IsDirty = true;
            if (doneCallback) {
                doneCallback();
            }
            return;
        }, function () {
            // Error handler
            TaskManager.Instance.RemoveTask(servTask);
            return;
        });
    };
    MeshingClass.prototype.RemoveMeshes = function () {
        var self = this;
        var ents = App.Layout.GetEntitiesByType(EntityType.Mesh);
        ents.forEach(function (ent) {
            App.Layout.Scene.remove(ent);
        });
    };
    return MeshingClass;
}());
var Meshing;
$(document).ready(function () {
    // Create instance
    Meshing = new MeshingClass();
});
