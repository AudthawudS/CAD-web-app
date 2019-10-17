/// <reference path="../_reference.d.ts" />
var BCToolTabController = /** @class */ (function () {
    function BCToolTabController($scope) {
        this.$scope = $scope;
        this._scope = $scope;
        this.IsLoading = false;
        this.BCToolModels = null;
        this.SelectedItemName = null;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        $scope.vm = this;
        if (BCToolTabController.Instance) {
            throw new Error("BCToolTabController double init");
        }
        BCToolTabController.Instance = this;
    }
    BCToolTabController.prototype.Update = function () {
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
    BCToolTabController.prototype.UpdateInternal = function () {
        var self = this;
        self.BCToolModels = new Array();
        var modelNames = Array();
        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.BCTool);
        for (var entIdx in ents) {
            var ent = ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof BCToolParameters)) {
                throw new Error("BC Tool entity contains not valid internal data");
            }
            var bcParams = objData.Tag;
            self.BCToolModels.push(bcParams.Model);
            modelNames.push(bcParams.Model.Name);
        }
        if (!_.contains(modelNames, self.SelectedItemName)) {
            // current selected name not exist
            self.SelectedItemName = null;
        }
        if (!self.SelectedItemName) {
            // Try set fist tool
            if (modelNames.length > 0) {
                self.SelectedItemName = modelNames[0];
            }
        }
        if (self.SelectedItemName) {
            App.Ribbon.EnableBCEditButtons(true);
        }
        else {
            App.Ribbon.EnableBCEditButtons(false);
        }
    };
    BCToolTabController.prototype.GetSelectedBCTool = function () {
        if (!this.SelectedItemName) {
            return null;
        }
        var self = this;
        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.BCTool);
        for (var entIdx in ents) {
            var ent = ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof BCToolParameters)) {
                throw new Error("BC Tool entity contains not valid internal data");
            }
            var bcParams = objData.Tag;
            if (bcParams.Model.Name == self.SelectedItemName) {
                return ent;
            }
        }
        return null;
    };
    BCToolTabController.prototype.IsSelected = function (model) {
        return (model.Name == this.SelectedItemName);
    };
    BCToolTabController.prototype.SetSelection = function (model) {
        this.SelectedItemName = model.Name;
        if (this.SelectedItemName) {
            App.Ribbon.EnableBCEditButtons(true);
            App.Layout.SetDefaultTool();
            var selectedMesh = this.GetSelectedBCTool();
            selectedMesh.geometry.computeBoundingBox();
            var box = selectedMesh.geometry.boundingBox.clone();
            box.applyMatrix4(selectedMesh.matrixWorld);
            App.Layout.ZoomToBox(box, true);
        }
    };
    BCToolTabController.prototype.RemoveBCTool = function (model) {
        var self = this;
        var layout = App.Layout;
        var ents = layout.GetEntitiesByType(EntityType.BCTool);
        for (var entIdx in ents) {
            var ent = ents[entIdx];
            var objData = GetObjectData(ent);
            if (!(objData.Tag instanceof BCToolParameters)) {
                throw new Error("BC Tool entity contains not valid internal data");
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
    BCToolTabController.$inject = [
        '$scope'
    ];
    return BCToolTabController;
}());
