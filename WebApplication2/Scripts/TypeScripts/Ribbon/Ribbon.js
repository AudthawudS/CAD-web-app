/// <reference path="../_reference.d.ts" />
/// <reference path="../Rendering/Rendering.ts" />
/// <reference path="../Tools/ITool.ts" />
/// <reference path="../Tools/ToolSelectRectangle.ts" />
/// <reference path="../Tools/ToolPan.ts" />
/// <reference path="../Tools/ToolTransfrom.ts" />
/// <reference path="../Tools/ToolDelete.ts" />
/// <reference path="../Tools/ToolBCEdit.ts" />
/// <reference path="../Tools/ToolSnap.ts" />
/// <reference path="../Tools/ToolZoomWindow.ts" />
/// <reference path="../Tools/ToolBallControl.ts" />
/// <reference path="../Tools/ToolMovePoint.ts" />
/// <reference path="../Tools/ToolRotateAtPoint.ts" />
/// <reference path="../Tools/ToolMeasure/ToolMeasure.ts" />
/// <reference path="../Settings/Settings.ts" />
/// <reference path="../Settings/SettingsController.ts" />
/// <reference path="../Project/ProjectController.ts" />
/// <reference path="../BCTool/BCTool.ts" />
/// <reference path="../BCTool/BCToolController.ts" />
/// <reference path="../FEA/FEAAnimation.ts" />
/// <reference path="../Groups/TabGroups.ts" />
/// <reference path="../License/License.ts" />
/// <reference path="../Deleter/Deleter.ts" />
/// <reference path="../Meshing/MeshingControl.ts" />
/// <reference path="../Force/RefPointEntity.ts" />
var RibbonClass = /** @class */ (function () {
    function RibbonClass(layout) {
        
        var self = this;
        this._isModelLoaded = false;
        this._isExportMeshEnabled = false;
        this._activateId = "";
        this._container = $('#ribbon');
        $('#ribbon').OfficeRibbon();
        this._container.removeClass("hide");
        this.EnableHighlightToolHandler(layout);
        ///////// PROJECT //////////////
        $("#divnode").click(function () {
            alert('Node');
            App.Layout.Selector.SelectItems(SelectionType.Node);
        });

        $("#divobj").click(function () {
            alert('Entity'); 
            App.Layout.Selector.SelectItems(SelectionType.Entity);
        });

        $("#divface").click(function () {
            alert('Face');
            App.Layout.Selector.SelectItems(SelectionType.Face);
        });

        $("#divelement").click(function () {
            alert('Edge');
            App.Layout.Selector.SelectItems(SelectionType.Edge);
          
        });

        $("#btn-new-project").click(function () {
            Project.New();
        });
        $("#btn-open-project").click(function () {
            Project.OpenDialog();
        });
        $("#btn-save-project").click(function () {
            Project.SaveDialog(null);
        });
        ///////// </ END PROJECT > //////////////
        $("#btn-import").click(function () {
            self.GotoImport();
        });
        $("#btn-goto-editor").click(function () {
            self.GotoEditor();
        });
        $("#btn-goto-editor2").click(function () {
            self.GotoEditor();
        });
        $("#btn-tool-trackball").click(function () {
            App.Layout.SetTool(new ToolBallControl());
        });
        $("#btn-zoom-fit").click(function () {
            App.Layout.ZoomToFit(true /*keep camera look*/);
        });
        $("#btn-zoom-window").click(function () {
            App.Layout.SetTool(new ToolZoomWindow());
        });
        $("#btn-tool-pan").click(function () {
            App.Layout.SetTool(new ToolPan());
        });
        $("#btn-edit-move").click(function () {
            App.Layout.SetTool(new ToolTransform(TransformMode.Move));
        });
        $("#btn-edit-move-point").click(function () {
            App.Layout.SetTool(new ToolMovePoint());
        });
        $("#btn-edit-rotate").click(function () {
            App.Layout.SetTool(new ToolTransform(TransformMode.Rotate));
        });
        $("#btn-edit-rotate-at-point").click(function () {
            App.Layout.SetTool(new ToolRotateAtPoint());
        });
        $("#btn-edit-scale").click(function () {
            App.Layout.SetTool(new ToolTransform(TransformMode.Scale));
        });
        $("#btn-edit-delete").click(function () {
            Deleter.DeleteSelection();
        });
        $("#btn-measure-tool").click(function () {
            App.Layout.SetTool(new ToolMeasure());
        });
        $("#btn-select-nodes").click(function () {
            App.Layout.Selector.SelectItems(SelectionType.Node);
        });
        $("#btn-select-edge").click(function () {
            App.Layout.Selector.SelectItems(SelectionType.Edge);
        });
        $("#btn-select-face").click(function () {
            App.Layout.Selector.SelectItems(SelectionType.Face);
        });
        $("#btn-select-entity").click(function () {
            App.Layout.Selector.SelectItems(SelectionType.Entity);
        });
        $("#btn-select-clear").click(function () {
            App.Layout.SetDefaultTool();
            App.Layout.Selector.Clear();
        });
        $("#btn-simulation").click(function () {
            self.GoToSimulation();
        });
        $("#btn-simulation-result").click(function () {
            self.GoToSimulationResult();
        });
        $("#btn-settings").click(function () {
            SettingsController.Instance.ShowDialog();
        });
        //////////////// Moment Tab /////////////////////////
        $("#btn-refpoint-create").click(function () {
            $("#modal-refpoint-name").modal();
            //var ent = new RefPointEntity();
            //App.Layout.Scene.add(ent);
            //// Add to selection
            //App.Layout.Selector.Clear();
            //App.Layout.Selector.AddSelectedItems([new SelectionItemEntity(ent)]);
            //// Activate transform tool
            //var transformTool = new ToolTransform(TransformMode.Move);
            //transformTool.TransformObject = ent;
            //App.Layout.SetTool(transformTool);
        });
        $("#btn-moment-tool").click(function () {
            App.Layout.SetTool(new ToolMoment());
        });
        //////////////// Meshing Tab /////////////////////////
        $("#btn-meshing-control").click(function () {
            self.GotoImport();
            //  MeshingControl.ShowDialog();
        });
        /////////////////// BC Tool TAB /////////////////////////////////
        $("#btn-bc-tool-new").click(function () {
            BCToolController.Instance.DoneEditing();
            $("#bc-tool-dialog").modal();
        });
        $("#btn-bc-tool-edit-full-move").click(function () {
            App.Layout.SetTool(new ToolBCEdit(ToolBCEditMode.FullMove));
        });
        $("#btn-bc-tool-edit-full-rotate").click(function () {
            App.Layout.SetTool(new ToolBCEdit(ToolBCEditMode.FullRotate));
        });
        $("#btn-bc-tool-edit-manual-move").click(function () {
            App.Layout.SetTool(new ToolBCEdit(ToolBCEditMode.ManualMove));
        });
        $("#btn-bc-tool-edit-manual-rotate").click(function () {
            App.Layout.SetTool(new ToolBCEdit(ToolBCEditMode.ManualRotate));
        });
        $("#btn-bc-tool-edit-grid-manual-move").click(function () {
            App.Layout.SetTool(new ToolBCEdit(ToolBCEditMode.ManualGridMove));
        });
        $("#btn-bc-tool-edit-grid-manual-rotate").click(function () {
            App.Layout.SetTool(new ToolBCEdit(ToolBCEditMode.ManualGridRotate));
        });
        $("#btn-bc-tool-snap").click(function () {
            App.Layout.SetTool(new ToolSnap());
        });
        $("#btn-bc-tool-trisurf").click(function () {
            App.Layout.SetTool(new ToolTriPntSurf());
        });
        $("#btn-bc-tool-about").click(function () {
            $("#bc-tool-about-dialog").modal();
        });
        /////////////////// </ BC Tool TAB > /////////////////////////////////
        /////////////////// FEA TAB /////////////////////////////////
        $("#btn-animation-disp-start").click(function () {
            FEAAnimation.StartAnimation();
        });
        $("#btn-animation-disp-stop").click(function () {
            FEAAnimation.StopAnimation();
        });
        ///////// Rendering TAB //////////////
        $("#btn-rendering-shading").click(function () {
            Rendering.SetRenderingMode(RenderingModeType.Shading);
        });
        $("#btn-rendering-wireframe").click(function () {
            Rendering.SetRenderingMode(RenderingModeType.Wireframe);
        });
        $("#btn-rendering-meshedges").click(function () {
            Rendering.SetRenderingMode(RenderingModeType.ShadingEdge);
        });
        ///////// </ End Rendering TAB > //////////////
        self.UpdateUserName();
        self.GotoImport();
    }
    RibbonClass.prototype.UpdateUserName = function () {
        $.getJSON("/Login/GetUserInfo", function (data) {
            if (data === undefined || data.Username === undefined) {
                $("#ribbon-username").html("");
                return;
            }
            $("#ribbon-username").html(data.Username);
        });
    };
    RibbonClass.prototype.Activate = function (contentId) {
        var oldId = this._activateId;
        this._activateId = contentId;
        if (oldId == contentId) {
            return;
        }
        if (oldId != null && oldId != "" && oldId != undefined) {
            $(oldId).hide("slide", function () {
                $(contentId).show("slide");
            });
        }
        else {
            $(contentId).show("slide");
        }
    };
    RibbonClass.prototype.GoToSimulationResult = function () {
        this.Activate("#simulationResultPanel");
    };
    RibbonClass.prototype.GoToSimulation = function () {
        this.Activate("#simulationPanel");
    };
    RibbonClass.prototype.GotoImport = function () {
        this.Activate("#importPanel");
    };
    RibbonClass.prototype.GotoEditor = function () {
        this.Activate("#layoutPanel");
        // Update SetUps and Groups
        TabGroups.Refresh();
        TabSetUpsController.Instance.Refresh();
        // Update BC tools
        BCToolTabController.Instance.Update();
        RefPointTabController.Instance.Update();
    };
    RibbonClass.prototype.EnableModel = function () {
        this._isModelLoaded = true;
    };
    RibbonClass.prototype.GetHeight = function () {
        return this._container.height();
    };
    RibbonClass.prototype.SetTitle = function (title) {
        $("#ribbon-window-title").html(title);
    };
    RibbonClass.prototype.EnableBCEditButtons = function (enable) {
        if (enable) {
            $("#btn-bc-tool-edit-manual-move").enableRbButton();
            $("#btn-bc-tool-edit-manual-rotate").enableRbButton();
            $("#btn-bc-tool-edit-grid-manual-move").enableRbButton();
            $("#btn-bc-tool-edit-grid-manual-rotate").enableRbButton();
            $("#btn-bc-tool-snap").enableRbButton();
            $("#btn-bc-tool-trisurf").enableRbButton();
            $("#btn-bc-tool-edit-full-move").enableRbButton();
            $("#btn-bc-tool-edit-full-rotate").enableRbButton();
        }
        else {
            $("#btn-bc-tool-edit-manual-move").disableRbButton();
            $("#btn-bc-tool-edit-manual-rotate").disableRbButton();
            $("#btn-bc-tool-edit-grid-manual-move").disableRbButton();
            $("#btn-bc-tool-edit-grid-manual-rotate").disableRbButton();
            $("#btn-bc-tool-snap").disableRbButton();
            $("#btn-bc-tool-trisurf").disableRbButton();
            $("#btn-bc-tool-edit-full-move").disableRbButton();
            $("#btn-bc-tool-edit-full-rotate").disableRbButton();
        }
    };
    RibbonClass.prototype.EnableHighlightToolHandler = function (layout) {
        $("#ribbon .ribbon-tool").click(function () {
            // unhiglight all
            $("#ribbon .ribbon-tool").removeClass("ribbon-button-active");
            $(this).addClass("ribbon-button-active");
        });
        layout.ToolChanged.on(function (tool) {
            // higlight
            if (tool == null) {
                return;
            }
            if (tool instanceof ToolPan) {
                // unhiglight all
                $("#ribbon .ribbon-tool").removeClass("ribbon-button-active");
                $("#btn-tool-pan").addClass("ribbon-button-active");
            }
        });
    };
    return RibbonClass;
}());
