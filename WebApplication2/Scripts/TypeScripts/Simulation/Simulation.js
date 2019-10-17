/// <reference path="../_reference.d.ts" />
var SimulationClass = /** @class */ (function () {
    function SimulationClass() {
        var self = this;
        $("#id-sim-res-run").click(function () {
            self.Run(null);
        });
        $("#id-sim-res-gen-img").click(function () {
            self.GenerateResultStart();
        });
        $("#id-sim-res-save-to-gallery").click(function () {
            self.SaveToGalleryStart();
        });
        $("#id-sim-res-get-colors").click(function () {
            self.GetAndApplyColors();
        });
    }
    SimulationClass.prototype.Run = function (doneCallback) {
        // Reset FEA Animation
        FEAAnimation.StopAnimation();
        FEAAnimation.Reset();
        $("#id-sim-res-run").button("loading");
        // First sync with server
        Project.SyncWithServer(function () {
            $.post("/Simulation/Run", function (data, textStatus) {
                $("#id-sim-res-run").button("reset");
                if (doneCallback) {
                    doneCallback();
                }
                if (!ErrorHandler.CheckJsonRes(data)) {
                    return;
                }
                App.Ribbon.GoToSimulationResult();
            });
        });
    };
    SimulationClass.prototype.GetPlotType = function () {
        var plotType = $("#id-sim-res-plottype").val();
        return plotType;
    };
    SimulationClass.prototype.GetAndApplyColors = function () {
        var self = this;
        var type = $("#id-sim-res-type").val();
        var plotType = $("#id-sim-res-plottype").val();
        $("#id-sim-res-get-colors").button("loading");
        $.getJSON("/Simulation/GetColors?plotType=" + plotType, function (data, textStatus, jq) {
            $("#id-sim-res-get-colors").button("reset");
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            // Contains all colors for all meshes
            var colors = data.colors;
            var legend = data.legend;
            var entsIds = data.entsIds;
            var gOffset = 0;
            for (var idxEntId in entsIds) {
                var entId = entsIds[idxEntId];
                var mesh = App.Layout.GetMeshById(entId);
                var material = new THREE.MeshBasicMaterial({ color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors });
                mesh.material = material;
                var geom = mesh.geometry;
                for (var i = 0; i < geom.faces.length; i++) {
                    var face = geom.faces[i];
                    var c1 = colors[face.a + gOffset];
                    var c2 = colors[face.b + gOffset];
                    var c3 = colors[face.c + gOffset];
                    face.vertexColors[0] = new THREE.Color(c1);
                    face.vertexColors[1] = new THREE.Color(c2);
                    face.vertexColors[2] = new THREE.Color(c3);
                }
                geom.colorsNeedUpdate = true;
                geom.computeVertexNormals();
                App.Layout.Scene.remove(mesh);
                App.Layout.Scene.add(mesh);
                // Make offset to next mesh
                gOffset += mesh.geometry.vertices.length;
            }
            // Update legend
            LegendController.UpdateScope(legend);
            App.Ribbon.GotoEditor();
        });
    };
    SimulationClass.prototype.GenerateResultStart = function () {
        var self = this;
        var finalName;
        var finalName = TabSetUpsController.Instance.CurrentSetUpName;
        if (!finalName) {
            finalName = Project.ProjectName;
        }
        if (finalName && finalName != "") {
            self.GenerateResult(finalName);
        }
        else {
            InputBox.InputText("Input Name", "Enter Result Name:", function (name) {
                self.GenerateResult(name);
            });
        }
    };
    SimulationClass.prototype.GenerateResult = function (name) {
        var type = $("#id-sim-res-type").val();
        var plotType = $("#id-sim-res-plottype").val();
        $("#id-sim-res-gen-img").button("loading");
        $.post("/Simulation/GenerateResult?type=" + type +
            "&plotType=" + plotType, function (data, textStatus) {
            $("#id-sim-res-gen-img").button("reset");
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            window.location.href = "/Simulation/DownloadResult?type=" + type + "&name=" + name;
        });
    };
    SimulationClass.prototype.SaveToGalleryStart = function () {
        var self = this;
        var finalName;
        var finalName = TabSetUpsController.Instance.CurrentSetUpName;
        if (!finalName) {
            finalName = Project.ProjectName;
        }
        if (finalName && finalName != "") {
            self.SaveToGallery(finalName);
        }
        else {
            InputBox.InputText("Input Name", "Enter Result Name:", function (name) {
                self.SaveToGallery(name);
            });
        }
    };
    SimulationClass.prototype.SaveToGallery = function (name) {
        var plotType = $("#id-sim-res-plottype").val();
        $("#id-sim-res-save-to-gallery").button("loading");
        $.post("/Simulation/SaveToGallery?plotType=" + plotType + "&name=" + name, function (data, textStatus) {
            $("#id-sim-res-save-to-gallery").button("reset");
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            MessageBox.ShowMessage("Image saved to Gallery Storage");
        });
    };
    return SimulationClass;
}());
var Simulation;
$(document).ready(function () {
    Simulation = new SimulationClass();
});
