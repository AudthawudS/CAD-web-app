/// <reference path="../_reference.d.ts" />

class RefPointEntity extends THREE.Mesh
{
    private _mesh: THREE.Mesh;
    public Tag: any;

    constructor()
    {
        super();

        var self = this;

        var layoutSize = App.Layout.GetExtent().size();
        var size:number = 0;
        if (layoutSize != null)
        {
            size = Math.max(layoutSize.x, layoutSize.y) / 30;            
        }
        if (size == 0)
        {
            size = 1;
        }
        
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        self.material = material;
        var color = ColorUtility.DecimalToTHREE(Settings.FixedSymbolColor);
        material.color.setHex(color.getHex());

        var sphereGeom = new THREE.SphereGeometry(size / 2, 12, 12);
        self.geometry = sphereGeom;

        // add attributes
        self.userData = new ObjectData(EntityType.ReferencePoint, false);
      
        // Create tags for faces for selector
        sphereGeom.faces.forEach((f) =>
        {
            (<any>f).tag = 0;
        });
    }
}