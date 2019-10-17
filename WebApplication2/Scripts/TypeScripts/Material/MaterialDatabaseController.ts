/// <reference path="../_reference.d.ts" />
/// <reference path="../typings/angular/angular-ui-bootstrap.d.ts" />
/// <reference path="./Material.ts" />

class MaterialDatabaseController
{
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope',
        '$modalInstance',
        '$uibModal'
    ];

    private _scope: ng.IScope;

    private _modalService: ng.ui.bootstrap.IModalService;

    private _modalInstance: ng.ui.bootstrap.IModalServiceInstance;

    private ActivateMaterial: Material;

    private IsLoading: boolean;

    private Materials: Array<Material>;

    private DeletedMaterials: Array<Material>;

    private AddedMaterials: Array<Material>;

    private EditedMaterials: Array<Material>;
  

    constructor(
        $scope: ng.IScope,
        $modalInstance: ng.ui.bootstrap.IModalServiceInstance,
        $uibModal: ng.ui.bootstrap.IModalService)
    {
        this._scope = $scope;
        this._modalInstance = $modalInstance;
        this._modalService = $uibModal;

        this.DeletedMaterials = new Array<Material>();
        this.AddedMaterials = new Array<Material>();
        this.EditedMaterials = new Array<Material>();
       

        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        (<any>$scope).vm = this;

        this.ActivateMaterial = null;
        this.IsLoading = false;
        this.Materials = null;

        this.UpdateDatabaseList();
    }
  
    private UpdateDatabaseList()
    {
        
        var self = this;

        self.IsLoading = true;
        self.ActivateMaterial = null;
        self.ApplyScopeChanges();

        $.getJSON("/Material/GetMaterials", (data) =>
        {
            if (!ErrorHandler.CheckJsonRes(data))
            {
                return;
            }

            var materials: Array<Material> = data.Materials;
            var activateName = null;
            if (data.ActivateName != null) {
                    activateName = data.ActivateName;
                }
                else{
                    activateName = "Aluminium";   
                }

            self._scope.$apply(() =>
            {
                self.Materials = materials;
                self.ActivateMaterial = _.find(materials, (m) => { return m.Name == activateName; });
                self.IsLoading = false;
            });
        });
    }
    public IsSelected(material: Material) {
        return (material.Name == this.ActivateMaterial.Name);
    }
   
    private GetActivateName()
    {
        
       
       if (!this.ActivateMaterial)
       {        
          return "Not Set";
        }       
        return this.ActivateMaterial.Name;
    }

    private AddMaterialDialog()
    {
        var self = this;

        var newMaterial = new Material();

        var options: ng.ui.bootstrap.IModalSettings = {
            templateUrl: '/Content/GetView?src=Material/MaterialEditDialog',
            controller: 'editMaterialCntrl',
            size: "md",
            backdrop: "static",
            resolve:
            {
                material: () =>
                {
                    return newMaterial;
                }
            }
        };
        var dlgRes = this._modalService.open(options).result;
        dlgRes.then((res: any) =>
        {
            // success callback
            self.AddedMaterials.push(newMaterial);
            self.Materials.push(newMaterial);
        });
    }

    private EditMaterialDialog(material: Material)
    {
        var self = this;
        var options: ng.ui.bootstrap.IModalSettings = {
            templateUrl: '/Content/GetView?src=Material/MaterialEditDialog',
            controller: 'editMaterialCntrl',
            size: "md",
            backdrop: "static",
            resolve:
            {
                material: () =>
                {
                    return material;
                }
            }
        };
        var dlgRes = this._modalService.open(options).result;
        dlgRes.then((res: any) =>
        {
            // success callback
            self.EditedMaterials.push(material);
        });
    }

    private DeleteMaterial(material: Material)
    {
        this.Materials = _.without(this.Materials, material);

        this.DeletedMaterials.push(material);
    }

    private SelectMaterial(material: Material)
    {
        this.ActivateMaterial = material;
    }

    private Accept()
    {
        var self = this;

        self.IsLoading = true;
        self.ApplyScopeChanges();

        var activeName: string = "";
        if (self.ActivateMaterial)
        {
            activeName = self.ActivateMaterial.Name;
        }

        var editData =
            {
                AddedMaterials : self.AddedMaterials,
                EditMaterials: self.EditedMaterials,
                DeletedMaterials: self.DeletedMaterials,
                ActiveName: activeName
            };

        $.post("/Material/EditMaterials",
            JSON.stringify(editData),
            (data: any, textStatus: string, jqXHR: JQueryXHR) =>
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    jqXHR.abort();
                    return;
                }
            })
            .then(() =>
            {
                self.IsLoading = false;
                // when all 'post' done, close dialog
                self._modalInstance.close();
            });
    }

    private ApplyScopeChanges()
    {
        var self = this;
        if (!self._scope.$$phase)
        {
            self._scope.$apply();
        }
    }

    private Cancel()
    {
        var self = this;
        self._modalInstance.dismiss();
    }
}
