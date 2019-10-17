/// <reference path="../_reference.d.ts" />

class RefPointTabController {
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope'
    ];

    public static Instance: RefPointTabController;
    public RefPoints: Array<RefPoint>;
    public RefPointModels: Array<RefPointModel>;
    public SelectedItemName: string;
    private _scope: ng.IScope;

    constructor(private $scope: ng.IScope) {
        this._scope = $scope;
      
        this.RefPoints = null;
        this.SelectedItemName = null;
        this.RefPointModels=null;

        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        (<any>$scope).vm = this;

        if (RefPointTabController.Instance) {
            throw new Error("RefPointTabController double init");
        }
        RefPointTabController.Instance = this;
    }

    public Update() {
        var self = this;
        if (self._scope.$$phase) {
            self.UpdateInternal();
        }
        else {
            self.$scope.$apply(function () {
                self.UpdateInternal();
            });
        }
    }

    private UpdateInternal() {
        debugger;
        var self = this;
        self.RefPointModels = new Array<RefPointModel>();
        var modelNames = Array<string>();
        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.ReferencePoint);

        for (var entIdx in ents) {
                       
            var ent = <THREE.Mesh>ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof RefpOintParameters)) {
                throw new Error("Ref entity contains not valid internal data");
            }
            var bcParams = <RefpOintParameters>objData.Tag;
            self.RefPointModels.push(bcParams.Model);
            
        }
            
    }

    public GetSelectedRefpoint(): THREE.Mesh {
        if (!this.SelectedItemName) {
            return null;
        }

        var self = this;
        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.ReferencePoint);
        for (var entIdx in ents) {
            var ent = <THREE.Mesh>ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof RefpOintParameters)) {
                throw new Error("Ref entity contains not valid internal data");
            }
            var bcParams = <RefpOintParameters>objData.Tag;
            if (bcParams.Model.Name == self.SelectedItemName) {
                return ent;
            }
        }

        return null;
    }
    public IsSelected(model: RefPointModel) {
        return (model.Name == this.SelectedItemName);
    }

    public SetSelection(model: RefPointModel) {
        this.SelectedItemName = model.Name;

        debugger;
        if (this.SelectedItemName) {
            //App.Ribbon.EnableBCEditButtons(true);
            App.Layout.SetDefaultTool();
            var selectedMesh = this.GetSelectedRefpoint();

            selectedMesh.geometry.computeBoundingBox();
            var box = selectedMesh.geometry.boundingBox.clone();
            box.applyMatrix4(selectedMesh.matrixWorld);

           // App.Layout.ZoomToBox(box, true);
        }
    }

    public RemoveBCTool(model: RefPointModel) {
        var self = this;

        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.ReferencePoint);
        for (var entIdx in ents) {
            var ent = <THREE.Mesh>ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof RefpOintParameters)) {
                throw new Error("Ref entity contains not valid internal data");
            }
            var bcParams = <RefpOintParameters>objData.Tag;
            if (bcParams.Model.Name == model.Name) {
                layout.Scene.remove(ent);
                break;
            }
        }

        self.Update();
    }
    
}
class RefPoint {
    Id: string;
    RefName: string;

}
