/// <reference path="../_reference.d.ts" />

class ColorUtility
{
    public static DecimalToCSSRGB(val: number): string
    {
        var color = val;

        var b = color & 0xff;
        color = color >> 8;
        var g = color & 0xff;
        color = color >> 8;
        var r = color & 0xff;

        var strColor = "rgb(" + r + "," + g + "," + b + ")";
        return strColor;
    }


    public static DecimalToTHREE(val: number): THREE.Color
    {
        var color = val;

        var b = color & 0xff;
        color = color >> 8;
        var g = color & 0xff;
        color = color >> 8;
        var r = color & 0xff;

        return new THREE.Color(r / 255.0, g / 255.0, b / 255.0);
    }
}
