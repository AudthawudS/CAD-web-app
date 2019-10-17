/// <reference path="../../_reference.d.ts" />

class ToolMeasureController
{
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope'
    ];

    public static Instance: ToolMeasureController;

    public ModeChanged: CEvent<ToolMeasureMode>;

    private Point1: string;

    private Point2: string;

    private Point3: string;

    private Angle: number;

    private AngleRad: number;

    private Distance: number;

    private IsDistance: boolean;

    private UnitsName: string;

    private _scope: ng.IScope;

    constructor(private $scope: ng.IScope)
    {
        this._scope = $scope;

        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        (<any>$scope).vm = this;

        this.IsDistance = true;
        this.UnitsName = Settings.GetUnitsName();
        this.Angle = 0;
        this.AngleRad = 0;
        this.Distance = 0;
        this.ModeChanged = new CEvent<ToolMeasureMode>();

        ToolMeasureController.Instance = this;
    }

    public SetDistance(dist: number, p1: THREE.Vector3, p2: THREE.Vector3)
    {
        this.Distance = dist;
        this.Point1 = this.ConvertToString(p1);
        this.Point2 = this.ConvertToString(p2);

        if (!this._scope.$$phase)
        {
            this._scope.$apply();
        }
    }

    public SetAngle(angle: number, p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3)
    {
        this.Angle = Math.round(angle);
        this.AngleRad = angle / 180 * Math.PI;
        this.AngleRad = Math.round(this.AngleRad * 100) / 100;

        this.Point1 = this.ConvertToString(p1);
        this.Point2 = this.ConvertToString(p2);
        this.Point3 = this.ConvertToString(p3);

        if (!this._scope.$$phase)
        {
            this._scope.$apply();
        }
    }

    private Close()
    {
        App.Layout.SetDefaultTool();
    }

    private ConvertToString(pnt: THREE.Vector3): string
    {
        if (!pnt)
        {
            return "-";
        }
        var x = Math.round(pnt.x * 100) / 100;
        var y = Math.round(pnt.y * 100) / 100;
        var z = Math.round(pnt.z * 100) / 100;
        return "X: " + x + "  Y: " + y + "  Z: " + z;
    }

    private SelectModeDistance()
    {
        var self = this;

        self.IsDistance = true;
        self.Distance = 0;

        self.ModeChanged.fire(ToolMeasureMode.Distance);
    }

    private SelectModeAngle()
    {
        var self = this;

        self.IsDistance = false;
        self.Angle = 0;

        self.ModeChanged.fire(ToolMeasureMode.Angle);
    }

}

