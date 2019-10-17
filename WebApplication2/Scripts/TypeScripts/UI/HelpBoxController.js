/// <reference path="../_reference.d.ts" />
var HelpBoxController = /** @class */ (function () {
    function HelpBoxController($scope, $modalInstance, text) {
        this._scope = $scope;
        this._modalInstance = $modalInstance;
        this.Text = text;
        $scope.vm = this;
    }
    HelpBoxController.prototype.Accept = function () {
        var self = this;
        self._modalInstance.close(self.Options);
    };
    HelpBoxController.prototype.Cancel = function () {
        var self = this;
        self._modalInstance.dismiss();
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    HelpBoxController.$inject = [
        '$scope',
        '$modalInstance',
        'HelpBoxText'
    ];
    return HelpBoxController;
}());
