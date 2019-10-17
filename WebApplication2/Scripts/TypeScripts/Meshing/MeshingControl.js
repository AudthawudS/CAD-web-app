/// <reference path="../_reference.d.ts" />
/// <reference path="./MeshingImproveOptions.ts" />
var MeshingControlClass = /** @class */ (function () {
    function MeshingControlClass() {
    }
    MeshingControlClass.prototype.ShowDialog = function () {
        var self = this;
        var options = {
            templateUrl: '/Content/GetView?src=Meshing/MeshingControl',
            controller: 'meshingDialogCntrl',
            size: "md",
            backdrop: "static"
        };
        var modalService = UIUtility.GetModalService();
        var dlgRes = modalService.open(options).result;
        dlgRes.then(function (options) {
            self.RunImprove(options);
        });
    };
    MeshingControlClass.prototype.RunImprove = function (options) {
        var self = this;
        $.post("/Meshing/Improve", JSON.stringify(options), function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            Meshing.LoadMesh(function () {
                MessageBox.ShowMessage("Improve success");
            });
        });
    };
    return MeshingControlClass;
}());
var MeshingControl = new MeshingControlClass();
