/// <reference path="../_reference.d.ts" />
var SkinMeshLoader = /** @class */ (function () {
    function SkinMeshLoader() {
    }
    SkinMeshLoader.prototype.Load = function (url, listener, errorHandler) {
        var self = this;
        $.getJSON(url, function (data, textStatus, jq) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                if (errorHandler) {
                    errorHandler();
                }
                return;
            }
            var skinMesh = SkinMesh.CreateFromObject(data);
            listener(skinMesh);
        })
            .fail(function (jqXHR, textStatus, errorThrown) {
            MessageBox.ShowError("Mesh loading failed: " + textStatus);
            if (errorHandler) {
                errorHandler();
            }
        });
    };
    return SkinMeshLoader;
}());
