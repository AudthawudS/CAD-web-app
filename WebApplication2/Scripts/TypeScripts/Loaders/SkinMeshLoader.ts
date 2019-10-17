/// <reference path="../_reference.d.ts" />

class SkinMeshLoader
{
    public Load(
        url: string,
        listener: (skinMesh: SkinMesh) => void,
        errorHandler: () => void)
    {
        var self = this;
        $.getJSON(url,
            function (data, textStatus, jq)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    if (errorHandler)
                    {
                        errorHandler();
                    }
                    return;
                }

                var skinMesh = SkinMesh.CreateFromObject(data);
                listener(skinMesh);
            })
            .fail(function (jqXHR, textStatus, errorThrown)
            {
                MessageBox.ShowError("Mesh loading failed: " + textStatus);
                if (errorHandler)
                {
                    errorHandler();
                }
            });
    }
}