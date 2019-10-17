/// <reference path="../_reference.d.ts" />
var MaterialEditController = /** @class */ (function () {
    function MaterialEditController($scope, $modalInstance, material) {
        var self = this;
        this._scope = $scope;
        this._modalInstance = $modalInstance;
        this.Material = material;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        $scope.vm = this;
    }
    MaterialEditController.prototype.Accept = function () {
        var self = this;
        self._modalInstance.close();
    };
    MaterialEditController.prototype.Cancel = function () {
        var self = this;
        self._modalInstance.dismiss();
    };
    MaterialEditController.$inject = [
        '$scope',
        '$modalInstance',
        'material'
    ];
    return MaterialEditController;
}());
