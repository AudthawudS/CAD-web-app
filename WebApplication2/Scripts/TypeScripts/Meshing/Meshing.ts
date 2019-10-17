/// <reference path="../_reference.d.ts" />
/// <reference path="../Tasks/Taskmanager.ts" />
/// <reference path="../Progress/ProgressToken.ts" />

class MeshingClass
{
    constructor()
    {
        var meshing = this;
    }

    public Run(meshingSize: number, proximityMeshSize: number, imprOptions: MeshingImproveOptions, doneCallback: (data) => boolean)
    {
        var meshing = this;

        var engine = "SimMesh";

        var self = this;

        $.post(
            "/Meshing?engine=" + engine + "&meshSize=" + meshingSize + "&proximitySize=" + proximityMeshSize,
            JSON.stringify(imprOptions),
            function (data, textStatus)
            {
                if (doneCallback)
                {
                    if (!doneCallback(data))
                    {
                        // prevent next handling. In this case cancel can be called
                        return;
                    }
                }

                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self.LoadMesh(() =>
                {
                    App.Layout.ZoomToFit(false);
                });

                App.Ribbon.GotoEditor();
            })
            .fail(function ()
            {
                if (doneCallback)
                {
                    doneCallback(null);
                }
            });
    }

    public Run1(meshingSize: number, proximityMeshSize: number, imprOptions: MeshingImproveOptions, doneCallback: (data) => boolean) {
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

                self.LoadMesh1(() => {
                    App.Layout.ZoomToFit(false);
                });

                App.Ribbon.GotoEditor();
            //})
            //.fail(function () {
            //    if (doneCallback) {
            //        doneCallback(null);
            //    }
            //});
    }

    public LoadMesh(doneCallback: () => void)
    {
        var self = this;
        var layout = App.Layout;
        var scene = App.Layout.Scene;

        var servTask = TaskManager.Instance.CreateTask("Import mesh...");

        var loader = new SkinMeshLoader();
        loader.Load(
            '/Meshing/GetMesh?tmp=' + Number(new Date()),
            (skinMesh: SkinMesh) =>
            {
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
                if (Settings.IsGridEnabled)
                {
                    Rendering.EnableGrid(true);
                }

                layout.AddLight();

                Rendering.SetRenderingMode(RenderingModeType.ShadingEdge);

                Project.IsDirty = true;

                if (doneCallback)
                {
                    doneCallback();
                }

                return;
            },
            () => 
            {
                // Error handler
                TaskManager.Instance.RemoveTask(servTask);
                return;
            });
    }
    public LoadMesh1(doneCallback: () => void) {
        debugger;
        var self = this;
        var layout = App.Layout;
        var scene = App.Layout.Scene;

        var servTask = TaskManager.Instance.CreateTask("Import mesh...");

        var loader = new SkinMeshLoader();
        loader.Load(
            '/Meshing/GetMesh1?tmp=' + Number(new Date()),
            (skinMesh: SkinMesh) => {
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
            },
            () => {
                // Error handler
                TaskManager.Instance.RemoveTask(servTask);
                return;
            });
    }

    private RemoveMeshes()
    {
        var self = this;
        var ents = App.Layout.GetEntitiesByType(EntityType.Mesh);
        ents.forEach((ent) =>
        {
            App.Layout.Scene.remove(ent);
        });    
    }

}


var Meshing: MeshingClass;

$(document).ready(function ()
{
    // Create instance
    Meshing = new MeshingClass();
});