/// <reference path="../_reference.d.ts" />
/// <reference path="../UI/HelpBox.ts" />

class MeshingDialogController
{
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope',
        '$modalInstance'
    ];

    private Options: MeshingImproveOptions;

    private IsLoading: boolean;

    private _scope: ng.IScope;

    private _modalInstance: ng.ui.bootstrap.IModalServiceInstance;

    constructor($scope: ng.IScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance)
    {
        this._scope = $scope;
        this._modalInstance = $modalInstance;
        this.Options = null;

        (<any>$scope).vm = this;

        this.LoadOptions();
    }

    private LoadOptions()
    {
        var self = this;
        self.IsLoading = true;

        $.getJSON("/Meshing/GetImproveOptions",
            function (data)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self._scope.$apply(() =>
                {
                    self.IsLoading = false;
                    self.Options = data;
                });
            });
    }

    private Accept()
    {
        var self = this;
        self.IsLoading = true;

        $.post("/Meshing/SaveImproveOptions",
            JSON.stringify(self.Options),
            (data) =>
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self._modalInstance.close(self.Options);
            });
    }

    private Cancel()
    {
        var self = this;
        self._modalInstance.dismiss();
    }

    private Help(content: string)
    {
        MeshingHelp.Help(content);
    }
}