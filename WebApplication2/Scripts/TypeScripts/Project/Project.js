/// <reference path="../_reference.d.ts" />
/// <reference path="../Entities/EntityInfo.ts" />
/// <reference path="../Project/ProjectController.ts" />
/// <reference path="../Import/Import.ts" />
var ProjectClass = /** @class */ (function () {
    function ProjectClass() {
        this.ProjectName = null;
        this.Legend = new Legend();
        this.Changed = new CEvent();
        this.IsDirty = false;
    }
    ProjectClass.prototype.OpenDialog = function () {
        var self = this;
        if (self.IsDirty) {
            ConfirmBox.Confirm("Save changes?", function (isAccept) {
                if (isAccept) {
                    Project.SaveDialog(function () {
                        self.OpenSelectProjectsDialog();
                    });
                }
                else {
                    self.OpenSelectProjectsDialog();
                }
            });
        }
        else {
            self.OpenSelectProjectsDialog();
        }
    };
    ProjectClass.prototype.OpenSelectProjectsDialog = function () {
        var self = this;
        $.getJSON("/Project/GetProjects", function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            var projectsNames = data;
            ProjectController.Instance.ShowOpenDialog(projectsNames, function (projName) {
                self.Open(projName);
            });
        });
    };
    ProjectClass.prototype.Open = function (projName) {
        var self = this;
        self.Clear();
        self.ProjectName = projName;
        var serverTask = TaskManager.Instance.CreateTask("Open project...");
        $.post("Project/Open?name=" + projName, function (data) {
            TaskManager.Instance.RemoveTask(serverTask);
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            App.Ribbon.SetTitle(projName);
            var layout = App.Layout;
            var scene = App.Layout.Scene;
            var storage = (data);
            var entsInfs = storage.EntitiesInfo;
            for (var idx in entsInfs) {
                var entInfo = entsInfs[idx];
                if (entInfo.SkinMesh) {
                    // At moment entInfo.SkinMesh is object, not instance of SkinMesh
                    var skinMesh = SkinMesh.CreateFromObject(entInfo.SkinMesh);
                    entInfo.SkinMesh = skinMesh;
                }
                if (entInfo.EntType == EntityType.Mesh) {
                    var mesh = entInfo.SkinMesh.ConvertToMesh(entInfo.EntType);
                    mesh.material = Rendering.GetMeshMaterial(MeshMaterialType.Default);
                    scene.add(mesh);
                    if (entInfo.SkinMesh.Transformation) {
                        var matrix = entInfo.SkinMesh.Transformation.ToMatrix4();
                        mesh.applyMatrix(matrix);
                    }
                }
                else if (entInfo.EntType == EntityType.ReferencePoint) {
                    debugger;
                    var refPointEnt = new RefPointEntity();
                    refPointEnt.uuid = entInfo.SkinMesh.EntityId;
                    var refmodel = entInfo.RefPointModel;
                    var _params = new RefpOintParameters(refmodel);
                    var userData = new ObjectData(EntityType.ReferencePoint, false);
                    userData.Tag = _params;
                    //var objData = GetObjectData(mesh);
                    //objData.Tag = _params;
                    refPointEnt.userData = userData;
                    scene.add(refPointEnt);
                    if (entInfo.SkinMesh.Transformation) {
                        var matrix = entInfo.SkinMesh.Transformation.ToMatrix4();
                        refPointEnt.applyMatrix(matrix);
                    }
                }
                else if (entInfo.EntType == EntityType.BCTool) {
                    var model = entInfo.BCToolModel;
                    if (!model) {
                        //throw new Error("Model for BC tool not found");
                        continue;
                    }
                    BCTool.Create(entInfo.SkinMesh, model);
                }
            }
            // Update legend
            self.Legend = storage.Legend;
            LegendController.UpdateScope(self.Legend);
            // Update SetUps and Groups
            TabGroups.Refresh();
            TabSetUpsController.Instance.Refresh();
            //  RefPointController.Instance.Update();
            // Create grid
            //
            if (Settings.IsGridEnabled) {
                Rendering.EnableGrid(true);
            }
            // Update rendering view
            Rendering.SetRenderingMode(Rendering.GetRenderingMode());
            // Add light
            layout.AddLight();
            layout.ZoomToFit(false);
            App.Ribbon.GotoEditor();
            ForceManager.Recreate();
            self.IsDirty = false;
            self.Changed.fire(projName);
        });
    };
    ProjectClass.prototype.Clear = function () {
        var self = this;
        self.ProjectName = null;
        self.IsDirty = false;
        self.Legend = new Legend();
        App.Layout.SetTool(new ToolPan());
        FEAAnimation.StopAnimation();
        FEAAnimation.Reset();
        App.Layout.RemoveEnts();
        self.Changed.fire("");
    };
    ProjectClass.prototype.New = function () {
        var self = this;
        if (self.IsDirty) {
            ConfirmBox.Confirm("Save changes?", function (isAccept) {
                if (isAccept) {
                    Project.SaveDialog(function () {
                        self.NewProjectExecute();
                    });
                }
                else {
                    self.NewProjectExecute();
                }
            });
        }
        else {
            self.NewProjectExecute();
        }
    };
    ProjectClass.prototype.NewProjectExecute = function () {
        var self = this;
        this.Clear();
        $.post("Project/CreateNew", function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            App.Ribbon.SetTitle("Untitled");
            LegendController.UpdateScope(self.Legend);
            TabGroups.Refresh();
            MessageBox.ShowMessage("New Project Created");
            self.Changed.fire("");
            ImportController.Instance.Clear();
            App.Ribbon.GotoImport();
            self.IsDirty = false;
        });
    };
    ProjectClass.prototype.SaveDialog = function (doneCallback) {
        var self = this;
        if (self.ProjectName != null) {
            // Save without any dialog
            self.Save(self.ProjectName, doneCallback);
            return;
        }
        ProjectController.Instance.ShowSaveDialog(function (name) {
            self.Save(name, doneCallback);
        });
    };
    ProjectClass.prototype.SyncWithServer = function (callbackDone) {
        debugger;
        var projData = new ProjectStorage();
        // Collect entity informations
        //
        var ents = App.Layout.GetEntities(true);
        for (var idx in ents) {
            var ent = ents[idx];
            if (!(ent instanceof THREE.Mesh)) {
                continue;
            }
            var mesh = ent;
            var objData = GetObjectData(ent);
            var entType = GetEntityType(ent);
            var skinMesh = SkinMesh.Create(mesh);
            var entInfo = new EntityInfo(skinMesh, entType);
            if (entType == EntityType.BCTool) {
                // Add parameters for BC Tool
                var params = objData.Tag;
                entInfo.BCToolModel = params.Model;
            }
            if (entType == EntityType.ReferencePoint) {
                // Add parameters for BC Tool
                var params1 = objData.Tag;
                entInfo.RefPointModel = params1.Model;
            }
            projData.EntitiesInfo.push(entInfo);
        }
        // Get Legend
        projData.Legend = LegendController.Instance.Legend;
        $.post("Project/Sync", JSON.stringify(projData), function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            if (callbackDone) {
                callbackDone();
            }
        });
    };
    ProjectClass.prototype.Save = function (projectName, doneCallback) {
        debugger;
        var self = this;
        if (projectName == null) {
            MessageBox.ShowError("Project name not set");
            return;
        }
        self.ProjectName = projectName;
        this.SyncWithServer(function () {
            $.post("Project/Save?name=" + projectName, function (data) {
                if (!ErrorHandler.CheckJsonRes(data)) {
                    return;
                }
                App.Ribbon.SetTitle(projectName);
                if (doneCallback) {
                    doneCallback();
                }
                self.IsDirty = false;
                MessageBox.ShowMessage("Save succeess");
            });
        });
    };
    return ProjectClass;
}());
var ProjectStorage = /** @class */ (function () {
    function ProjectStorage() {
        this.EntitiesInfo = new Array();
    }
    return ProjectStorage;
}());
var Project = new ProjectClass();
