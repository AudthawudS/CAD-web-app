/// <reference path="../_reference.d.ts" />
/// <reference path="./MeshingImproveOptions.ts" />

class MeshingControlClass
{
    public ShowDialog()
    {
        var self = this;

        var options: ng.ui.bootstrap.IModalSettings = {
            templateUrl: '/Content/GetView?src=Meshing/MeshingControl',
            controller: 'meshingDialogCntrl',
            size: "md",
            backdrop: "static"
        };
        var modalService = UIUtility.GetModalService();
        var dlgRes = modalService.open(options).result;
        dlgRes.then((options: MeshingImproveOptions) =>
        {
            self.RunImprove(options);
        });
    }

    private RunImprove(options: MeshingImproveOptions)
    {
        var self = this;

        $.post("/Meshing/Improve",
            JSON.stringify(options),
            (data) =>
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                Meshing.LoadMesh(() =>
                {
                    MessageBox.ShowMessage("Improve success");
                });
            });
    }
}

var MeshingControl = new MeshingControlClass();