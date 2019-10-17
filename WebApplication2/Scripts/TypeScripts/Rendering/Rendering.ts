/// <reference path="../_reference.d.ts" />
/// <reference path="../Utilities/ColorUtility.ts" />

class RenderingClass
{
    private _renderingMode: RenderingModeType;

    constructor()
    {
        var self = this;

        self._renderingMode = RenderingModeType.ShadingEdge;

    }

    public GetRenderingMode(): RenderingModeType
    {
        return this._renderingMode;
    }

    public SetRenderingMode(mode: RenderingModeType)
    {
        var self = this;

        self._renderingMode = mode;

        var layout = App.Layout;
        var ents = layout.GetEntities(true);
        for (var idx in ents)
        {
            var ent = ents[idx];

            var entType = GetEntityType(ent);
            if (entType == EntityType.ReferencePoint)
            {
                // Skip reference point
                continue;
            }

            if (ent instanceof THREE.Mesh)
            {
                var mesh = <THREE.Mesh>ent;
                var material = (<any>ent).material;
                if (material.wireframe != undefined)
                {
                    // First remove helper chider
                    for (var idxChild in mesh.children)
                    {
                        var child = mesh.children[idxChild];
                        if (child instanceof THREE.WireframeHelper)
                        {
                            mesh.remove(child);
                        }
                    }

                    if (mode == RenderingModeType.Wireframe)
                    {
                        mesh.material = self.GetMeshMaterial(MeshMaterialType.Default);
                        (<any>mesh.material).wireframe = true;
                    }
                    else if (mode == RenderingModeType.Shading)
                    {
                        mesh.material = self.GetMeshMaterial(MeshMaterialType.Default);
                    }
                    else if (mode == RenderingModeType.ShadingEdge)
                    {
                        var color = ColorUtility.DecimalToTHREE(Settings.ShadingColor);

                        var newMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
                        newMaterial.color.setRGB(color.r, color.g, color.b);
                        mesh.material = newMaterial;

                        var wireframeObj = new THREE.WireframeHelper(mesh, 0x000000);
                        wireframeObj.matrix = new THREE.Matrix4();
                        wireframeObj.matrix.identity();
                        wireframeObj.matrixAutoUpdate = true;
                        mesh.add(wireframeObj);
                    }
                    else
                    {
                        throw Error("Unsupported mode : " + mode);
                    }
                }
            }
        }
    }

    public GetMeshMaterial(type: MeshMaterialType): THREE.Material
    {
        var material;
        if (type == MeshMaterialType.Default)
        {
            var color = ColorUtility.DecimalToTHREE(Settings.ShadingColor);
            material = new THREE.MeshLambertMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
            material.color.setRGB(color.r, color.g, color.b);
        }
        else
        {
            throw new Error("Not supported material type :" + type);
        }
        return material;
    }


    public EnableGrid(enabled: boolean)
    {
        var layout = App.Layout;

        if (enabled)
        {
            layout.CreateGrid();
        }
        else
        {
            layout.RemoveGrid();
        }
    }

    public EnableFixedSymbols(enabled: boolean)
    {
        var ents = App.Layout.GetEntitiesByType(EntityType.FixedSymb);
        ents.forEach((ent) =>
        {
            ent.visible = enabled;
        });
    }

    public EnableMomentSymbols(enabled: boolean)
    {
        var ents = App.Layout.GetEntitiesByType(EntityType.MomentSymb);
        ents.forEach((ent) =>
        {
            ent.visible = enabled;
        });
    }

    public EnableLoadArrows(enabled: boolean)
    {
        var ents = App.Layout.GetEntitiesByType(EntityType.ForceArrow);
        ents.forEach((ent) =>
        {
            ent.visible = enabled;
        });
    }

    public SetViewerBackgroundColor(colorInt: number)
    {
        var color = ColorUtility.DecimalToTHREE(colorInt);
        App.Layout.Renderer.setClearColor(color);
    }

    public SetMomentColor(color: number)
    {
        var colorThree = ColorUtility.DecimalToTHREE(color);
        var ents = App.Layout.GetEntitiesByType(EntityType.MomentSymb);
        ents.forEach(function (ent)
        {
            (<MomentEntity>ent).Material.color.setHex(colorThree.getHex());
        });
    }

    public SetForceArrowsColor(color: number)
    {
        var colorThree = ColorUtility.DecimalToTHREE(color);
        var ents = App.Layout.GetEntitiesByType(EntityType.ForceArrow);
        ents.forEach(function (ent)
        {
            (<ForceEntity>ent).Material.color.setHex(colorThree.getHex());
        });
    }

    public SetFixedSymbolColor(color: number)
    {
        var colorThree = ColorUtility.DecimalToTHREE(color);
        var ents = App.Layout.GetEntitiesByType(EntityType.FixedSymb);
        ents.forEach(function (ent)
        {
            (<FixedSymbEntity>ent).Material.color.setHex(colorThree.getHex());
        });
    }

}

enum MeshMaterialType
{
    Default
}

enum RenderingModeType
{
    Wireframe,
    Shading,
    ShadingEdge
}

var Rendering = new RenderingClass();