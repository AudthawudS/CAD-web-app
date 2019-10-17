/// <reference path="../_reference.d.ts" />
var InputNumberBoxController = /** @class */ (function () {
    function InputNumberBoxController($scope, $modalInstance, title, message) {
        this._scope = $scope;
        $scope.vm = this;
        this._modalInstance = $modalInstance;
        this.Input = 0;
        this.Title = title;
        this.Message = message;
    }
    InputNumberBoxController.prototype.Cancel = function () {
        this._modalInstance.dismiss();
    };
    InputNumberBoxController.prototype.Accept = function () {
        this._modalInstance.close(this.Input);
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    InputNumberBoxController.$inject = [
        '$scope',
        '$modalInstance',
        'Title',
        'Message'
    ];
    return InputNumberBoxController;
}());
