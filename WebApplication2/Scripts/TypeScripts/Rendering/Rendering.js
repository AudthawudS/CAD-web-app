/// <reference path="../_reference.d.ts" />
/// <reference path="../Utilities/ColorUtility.ts" />
var RenderingClass = /** @class */ (function () {
    function RenderingClass() {
        var self = this;
        self._renderingMode = RenderingModeType.ShadingEdge;
    }
    RenderingClass.prototype.GetRenderingMode = function () {
        return this._renderingMode;
    };
    RenderingClass.prototype.SetRenderingMode = function (mode) {
        var self = this;
        self._renderingMode = mode;
        var layout = App.Layout;
        var ents = layout.GetEntities(true);
        for (var idx in ents) {
            var ent = ents[idx];
            var entType = GetEntityType(ent);
            if (entType == EntityType.ReferencePoint) {
                // Skip reference point
                continue;
            }
            if (ent instanceof THREE.Mesh) {
                var mesh = ent;
                var material = ent.material;
                if (material.wireframe != undefined) {
                    // First remove helper chider
                    for (var idxChild in mesh.children) {
                        var child = mesh.children[idxChild];
                        if (child instanceof THREE.WireframeHelper) {
                            mesh.remove(child);
                        }
                    }
                    if (mode == RenderingModeType.Wireframe) {
                        mesh.material = self.GetMeshMaterial(MeshMaterialType.Default);
                        mesh.material.wireframe = true;
                    }
                    else if (mode == RenderingModeType.Shading) {
                        mesh.material = self.GetMeshMaterial(MeshMaterialType.Default);
                    }
                    else if (mode == RenderingModeType.ShadingEdge) {
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
                    else {
                        throw Error("Unsupported mode : " + mode);
                    }
                }
            }
        }
    };
    RenderingClass.prototype.GetMeshMaterial = function (type) {
        var material;
        if (type == MeshMaterialType.Default) {
            var color = ColorUtility.DecimalToTHREE(Settings.ShadingColor);
            material = new THREE.MeshLambertMaterial({ color: 0x00ff00, side: THREE.DoubleSide });
            material.color.setRGB(color.r, color.g, color.b);
        }
        else {
            throw new Error("Not supported material type :" + type);
        }
        return material;
    };
    RenderingClass.prototype.EnableGrid = function (enabled) {
        var layout = App.Layout;
        if (enabled) {
            layout.CreateGrid();
        }
        else {
            layout.RemoveGrid();
        }
    };
    RenderingClass.prototype.EnableFixedSymbols = function (enabled) {
        var ents = App.Layout.GetEntitiesByType(EntityType.FixedSymb);
        ents.forEach(function (ent) {
            ent.visible = enabled;
        });
    };
    RenderingClass.prototype.EnableMomentSymbols = function (enabled) {
        var ents = App.Layout.GetEntitiesByType(EntityType.MomentSymb);
        ents.forEach(function (ent) {
            ent.visible = enabled;
        });
    };
    RenderingClass.prototype.EnableLoadArrows = function (enabled) {
        var ents = App.Layout.GetEntitiesByType(EntityType.ForceArrow);
        ents.forEach(function (ent) {
            ent.visible = enabled;
        });
    };
    RenderingClass.prototype.SetViewerBackgroundColor = function (colorInt) {
        var color = ColorUtility.DecimalToTHREE(colorInt);
        App.Layout.Renderer.setClearColor(color);
    };
    RenderingClass.prototype.SetMomentColor = function (color) {
        var colorThree = ColorUtility.DecimalToTHREE(color);
        var ents = App.Layout.GetEntitiesByType(EntityType.MomentSymb);
        ents.forEach(function (ent) {
            ent.Material.color.setHex(colorThree.getHex());
        });
    };
    RenderingClass.prototype.SetForceArrowsColor = function (color) {
        var colorThree = ColorUtility.DecimalToTHREE(color);
        var ents = App.Layout.GetEntitiesByType(EntityType.ForceArrow);
        ents.forEach(function (ent) {
            ent.Material.color.setHex(colorThree.getHex());
        });
    };
    RenderingClass.prototype.SetFixedSymbolColor = function (color) {
        var colorThree = ColorUtility.DecimalToTHREE(color);
        var ents = App.Layout.GetEntitiesByType(EntityType.FixedSymb);
        ents.forEach(function (ent) {
            ent.Material.color.setHex(colorThree.getHex());
        });
    };
    return RenderingClass;
}());
var MeshMaterialType;
(function (MeshMaterialType) {
    MeshMaterialType[MeshMaterialType["Default"] = 0] = "Default";
})(MeshMaterialType || (MeshMaterialType = {}));
var RenderingModeType;
(function (RenderingModeType) {
    RenderingModeType[RenderingModeType["Wireframe"] = 0] = "Wireframe";
    RenderingModeType[RenderingModeType["Shading"] = 1] = "Shading";
    RenderingModeType[RenderingModeType["ShadingEdge"] = 2] = "ShadingEdge";
})(RenderingModeType || (RenderingModeType = {}));
var Rendering = new RenderingClass();
