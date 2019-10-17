/// <reference path="../_reference.d.ts" />
var ConfirmBoxController = /** @class */ (function () {
    function ConfirmBoxController($scope) {
        this.$scope = $scope;
        this._scope = $scope;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        $scope.vm = this;
        ConfirmBoxController.Instance = this;
    }
    ConfirmBoxController.prototype.SetMessage = function (msg) {
        this.Message = msg;
        if (!this._scope.$$phase) {
            this._scope.$apply();
        }
    };
    ConfirmBoxController.prototype.Accept = function () {
        if (this.DoneCallback) {
            this.DoneCallback(true);
        }
    };
    ConfirmBoxController.prototype.Cancel = function () {
        if (this.DoneCallback) {
            this.DoneCallback(false);
        }
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    ConfirmBoxController.$inject = [
        '$scope'
    ];
    return ConfirmBoxController;
}());
