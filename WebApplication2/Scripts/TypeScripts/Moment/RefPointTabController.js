/// <reference path="../_reference.d.ts" />
var RefPointTabController = /** @class */ (function () {
    function RefPointTabController($scope) {
        this.$scope = $scope;
        this._scope = $scope;
        this.RefPoints = null;
        this.SelectedItemName = null;
        this.RefPointModels = null;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        $scope.vm = this;
        if (RefPointTabController.Instance) {
            throw new Error("RefPointTabController double init");
        }
        RefPointTabController.Instance = this;
    }
    RefPointTabController.prototype.Update = function () {
        var self = this;
        if (self._scope.$$phase) {
            self.UpdateInternal();
        }
        else {
            self.$scope.$apply(function () {
                self.UpdateInternal();
            });
        }
    };
    RefPointTabController.prototype.UpdateInternal = function () {
        debugger;
        var self = this;
        self.RefPointModels = new Array();
        var modelNames = Array();
        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.ReferencePoint);
        for (var entIdx in ents) {
            var ent = ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof RefpOintParameters)) {
                throw new Error("Ref entity contains not valid internal data");
            }
            var bcParams = objData.Tag;
            self.RefPointModels.push(bcParams.Model);
        }
    };
    RefPointTabController.prototype.GetSelectedRefpoint = function () {
        if (!this.SelectedItemName) {
            return null;
        }
        var self = this;
        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.ReferencePoint);
        for (var entIdx in ents) {
            var ent = ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof RefpOintParameters)) {
                throw new Error("Ref entity contains not valid internal data");
            }
            var bcParams = objData.Tag;
            if (bcParams.Model.Name == self.SelectedItemName) {
                return ent;
            }
        }
        return null;
    };
    RefPointTabController.prototype.IsSelected = function (model) {
        return (model.Name == this.SelectedItemName);
    };
    RefPointTabController.prototype.SetSelection = function (model) {
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
    };
    RefPointTabController.prototype.RemoveBCTool = function (model) {
        var self = this;
        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.ReferencePoint);
        for (var entIdx in ents) {
            var ent = ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof RefpOintParameters)) {
                throw new Error("Ref entity contains not valid internal data");
            }
            var bcParams = objData.Tag;
            if (bcParams.Model.Name == model.Name) {
                layout.Scene.remove(ent);
                break;
            }
        }
        self.Update();
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    RefPointTabController.$inject = [
        '$scope'
    ];
    return RefPointTabController;
}());
var RefPoint = /** @class */ (function () {
    function RefPoint() {
    }
    return RefPoint;
}());
