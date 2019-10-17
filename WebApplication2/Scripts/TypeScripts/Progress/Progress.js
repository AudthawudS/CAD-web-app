/// <reference path="../_reference.d.ts" />
var Progress = /** @class */ (function () {
    function Progress(msgBox) {
        this._msgBox = msgBox;
    }
    Progress.prototype.Message = function (msg) {
        $(this._msgBox).html(msg);
    };
    return Progress;
}());
