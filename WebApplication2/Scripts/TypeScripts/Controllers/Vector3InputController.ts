/// <reference path="../_reference.d.ts" />

interface Vector3InputCallback
{
    (vec: THREE.Vector3): void;
}

class Vector3InputController
{
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope'
    ];

    private _scope: ng.IScope;

    public static Instance: Vector3InputController;

    public x: number;

    public y: number;

    public z: number;

    public Units: string;

    private _callback: Vector3InputCallback;

    constructor(private $scope: ng.IScope)
    {
         this._scope = $scope;

        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        (<any>$scope).vm = this;

        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.Units = "";

        Vector3InputController.Instance = this;
    }

    public Accept()
    {
       
        if (this._callback != null)
        {
            this._callback(new THREE.Vector3(this.x, this.y, this.z));

           var RefPointModels = new Array<RefPointModel>();
            var modelNames = Array<string>();
            var layout = App.Layout;
            var scene = App.Layout.Scene;
            var ents = layout.GetEntitiesByType(EntityType.ReferencePoint);

            for (var entIdx in ents) {

                if ((ents.length - 1).toString() == entIdx) {
                    var ent = <THREE.Mesh>ents[entIdx];
                    var objData = GetObjectData(ent);
                    if (!(objData.Tag instanceof RefpOintParameters)) {
                        throw new Error("Ref entity contains not valid internal data");
                    }
                    var bcParams = <RefpOintParameters>objData.Tag;
                    bcParams.Model.x = this.x;
                    bcParams.Model.y = this.y;
                    bcParams.Model.z = this.z;

                    var userData = new ObjectData(EntityType.ReferencePoint, false);
                    userData.Tag = bcParams;
                    //var objData = GetObjectData(mesh);
                    //objData.Tag = _params;
                    ent.userData = userData;

                    ent.updateMatrix();
                }
                
            }
            RefPointTabController.Instance.Update();
        }
    }

    public Show(isAngle: boolean, callback: Vector3InputCallback)
    {
        
        var self = this;

        this.$scope.$apply(function ()
        {
            self.x = 0;
            self.y = 0;
            self.z = 0;
            if (isAngle)
            {
                self.Units = "Degrees"
            }
            else
            {
                self.Units = Settings.GetUnitsName();
            }
        });

        self._callback = callback;
        $("#modal-vector3Input-dialog").modal();
    }
}