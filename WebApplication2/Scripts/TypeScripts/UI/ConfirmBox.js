/// <reference path="../_reference.d.ts" />
var ConfirmBoxClass = /** @class */ (function () {
    function ConfirmBoxClass() {
        this._container = $("#confirm-dialog");
    }
    ConfirmBoxClass.prototype.Confirm = function (msg, doneCallback) {
        var controller = ConfirmBoxController.Instance;
        controller.SetMessage(msg);
        controller.DoneCallback = doneCallback;
        this._container.modal();
    };
    return ConfirmBoxClass;
}());
var ConfirmBox = new ConfirmBoxClass();
