/// <reference path="../_reference.d.ts" />
/// <reference path="./PlaneEditorType.ts" />
var PlaneSelectToolbarController = /** @class */ (function () {
    function PlaneSelectToolbarController($scope) {
        this.$scope = $scope;
        this._scope = $scope;
        $scope.vm = this;
        this._planeType = PlaneEditorType.XY;
        this.PlaneTypeChanged = new CEvent();
    }
    PlaneSelectToolbarController.prototype.SetPlaneType = function (planeType) {
        this._planeType = planeType;
        UIUtility.ApplyScopeChanges(this._scope);
    };
    PlaneSelectToolbarController.prototype.IsPlaneSelected = function (planeTypeStr) {
        var planeType = this.ConvertFromString(planeTypeStr);
        return (this._planeType == planeType);
    };
    PlaneSelectToolbarController.prototype.SelectPlane = function (planeTypeStr) {
        this._planeType = this.ConvertFromString(planeTypeStr);
        UIUtility.ApplyScopeChanges(this._scope);
        this.PlaneTypeChanged.fire(this._planeType);
    };
    PlaneSelectToolbarController.prototype.ConvertFromString = function (planeType) {
        if (planeType == "XY") {
            return PlaneEditorType.XY;
        }
        else if (planeType == "XZ") {
            return PlaneEditorType.XZ;
        }
        else if (planeType == "YZ") {
            return PlaneEditorType.YZ;
        }
        else {
            throw new Error("Unknown plane: " + planeType);
        }
    };
    PlaneSelectToolbarController.$inject = [
        '$scope'
    ];
    return PlaneSelectToolbarController;
}());
