/// <reference path="../_reference.d.ts" />
/// <reference path="../App.ts" />
var UIInteractive = /** @class */ (function () {
    function UIInteractive($scope, $sce, $compile) {
        this._scope = $scope;
        this._sce = $sce;
        this._compile = $compile;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        $scope.vm = this;
        this.Message = "";
        this.MessageDisplayCSS = "none";
        this.MessageLeftCSS = "0px";
        this.SideDataContent = null;
        this.IsSideDataVisible = false;
        UIInteractive.Instance = this;
    }
    UIInteractive.prototype.SetMessage = function (msg) {
        var self = this;
        var self = this;
        self.Message = msg;
        if (msg == null || msg == "") {
            self.MessageDisplayCSS = "none";
        }
        else {
            var w = $(window).width();
            self.MessageDisplayCSS = "block";
            self.MessageLeftCSS = (w / 2).toString() + "px";
        }
        UIUtility.ApplyScopeChanges(self._scope);
    };
    UIInteractive.prototype.SetSideContent = function (data, doneCallback) {
        var self = this;
        self.SideDataContent = self._compile(data)(self._scope);
        if (data == null || data == "") {
            self.IsSideDataVisible = false;
        }
        else {
            self.IsSideDataVisible = true;
        }
        if (doneCallback) {
            doneCallback(self.SideDataContent);
        }
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    UIInteractive.$inject = [
        '$scope',
        '$sce',
        '$compile'
    ];
    return UIInteractive;
}());
