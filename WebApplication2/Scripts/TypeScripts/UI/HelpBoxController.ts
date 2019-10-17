/// <reference path="../_reference.d.ts" />

class HelpBoxController
{
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope',
        '$modalInstance',
        'HelpBoxText'
    ];

    private Options: MeshingImproveOptions;

    private _scope: ng.IScope;

    private _modalInstance: ng.ui.bootstrap.IModalServiceInstance;

    private Text: string;

    constructor($scope: ng.IScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance, text: string)
    {
        this._scope = $scope;
        this._modalInstance = $modalInstance;
        this.Text = text;

        (<any>$scope).vm = this;
    }


    private Accept()
    {
        var self = this;
        self._modalInstance.close(self.Options);
    }

    private Cancel()
    {
        var self = this;
        self._modalInstance.dismiss();
    }

}