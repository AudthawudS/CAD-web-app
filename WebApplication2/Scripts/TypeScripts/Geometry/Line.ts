/// <reference path="../_reference.d.ts" />

class Line
{
    public StartPoint : THREE.Vector3;

    public EndPoint : THREE.Vector3;

    constructor(start: THREE.Vector3, end: THREE.Vector3)
    {
        this.StartPoint = start;
        this.EndPoint = end;
    }

    public IsPointOnLimitLine(point : THREE.Vector3) : boolean
    {
        var d = this.GetPointOrientation(point);
        return ((Math.abs(d) < 0.000001) && (this.IsBetweenPoints(point, this.StartPoint, this.EndPoint)));
    }

    private IsBetweenPoints(point : THREE.Vector3, begin : THREE.Vector3, end : THREE.Vector3) : boolean
    {
        if (begin.x != end.x)
        {
            return ((begin.x <= point.x && point.x <= end.x) || (begin.x >= point.x && point.x >= end.x));
        }
        else
        {
            return ((begin.y <= point.y && point.y <= end.y) ||
            (begin.y >= point.y && point.y >= end.y));
        }
    }

    public GetPointOrientation(point : THREE.Vector3) : number
    {
        var self = this;
        return ((self.EndPoint.x - self.StartPoint.x) * (point.y - self.StartPoint.y) -
            (point.x - self.StartPoint.x) * (self.EndPoint.y - self.StartPoint.y));
    }

}