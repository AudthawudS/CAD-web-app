/// <reference path="../_reference.d.ts" />
var ColorUtility = /** @class */ (function () {
    function ColorUtility() {
    }
    ColorUtility.DecimalToCSSRGB = function (val) {
        var color = val;
        var b = color & 0xff;
        color = color >> 8;
        var g = color & 0xff;
        color = color >> 8;
        var r = color & 0xff;
        var strColor = "rgb(" + r + "," + g + "," + b + ")";
        return strColor;
    };
    ColorUtility.DecimalToTHREE = function (val) {
        var color = val;
        var b = color & 0xff;
        color = color >> 8;
        var g = color & 0xff;
        color = color >> 8;
        var r = color & 0xff;
        return new THREE.Color(r / 255.0, g / 255.0, b / 255.0);
    };
    return ColorUtility;
}());
