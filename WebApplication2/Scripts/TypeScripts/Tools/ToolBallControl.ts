/// <reference path="../_reference.d.ts" />
/// <reference path="./ITool.ts" />

/// <reference path="../_reference.d.ts" />

class ToolBallControl implements ITool
{
    public Start()
    {
        App.Layout.Controls.enabled = false;

        App.Layout.ControlsTrackball.noZoom = false;
        App.Layout.ControlsTrackball.noPan = false;
        App.Layout.ControlsTrackball.noRotate = false;
        App.Layout.ControlsTrackball.enabled = true;

        App.Layout.SetCursor("default");
    }

    public End()
    {
        App.Layout.Controls.enabled = true;

        App.Layout.ControlsTrackball.noZoom = true;
        App.Layout.ControlsTrackball.noPan = true;
        App.Layout.ControlsTrackball.noRotate = true;
        App.Layout.ControlsTrackball.enabled = false;

        App.Layout.Camera.up.set(0, 0, 1);
    }

    public MouseDown(evt: JQueryMouseEventObject)
    {
    }

    public MouseMove(evt: JQueryMouseEventObject)
    {
    }

    public MouseUp(evt: JQueryMouseEventObject)
    {
    }

    public KeyDown(evt: JQueryKeyEventObject)
    {
    }
}