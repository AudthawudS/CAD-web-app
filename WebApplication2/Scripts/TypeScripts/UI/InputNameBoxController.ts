/// <reference path="../_reference.d.ts" />

class InputNameBoxController
{
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope',
        '$modalInstance',
        'Title',
        'Message'
    ];

    private Title: string;

    private Input: string;

    private Message: string;

    private _scope: ng.IScope;

    private _modalInstance: ng.ui.bootstrap.IModalServiceInstance;

    constructor($scope: ng.IScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance, title: string, message: string)
    {
        this._scope = $scope;
        (<any>$scope).vm = this;
        this._modalInstance = $modalInstance;

        this.Input = "";
        this.Title = title;
        this.Message = message;
    }

    private Cancel()
    {
        this._modalInstance.dismiss();
    }

    private Accept()
    {
        if (!this.Input || this.Input == "")
        {
            //MessageBox.ShowError("Value is empty");
            return;
        }
        this._modalInstance.close(this.Input);
    }
}

 