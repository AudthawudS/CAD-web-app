/// <reference path="../_reference.d.ts" />
/// <reference path="../Import/Import.ts" />
var ExternalCommands = /** @class */ (function () {
    function ExternalCommands() {
    }
    ExternalCommands.ExecuteParams = function () {
        if (GlobalServerCommand) {
            if (GlobalServerCommand == "openprojects") {
                Project.OpenDialog();
            }
            else if (GlobalServerCommand == "openProject") {
                if (CommandArgName) {
                    Project.Open(CommandArgName);
                }
            }
            else if (GlobalServerCommand == "openModel") {
                if (GlobalFileName) {
                    ExternalCommands.UploadModel(GlobalFileName);
                }
            }
        }
    };
    ExternalCommands.UploadModel = function (file) {
        // Change url to empty
        window.history.pushState("", "Home", "/#");
        $.post("/Import/ImportModelFromStorage?file=" + file, function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            ImportController.Instance.SetIsModelLoaded();
            ImportController.Instance.UpdatePreview();
        });
    };
    return ExternalCommands;
}());
