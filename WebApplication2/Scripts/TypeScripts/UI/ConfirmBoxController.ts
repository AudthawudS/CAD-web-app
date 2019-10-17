/// <reference path="../_reference.d.ts" />

class ConfirmBoxController
{
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope'
    ];

    public static Instance: ConfirmBoxController;

    public DoneCallback: (isAccept: boolean) => void;

    private Title: string;

    private Message: string;

    private _scope: ng.IScope;

    constructor(private $scope: ng.IScope)
    {
        this._scope = $scope;

        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        (<any>$scope).vm = this;

        ConfirmBoxController.Instance = this;
    }

    public SetMessage(msg: string)
    {
        this.Message = msg;

        if (!this._scope.$$phase)
        {
            this._scope.$apply();
        }
    }

    private Accept()
    {
        if (this.DoneCallback)
        {
            this.DoneCallback(true);
        }
    }

    private Cancel()
    {
        if (this.DoneCallback)
        {
            this.DoneCallback(false);
        }
    }
}

