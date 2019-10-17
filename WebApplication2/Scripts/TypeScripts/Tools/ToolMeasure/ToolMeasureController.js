/// <reference path="../../_reference.d.ts" />
var ToolMeasureController = /** @class */ (function () {
    function ToolMeasureController($scope) {
        this.$scope = $scope;
        this._scope = $scope;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        $scope.vm = this;
        this.IsDistance = true;
        this.UnitsName = Settings.GetUnitsName();
        this.Angle = 0;
        this.AngleRad = 0;
        this.Distance = 0;
        this.ModeChanged = new CEvent();
        ToolMeasureController.Instance = this;
    }
    ToolMeasureController.prototype.SetDistance = function (dist, p1, p2) {
        this.Distance = dist;
        this.Point1 = this.ConvertToString(p1);
        this.Point2 = this.ConvertToString(p2);
        if (!this._scope.$$phase) {
            this._scope.$apply();
        }
    };
    ToolMeasureController.prototype.SetAngle = function (angle, p1, p2, p3) {
        this.Angle = Math.round(angle);
        this.AngleRad = angle / 180 * Math.PI;
        this.AngleRad = Math.round(this.AngleRad * 100) / 100;
        this.Point1 = this.ConvertToString(p1);
        this.Point2 = this.ConvertToString(p2);
        this.Point3 = this.ConvertToString(p3);
        if (!this._scope.$$phase) {
            this._scope.$apply();
        }
    };
    ToolMeasureController.prototype.Close = function () {
        App.Layout.SetDefaultTool();
    };
    ToolMeasureController.prototype.ConvertToString = function (pnt) {
        if (!pnt) {
            return "-";
        }
        var x = Math.round(pnt.x * 100) / 100;
        var y = Math.round(pnt.y * 100) / 100;
        var z = Math.round(pnt.z * 100) / 100;
        return "X: " + x + "  Y: " + y + "  Z: " + z;
    };
    ToolMeasureController.prototype.SelectModeDistance = function () {
        var self = this;
        self.IsDistance = true;
        self.Distance = 0;
        self.ModeChanged.fire(ToolMeasureMode.Distance);
    };
    ToolMeasureController.prototype.SelectModeAngle = function () {
        var self = this;
        self.IsDistance = false;
        self.Angle = 0;
        self.ModeChanged.fire(ToolMeasureMode.Angle);
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    ToolMeasureController.$inject = [
        '$scope'
    ];
    return ToolMeasureController;
}());
