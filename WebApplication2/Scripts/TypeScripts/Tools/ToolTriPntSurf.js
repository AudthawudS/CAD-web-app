/// <reference path="../_reference.d.ts" />
var ToolTriPntSurf = /** @class */ (function () {
    function ToolTriPntSurf() {
    }
    ToolTriPntSurf.prototype.Start = function () {
        var verts = new Array();
        _.each(App.Layout.Selector.SelectionItems, function (s) {
            if (s instanceof SelectionItemBufVert) {
                verts.push(s.Vertex.clone());
            }
        });
        if (verts.length != 3) {
            MessageBox.ShowError("First select 3 vertices");
            return;
        }
        // Create geom
        var geom = new THREE.Geometry();
        _.each(verts, function (v) { geom.vertices.push(v); });
        var face = new THREE.Face3(0, 1, 2);
        geom.faces.push(face);
        var material = new THREE.MeshBasicMaterial({
            color: 0xFFFF00, side: THREE.DoubleSide
        });
        var mesh = new THREE.Mesh(geom, material);
        mesh.userData = new ObjectData(EntityType.TriSurface, true);
        App.Layout.Scene.add(mesh);
        MessageBox.ShowMessage("Surface created");
        App.Layout.SetDefaultTool();
    };
    ToolTriPntSurf.prototype.End = function () {
    };
    ToolTriPntSurf.prototype.MouseDown = function (evt) {
    };
    ToolTriPntSurf.prototype.MouseUp = function (evt) {
    };
    ToolTriPntSurf.prototype.MouseMove = function (evt) {
    };
    ToolTriPntSurf.prototype.KeyDown = function (evt) {
    };
    return ToolTriPntSurf;
}());
