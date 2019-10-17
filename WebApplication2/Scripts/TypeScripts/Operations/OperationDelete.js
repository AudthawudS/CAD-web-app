/// <reference path="../_reference.d.ts" />
/// <reference path="./IOperation.ts" />
var OperationDelete = /** @class */ (function () {
    function OperationDelete(obj) {
        this._object = obj;
    }
    OperationDelete.prototype.Apply = function () {
        var self = this;
        if (_.contains(App.Layout.Scene.children, self._object)) {
            App.Layout.Scene.remove(self._object);
        }
    };
    OperationDelete.prototype.Undo = function () {
        var self = this;
        if (!_.contains(App.Layout.Scene.children, self._object)) {
            App.Layout.Scene.add(self._object);
        }
    };
    return OperationDelete;
}());
