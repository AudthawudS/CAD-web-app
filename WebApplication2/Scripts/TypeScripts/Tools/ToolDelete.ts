/// <reference path="../_reference.d.ts" />

class ToolDelete implements ITool
{
    public Start()
    {
        App.Layout.Controls.enabled = true;
        App.Layout.SetCursor("pointer");
    }

    public End()
    {
        App.Layout.SetCursor("default");
    }

    public MouseDown(evt:JQueryMouseEventObject)
    {
        if (evt.button == 0)// left mouse
        {
            // Disable orbit control on left mouse
            App.Layout.Controls.enabled = false;
        }
    }

    public MouseUp(evt:JQueryMouseEventObject)
    {
        var layout = App.Layout;

        // Enable orbit control on up event
        App.Layout.Controls.enabled = true;

        var mousePos = new THREE.Vector2(evt.clientX, evt.clientY);
        var offset = new THREE.Vector2(5, 5);
        var rect = new THREE.Box2(mousePos.clone().sub(offset), mousePos.clone().add(offset));
        var pickEnt = layout.Selector.GetEntityByScreenRect(rect);
        if (pickEnt == null)
        {
            return;
        }
        App.Layout.Scene.remove(pickEnt);
    }

    public MouseMove(evt:JQueryMouseEventObject)
    {
    }

    public KeyDown(evt:JQueryKeyEventObject)
    {
    }
}