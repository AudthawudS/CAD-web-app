/// <reference path="../_reference.d.ts" />

interface IBCToolScope extends ng.IScope
{
    vm: BCToolController;
}

class BCToolController
{
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope'
    ];

    public static Instance: BCToolController;

    public Model: BoundCondModel;

    public IsLoading: boolean;

    public DistanceFlatSphere: number;

    public SphericalRadius: number;

    private _preview1: JQuery;

    private _preview2: JQuery;

    private _scope: IBCToolScope;

    // dependencies are injected via AngularJS $injector
    // controller's name is registered in Application.ts and specified from ng-controller attribute in index.html
    constructor(private $scope: IBCToolScope)
    {
        this.Model = new BoundCondModel();

        this.DistanceFlatSphere = this.Model.DiameterLargeSphere - (this.Model.DistanceFlat * 2);
        this.SphericalRadius = this.GetSphericalRadius(this.Model);

        this._scope = $scope;
        this._preview1 = $("#bctool-preview1");
        this._preview2 = $("#bctool-preview2");
        this.IsLoading = false;

        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        $scope.vm = this;

        if (BCToolController.Instance)
        {
            throw new Error("BCToolController double init");
        }
        BCToolController.Instance = this;
    }

    public GetSphericalRadius(model: BoundCondModel)
    {
        // Radius by Chord:  R = (H/2) + (W^2/8H)
        var h = model.DiameterShaft;
        var w = model.DiameterShaft;
        return (h / 2) + ((w * w) / (8 * h));
    }

    public DoneEditing()
    {
        var self = this;

        self.IsLoading = true;

        // Convert UI parameters to model parameters
        self.Model.DistanceFlat = Math.max((self.Model.DiameterLargeSphere - self.DistanceFlatSphere) / 2, 0);

        // Radius by Chord:  R = (H/2) + (W^2/8H)
        // Segment height: h=R(1-cos(alpha/2))
        // alpha = 2*arcsin(w/2R)

        var r = self.SphericalRadius;
        var w = self.Model.DiameterShaft;

        r = Math.max(r, (w / 2));// Can't lower that half of chord length
        self.SphericalRadius = r;// store for update view

        var alpha = 2 * Math.asin(w / (2 * r));
        self.Model.HeightTopSphere = r * (1 - Math.cos(alpha / 2));
        self.Model.HeightTopSphere = Math.max(self.Model.HeightTopSphere, 0);// Can't lower zero

        $.post(
            "/BCTool/GenerateImages",
            JSON.stringify(self.Model),
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self._scope.$apply(function ()
                {
                    self.IsLoading = false;
                });

                self._preview1.attr("src", "/BCTool/GetImage?id=1&tmp=" + Number(new Date()));
                self._preview2.attr("src", "/BCTool/GetImage?id=2&tmp=" + Number(new Date()));
            });
    }

    public Accept()
    {
        var self = this;

        $.post(
            "/BCTool/BuildModel",
            JSON.stringify(self.Model),
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self._scope.$apply(function ()
                {
                    self.IsLoading = false;
                });


                var layout = App.Layout;

                layout.AddLight();

                var model = self.Model.Clone();
                var bcTool = BCTool.Create(data, model);

                BCToolTabController.Instance.Update();

                $("#bc-tool-dialog").modal("hide");
            }
            );
    }
}