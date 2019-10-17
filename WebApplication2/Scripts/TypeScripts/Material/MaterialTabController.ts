/// <reference path="../_reference.d.ts" />

class MaterialTabController
{
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope',
        '$uibModal'
    ];


    private _scope: ng.IScope;
    public static Instance: MaterialTabController;

    private _modalService: ng.ui.bootstrap.IModalService;

    constructor($scope: ng.IScope, $uibModal: ng.ui.bootstrap.IModalService)
    {
        this._scope = $scope;
        this._modalService = $uibModal;

        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        (<any>$scope).vm = this;
        MaterialTabController.Instance = this;
    }

    public MaterialDatabase()
    {
        var options: ng.ui.bootstrap.IModalSettings = {
            templateUrl: '/Content/GetView?src=Material/MaterialDatabase',
            controller: 'materialDbCntrl',
            backdrop: "static",
            size: "lg"
        };
        this._modalService.open(options);
    }

}

