/// <reference path="../_reference.d.ts" />
var Triangle = /** @class */ (function () {
    function Triangle(p1, p2, p3) {
        this.P1 = p1;
        this.P2 = p2;
        this.P3 = p3;
    }
    Triangle.prototype.IsPointInside = function (p) {
        var self = this;
        var line1 = new Line(self.P1, self.P2);
        var line2 = new Line(self.P2, self.P3);
        var line3 = new Line(self.P3, self.P1);
        if (line1.IsPointOnLimitLine(p) ||
            line2.IsPointOnLimitLine(p) ||
            line3.IsPointOnLimitLine(p)) {
            return true;
        }
        return (this.IsOnSameSide(p, self.P1, self.P2, self.P3) &&
            this.IsOnSameSide(p, self.P2, self.P1, self.P3) &&
            this.IsOnSameSide(p, self.P3, self.P1, self.P2));
    };
    Triangle.prototype.IsOnSameSide = function (p1, p2, a, b) {
        var bminusa = b.clone().sub(a);
        var cp1 = bminusa.clone().cross(p1.clone().sub(a));
        var cp2 = bminusa.clone().cross(p2.clone().sub(a));
        var dotProductRes = cp1.dot(cp2);
        return (dotProductRes >= 0.0);
    };
    return Triangle;
}());
