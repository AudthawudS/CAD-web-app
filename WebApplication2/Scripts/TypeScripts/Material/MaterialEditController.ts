/// <reference path="../_reference.d.ts" />

class MaterialEditController
{
    public static $inject = [
        '$scope',
        '$modalInstance',
        'material'
    ];

    private _scope: ng.IScope;

    private Material: Material;

    private _modalInstance: ng.ui.bootstrap.IModalServiceInstance;

    constructor(
        $scope: ng.IScope,
        $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
        material: Material)
    {
        var self = this;

        this._scope = $scope;
        this._modalInstance = $modalInstance;
        this.Material = material;

        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        (<any>$scope).vm = this;
    }

    private Accept()
    {
        var self = this;
        self._modalInstance.close();
    }

    private Cancel()
    {
        var self = this;
        self._modalInstance.dismiss();
    }
} 
