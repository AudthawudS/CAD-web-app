/// <reference path="../_reference.d.ts" />
var MessageBoxController = /** @class */ (function () {
    function MessageBoxController($scope, $modalInstance, title, message) {
        this._scope = $scope;
        $scope.vm = this;
        this._modalInstance = $modalInstance;
        this.Input = 0;
        this.Title = title;
        this.Message = message;
    }
    MessageBoxController.prototype.Cancel = function () {
        this._modalInstance.dismiss();
    };
    MessageBoxController.prototype.Accept = function () {
        this._modalInstance.close();
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    MessageBoxController.$inject = [
        '$scope',
        '$modalInstance',
        'Title',
        'Message'
    ];
    return MessageBoxController;
}());
