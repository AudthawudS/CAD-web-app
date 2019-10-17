/// <reference path="../_reference.d.ts" />
var KeyboardClass = /** @class */ (function () {
    function KeyboardClass() {
        var self = this;
        $(document).keydown(function (e) {
            self.Onkeydown(e);
        });
        $(document).keyup(function (e) {
            self.Onkeyup(e);
        });
    }
    KeyboardClass.prototype.Onkeydown = function (e) {
        if (e.ctrlKey) {
            this.IsCntrlPressed = true;
        }
        if (e.shiftKey) {
            this.IsShiftPressed = true;
        }
    };
    KeyboardClass.prototype.Onkeyup = function (e) {
        if (!e.ctrlKey) {
            this.IsCntrlPressed = false;
        }
        if (!e.shiftKey) {
            this.IsShiftPressed = false;
        }
    };
    return KeyboardClass;
}());
var Keyboard = new KeyboardClass();
