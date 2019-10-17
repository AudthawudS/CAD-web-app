/// <reference path="../_reference.d.ts" />
var InputDigitBoxClass = (function () {
    function InputDigitBoxClass() {
        this._container = $("#input-number-dialog");
    }
    InputDigitBoxClass.prototype.Input = function (tilte, msg, doneCallback) {
        var controller = InputNameBoxController.Instance;
        controller.SetMessage(tilte, msg);
        controller.DoneCallback = doneCallback;
        this._container.modal();
    };
    return InputDigitBoxClass;
})();
var InputNameBox = new InputNameBoxClass();
