/// <reference path="../_reference.d.ts" />

class Triangle
{
    public P1 : THREE.Vector3;

    public P2 : THREE.Vector3;

    public P3 : THREE.Vector3;

    constructor(p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3)
    {
        this.P1 = p1;
        this.P2 = p2;
        this.P3 = p3;
    }

    public IsPointInside(p : THREE.Vector3) : boolean
    {
        var self = this;

        var line1 = new Line(self.P1, self.P2);
        var line2 = new Line(self.P2, self.P3);
        var line3 = new Line(self.P3, self.P1);
        if (line1.IsPointOnLimitLine(p) ||
            line2.IsPointOnLimitLine(p) ||
            line3.IsPointOnLimitLine(p))
        {
            return true;
        }

        return (this.IsOnSameSide(p, self.P1, self.P2, self.P3) &&
                this.IsOnSameSide(p, self.P2, self.P1, self.P3) &&
                this.IsOnSameSide(p, self.P3, self.P1, self.P2));
    }

    private IsOnSameSide(p1 :THREE.Vector3, p2: THREE.Vector3,  a: THREE.Vector3,  b : THREE.Vector3): boolean
    {
        var bminusa = b.clone().sub(a);
        var cp1 = bminusa.clone().cross(p1.clone().sub(a));
        var cp2 = bminusa.clone().cross(p2.clone().sub(a));
        var dotProductRes = cp1.dot(cp2);
        return (dotProductRes >= 0.0);
    }
}