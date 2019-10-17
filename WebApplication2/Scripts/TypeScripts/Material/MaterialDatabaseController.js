/// <reference path="../_reference.d.ts" />
/// <reference path="../typings/angular/angular-ui-bootstrap.d.ts" />
/// <reference path="./Material.ts" />
var MaterialDatabaseController = /** @class */ (function () {
    function MaterialDatabaseController($scope, $modalInstance, $uibModal) {
        this._scope = $scope;
        this._modalInstance = $modalInstance;
        this._modalService = $uibModal;
        this.DeletedMaterials = new Array();
        this.AddedMaterials = new Array();
        this.EditedMaterials = new Array();
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        $scope.vm = this;
        this.ActivateMaterial = null;
        this.IsLoading = false;
        this.Materials = null;
        this.UpdateDatabaseList();
    }
    MaterialDatabaseController.prototype.UpdateDatabaseList = function () {
        var self = this;
        self.IsLoading = true;
        self.ActivateMaterial = null;
        self.ApplyScopeChanges();
        $.getJSON("/Material/GetMaterials", function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            var materials = data.Materials;
            var activateName = null;
            if (data.ActivateName != null) {
                activateName = data.ActivateName;
            }
            else {
                activateName = "Aluminium";
            }
            self._scope.$apply(function () {
                self.Materials = materials;
                self.ActivateMaterial = _.find(materials, function (m) { return m.Name == activateName; });
                self.IsLoading = false;
            });
        });
    };
    MaterialDatabaseController.prototype.IsSelected = function (material) {
        return (material.Name == this.ActivateMaterial.Name);
    };
    MaterialDatabaseController.prototype.GetActivateName = function () {
        if (!this.ActivateMaterial) {
            return "Not Set";
        }
        return this.ActivateMaterial.Name;
    };
    MaterialDatabaseController.prototype.AddMaterialDialog = function () {
        var self = this;
        var newMaterial = new Material();
        var options = {
            templateUrl: '/Content/GetView?src=Material/MaterialEditDialog',
            controller: 'editMaterialCntrl',
            size: "md",
            backdrop: "static",
            resolve: {
                material: function () {
                    return newMaterial;
                }
            }
        };
        var dlgRes = this._modalService.open(options).result;
        dlgRes.then(function (res) {
            // success callback
            self.AddedMaterials.push(newMaterial);
            self.Materials.push(newMaterial);
        });
    };
    MaterialDatabaseController.prototype.EditMaterialDialog = function (material) {
        var self = this;
        var options = {
            templateUrl: '/Content/GetView?src=Material/MaterialEditDialog',
            controller: 'editMaterialCntrl',
            size: "md",
            backdrop: "static",
            resolve: {
                material: function () {
                    return material;
                }
            }
        };
        var dlgRes = this._modalService.open(options).result;
        dlgRes.then(function (res) {
            // success callback
            self.EditedMaterials.push(material);
        });
    };
    MaterialDatabaseController.prototype.DeleteMaterial = function (material) {
        this.Materials = _.without(this.Materials, material);
        this.DeletedMaterials.push(material);
    };
    MaterialDatabaseController.prototype.SelectMaterial = function (material) {
        this.ActivateMaterial = material;
    };
    MaterialDatabaseController.prototype.Accept = function () {
        var self = this;
        self.IsLoading = true;
        self.ApplyScopeChanges();
        var activeName = "";
        if (self.ActivateMaterial) {
            activeName = self.ActivateMaterial.Name;
        }
        var editData = {
            AddedMaterials: self.AddedMaterials,
            EditMaterials: self.EditedMaterials,
            DeletedMaterials: self.DeletedMaterials,
            ActiveName: activeName
        };
        $.post("/Material/EditMaterials", JSON.stringify(editData), function (data, textStatus, jqXHR) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                jqXHR.abort();
                return;
            }
        })
            .then(function () {
            self.IsLoading = false;
            // when all 'post' done, close dialog
            self._modalInstance.close();
        });
    };
    MaterialDatabaseController.prototype.ApplyScopeChanges = function () {
        var self = this;
        if (!self._scope.$$phase) {
            self._scope.$apply();
        }
    };
    MaterialDatabaseController.prototype.Cancel = function () {
        var self = this;
        self._modalInstance.dismiss();
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    MaterialDatabaseController.$inject = [
        '$scope',
        '$modalInstance',
        '$uibModal'
    ];
    return MaterialDatabaseController;
}());
