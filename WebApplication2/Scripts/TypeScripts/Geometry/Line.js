/// <reference path="../_reference.d.ts" />
var Line = /** @class */ (function () {
    function Line(start, end) {
        this.StartPoint = start;
        this.EndPoint = end;
    }
    Line.prototype.IsPointOnLimitLine = function (point) {
        var d = this.GetPointOrientation(point);
        return ((Math.abs(d) < 0.000001) && (this.IsBetweenPoints(point, this.StartPoint, this.EndPoint)));
    };
    Line.prototype.IsBetweenPoints = function (point, begin, end) {
        if (begin.x != end.x) {
            return ((begin.x <= point.x && point.x <= end.x) || (begin.x >= point.x && point.x >= end.x));
        }
        else {
            return ((begin.y <= point.y && point.y <= end.y) ||
                (begin.y >= point.y && point.y >= end.y));
        }
    };
    Line.prototype.GetPointOrientation = function (point) {
        var self = this;
        return ((self.EndPoint.x - self.StartPoint.x) * (point.y - self.StartPoint.y) -
            (point.x - self.StartPoint.x) * (self.EndPoint.y - self.StartPoint.y));
    };
    return Line;
}());
