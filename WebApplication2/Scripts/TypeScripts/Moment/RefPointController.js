/// <reference path="../_reference.d.ts" />
var RefPointController = /** @class */ (function () {
    function RefPointController($scope) {
        this.$scope = $scope;
        this._scope = $scope;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        this.SelectedItemName = null;
        this.RefModel = new RefPointModel();
        this.RefModels = null;
        this._scope.vm = this;
        if (RefPointController.Instance) {
            throw new Error("Double init of RefpointController");
        }
        RefPointController.Instance = this;
    }
    RefPointController.prototype.CreateRefPoint = function (name) {
        var self = this;
        var ent = new RefPointEntity();
        ent.name = name;
        var re = new RefPointModel();
        re.Name = name;
        var _params = new RefpOintParameters(re);
        var userData = new ObjectData(EntityType.ReferencePoint, false);
        userData.Tag = _params;
        //var objData = GetObjectData(mesh);
        //objData.Tag = _params;
        ent.userData = userData;
        App.Layout.Scene.add(ent);
        // Add to selection
        App.Layout.Selector.Clear();
        App.Layout.Selector.AddSelectedItems([new SelectionItemEntity(ent)]);
        // Activate transform tool
        var transformTool = new ToolTransform(TransformMode.Move);
        transformTool.TransformObject = ent;
        App.Layout.SetTool(transformTool);
        RefPointTabController.Instance.Update();
        //$.post(
        //    "/Groups/CreateRefPoint?name=" + name,
        //    function (data, textStatus) {
        //        if (!ErrorHandler.CheckJsonRes(data)) {
        //            return;
        //        }
        //        //self.CurrentSetUpName = name;
        //        //self.Refresh();
        //      //  MessageBox.ShowMessage("Refrence Point Created");
        //    });
    };
    RefPointController.$inject = [
        '$scope'
    ];
    return RefPointController;
}());
