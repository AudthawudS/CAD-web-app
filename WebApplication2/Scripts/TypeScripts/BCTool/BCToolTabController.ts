/// <reference path="../_reference.d.ts" />

class BCToolTabController
{
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope'
    ];

    public static Instance: BCToolTabController;

    public IsLoading: boolean;

    public BCToolModels: Array<BoundCondModel>;

    public SelectedItemName: string;

    private _scope: ng.IScope;

    constructor(private $scope: ng.IScope)
    {
        this._scope = $scope;
        this.IsLoading = false;
        this.BCToolModels = null;
        this.SelectedItemName = null;

        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        (<any>$scope).vm = this;

        if (BCToolTabController.Instance)
        {
            throw new Error("BCToolTabController double init");
        }
        BCToolTabController.Instance = this;
    }

    public Update()
    {
        var self = this;
        if (self._scope.$$phase)
        {
            self.UpdateInternal();
        }
        else
        {
            self.$scope.$apply(function ()
            {
                self.UpdateInternal();
            });
        }
    }

    private UpdateInternal()
    {
      
        var self = this;


        self.BCToolModels = new Array<BoundCondModel>();

        var modelNames = Array<string>();
        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.BCTool);
        for (var entIdx in ents)
        {
            var ent = <THREE.Mesh>ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof BCToolParameters))
            {
                throw new Error("BC Tool entity contains not valid internal data");
            }
            var bcParams = <BCToolParameters>objData.Tag;
          
            self.BCToolModels.push(bcParams.Model);

            modelNames.push(bcParams.Model.Name);
        }


        if (!_.contains(modelNames, self.SelectedItemName))
        {
            // current selected name not exist
            self.SelectedItemName = null;
        }
        if (!self.SelectedItemName)
        {
            // Try set fist tool
            if (modelNames.length > 0)
            {
                self.SelectedItemName = modelNames[0];
            }
        }


        if (self.SelectedItemName)
        {
            App.Ribbon.EnableBCEditButtons(true);
        }
        else 
        {
            App.Ribbon.EnableBCEditButtons(false);
        }
    }

    public GetSelectedBCTool() : THREE.Mesh
    {
        if (!this.SelectedItemName)
        {
            return null;
        }

        var self = this;
        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.BCTool);
        for (var entIdx in ents)
        {
            var ent = <THREE.Mesh>ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof BCToolParameters))
            {
                throw new Error("BC Tool entity contains not valid internal data");
            }
            var bcParams = <BCToolParameters>objData.Tag;
            if (bcParams.Model.Name == self.SelectedItemName)
            {
                return ent;
            }
        }

        return null;
    }

    public IsSelected(model: BoundCondModel)
    {
        return (model.Name == this.SelectedItemName);
    }

    public SetSelection(model: BoundCondModel)
    {
        this.SelectedItemName = model.Name;

        if (this.SelectedItemName)
        {
            App.Ribbon.EnableBCEditButtons(true);
            App.Layout.SetDefaultTool();
            var selectedMesh = this.GetSelectedBCTool();

            selectedMesh.geometry.computeBoundingBox();
            var box = selectedMesh.geometry.boundingBox.clone();
            box.applyMatrix4(selectedMesh.matrixWorld);

            App.Layout.ZoomToBox(box, true);
        }
    }

    public RemoveBCTool(model: BoundCondModel)
    {
        var self = this;

        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.BCTool);
        for (var entIdx in ents)
        {
            var ent = <THREE.Mesh>ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof BCToolParameters))
            {
                throw new Error("BC Tool entity contains not valid internal data");
            }
            var bcParams = <BCToolParameters>objData.Tag;
            if (bcParams.Model.Name == model.Name)
            {
                layout.Scene.remove(ent);
                break;
            }
        }

        self.Update();
    }

}
