/// <reference path="../_reference.d.ts" />
var InputNameBoxController = /** @class */ (function () {
    function InputNameBoxController($scope, $modalInstance, title, message) {
        this._scope = $scope;
        $scope.vm = this;
        this._modalInstance = $modalInstance;
        this.Input = "";
        this.Title = title;
        this.Message = message;
    }
    InputNameBoxController.prototype.Cancel = function () {
        this._modalInstance.dismiss();
    };
    InputNameBoxController.prototype.Accept = function () {
        if (!this.Input || this.Input == "") {
            //MessageBox.ShowError("Value is empty");
            return;
        }
        this._modalInstance.close(this.Input);
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    InputNameBoxController.$inject = [
        '$scope',
        '$modalInstance',
        'Title',
        'Message'
    ];
    return InputNameBoxController;
}());
