/// <reference path="../_reference.d.ts" />
/// <reference path="../App.ts" />

class ToolPan implements ITool
{
    public Start()
    {
        App.Layout.Controls.enabled = true;
        App.Layout.Controls.resetState();//owner custom function
        App.Layout.SetCursor("move");

        UIInteractive.Instance.SetMessage("Use left button of mouse for Pan and right button for Rotate");
    }

    public End()
    {
        UIInteractive.Instance.SetMessage(null);
    }

    public MouseDown(evt: JQueryMouseEventObject) { }

    public MouseMove(evt: JQueryMouseEventObject) { }

    public MouseUp(evt: JQueryMouseEventObject) { }

    public KeyDown(evt: JQueryKeyEventObject) { }
}