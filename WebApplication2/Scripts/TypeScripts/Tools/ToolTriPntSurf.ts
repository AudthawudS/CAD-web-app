/// <reference path="../_reference.d.ts" />

class ToolTriPntSurf implements ITool
{
    public Start()
    {
        var verts = new Array<THREE.Vector3>();
        _.each(App.Layout.Selector.SelectionItems, (s) =>
        {
            if (s instanceof SelectionItemBufVert)
            {
                verts.push((<SelectionItemBufVert>s).Vertex.clone());
            }
        });

        if (verts.length != 3)
        {
            MessageBox.ShowError("First select 3 vertices");
            return;
        }

        // Create geom
        var geom = new THREE.Geometry();
        _.each(verts, (v) => { geom.vertices.push(v) });
        var face = new THREE.Face3(0, 1, 2);
        geom.faces.push(face);

        var material = new THREE.MeshBasicMaterial(
            {
                color: 0xFFFF00, side: THREE.DoubleSide
            });
        var mesh = new THREE.Mesh(geom, material);
        mesh.userData = new ObjectData(EntityType.TriSurface, true);
        App.Layout.Scene.add(mesh);

        MessageBox.ShowMessage("Surface created");
        App.Layout.SetDefaultTool();
    }

    public End()
    {
    }

    public MouseDown(evt: JQueryMouseEventObject)
    {
    }

    public MouseUp(evt: JQueryMouseEventObject)
    {
    }

    public MouseMove(evt: JQueryMouseEventObject)
    {
    }

    public KeyDown(evt: JQueryKeyEventObject)
    {
    }
}