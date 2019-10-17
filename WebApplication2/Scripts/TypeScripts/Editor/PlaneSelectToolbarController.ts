/// <reference path="../_reference.d.ts" />
/// <reference path="./PlaneEditorType.ts" />

class PlaneSelectToolbarController
{
    public static $inject = [
        '$scope'
    ];

    public PlaneTypeChanged: CEvent<PlaneEditorType>;

    private _scope: ng.IScope;

    private _planeType : PlaneEditorType;

    constructor(private $scope: ng.IScope)
    {
        this._scope = $scope;
        (<any>$scope).vm = this;

        this._planeType = PlaneEditorType.XY;
        this.PlaneTypeChanged = new CEvent<PlaneEditorType>();
    }

    public SetPlaneType(planeType: PlaneEditorType)
    {
        this._planeType = planeType;
        UIUtility.ApplyScopeChanges(this._scope);
    }

    private IsPlaneSelected(planeTypeStr: string)
    {
        var planeType = this.ConvertFromString(planeTypeStr);
        return (this._planeType == planeType);
    }

    private SelectPlane(planeTypeStr: string)
    {
        this._planeType = this.ConvertFromString(planeTypeStr);
        UIUtility.ApplyScopeChanges(this._scope);

        this.PlaneTypeChanged.fire(this._planeType);
    }

    private ConvertFromString(planeType: string) : PlaneEditorType
    {
        if (planeType == "XY")
        {
            return PlaneEditorType.XY;
        }
        else if (planeType == "XZ")
        {
            return PlaneEditorType.XZ;
        }
        else if (planeType == "YZ")
        {
            return PlaneEditorType.YZ;
        }
        else
        {
            throw new Error("Unknown plane: " + planeType);
        }
    }
}