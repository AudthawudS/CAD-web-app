/// <reference path="../_reference.d.ts" />
var MaterialTabController = /** @class */ (function () {
    function MaterialTabController($scope, $uibModal) {
        this._scope = $scope;
        this._modalService = $uibModal;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        $scope.vm = this;
        MaterialTabController.Instance = this;
    }
    MaterialTabController.prototype.MaterialDatabase = function () {
        var options = {
            templateUrl: '/Content/GetView?src=Material/MaterialDatabase',
            controller: 'materialDbCntrl',
            backdrop: "static",
            size: "lg"
        };
        this._modalService.open(options);
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    MaterialTabController.$inject = [
        '$scope',
        '$uibModal'
    ];
    return MaterialTabController;
}());
