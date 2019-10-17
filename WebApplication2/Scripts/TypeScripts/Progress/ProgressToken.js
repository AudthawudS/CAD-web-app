/// <reference path="../_reference.d.ts" />
var ProgressToken = /** @class */ (function () {
    function ProgressToken() {
        this.IsDone = false;
    }
    ProgressToken.prototype.Stop = function () {
        this.IsDone = true;
    };
    return ProgressToken;
}());
