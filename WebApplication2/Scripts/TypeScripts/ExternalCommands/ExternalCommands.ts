/// <reference path="../_reference.d.ts" />
/// <reference path="../Import/Import.ts" />

declare var GlobalServerCommand: string;

declare var GlobalFileName: string;

declare var CommandArgName: string;

class ExternalCommands
{
    public static ExecuteParams()
    {
        if (GlobalServerCommand)
        {
            if (GlobalServerCommand == "openprojects")
            {
                Project.OpenDialog();
            }
            else if (GlobalServerCommand == "openProject")
            {
                if (CommandArgName)
                {
                    Project.Open(CommandArgName);
                }
            }
            else if (GlobalServerCommand == "openModel")
            {
                if (GlobalFileName)
                {
                    ExternalCommands.UploadModel(GlobalFileName);
                }
            }

        }
    }

    private static UploadModel(file: string)
    {
        // Change url to empty
        window.history.pushState("", "Home", "/#");

        $.post("/Import/ImportModelFromStorage?file=" + file,
            function (data)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                ImportController.Instance.SetIsModelLoaded();
                ImportController.Instance.UpdatePreview();
            });
    }
}
