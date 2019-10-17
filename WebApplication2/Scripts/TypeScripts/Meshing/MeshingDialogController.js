/// <reference path="../_reference.d.ts" />
/// <reference path="../UI/HelpBox.ts" />
var MeshingDialogController = /** @class */ (function () {
    function MeshingDialogController($scope, $modalInstance) {
        this._scope = $scope;
        this._modalInstance = $modalInstance;
        this.Options = null;
        $scope.vm = this;
        this.LoadOptions();
    }
    MeshingDialogController.prototype.LoadOptions = function () {
        var self = this;
        self.IsLoading = true;
        $.getJSON("/Meshing/GetImproveOptions", function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self._scope.$apply(function () {
                self.IsLoading = false;
                self.Options = data;
            });
        });
    };
    MeshingDialogController.prototype.Accept = function () {
        var self = this;
        self.IsLoading = true;
        $.post("/Meshing/SaveImproveOptions", JSON.stringify(self.Options), function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self._modalInstance.close(self.Options);
        });
    };
    MeshingDialogController.prototype.Cancel = function () {
        var self = this;
        self._modalInstance.dismiss();
    };
    MeshingDialogController.prototype.Help = function (content) {
        MeshingHelp.Help(content);
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    MeshingDialogController.$inject = [
        '$scope',
        '$modalInstance'
    ];
    return MeshingDialogController;
}());
