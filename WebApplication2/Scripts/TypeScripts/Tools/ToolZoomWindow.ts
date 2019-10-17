/// <reference path="../_reference.d.ts" />

class ToolZoomWindow implements ITool
{
    private _rect: JQuery;

    private _mouseDownPos: THREE.Vector2;

    public Start()
    {
        var inst = this;
        inst._rect = $("<div class='ToolZoomWindow'></div>");
        inst._rect.hide();

        $(".ToolZoomWindow").remove();// remove prev if Exist
        $("body").append(inst._rect);

        // Change navigation
        App.Layout.Controls.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: -1/*none*/ };
        App.Layout.SetCursor("crosshair");

        UIInteractive.Instance.SetMessage("Specify window");
    }

    private Clear()
    {
        $(".ToolZoomWindow").remove();

        // Restore navigation buttons
        App.Layout.Controls.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
        App.Layout.SetCursor("default");

        UIInteractive.Instance.SetMessage(null);
    }

    public End()
    {
        this.Clear();
    }

    public MouseDown(evt: JQueryMouseEventObject)
    {
        var self = this;
        if (evt.button != 0)// left mouse
        {
            self._mouseDownPos = null;
            return;
        }

        self._mouseDownPos = new THREE.Vector2(evt.clientX, evt.clientY);

        self._rect.css('left', evt.offsetX + 'px');
        self._rect.css('top', evt.offsetY + 'px');
    }

    public MouseMove(evt: JQueryMouseEventObject)
    {
        var self = this;

        if (self._mouseDownPos == null)
        {
            return;
        }

        var pos = new THREE.Vector2(0, 0);
        pos.x = evt.clientX - self._mouseDownPos.x;
        pos.y = evt.clientY - self._mouseDownPos.y;

        var w = Math.abs(pos.x);
        var h = Math.abs(pos.y);
        if (w < 1 || h < 1)
        {
            return;
        }

        var rect = self._rect;
        rect.show();

        var posDown = new THREE.Vector2(0, 0);
        posDown.x = evt.clientX;
        posDown.y = evt.clientY;

        var box = new THREE.Box2();
        box.min.x = Math.min(posDown.x, self._mouseDownPos.x);
        box.min.y = Math.min(posDown.y, self._mouseDownPos.y);
        box.max.x = Math.max(posDown.x, self._mouseDownPos.x);
        box.max.y = Math.max(posDown.y, self._mouseDownPos.y);

        var size = box.size();

        rect.css({
            left: box.min.x + 'px',
            top: box.min.y + 'px',
            width: size.x + 'px',
            height: size.y + 'px'
        });
    }

    public MouseUp(evt: JQueryMouseEventObject)
    {
        var self = this;

        if (self._mouseDownPos == null)
        {
            return;
        }

        var posUp = new THREE.Vector2(0, 0);
        posUp.x = evt.clientX;
        posUp.y = evt.clientY;

        var box = new THREE.Box2();
        box.min.x = Math.min(posUp.x, self._mouseDownPos.x);
        box.min.y = Math.min(posUp.y, self._mouseDownPos.y);
        box.max.x = Math.max(posUp.x, self._mouseDownPos.x);
        box.max.y = Math.max(posUp.y, self._mouseDownPos.y);

        // Set min size 10x10 px
        //
        if (box.size().x < 5 || box.size().y < 5)
        {
            return;
        }

        self._mouseDownPos = null;
        self._rect.hide();

        var layout = App.Layout;
        var camera = layout.Camera;

        var canvasSize = layout.GetSize();
        var camScreenPos = layout.WorldToScreen(camera.position);

        var screenOffset = layout.GetScreenOffset();
        var screenWinCenter = box.center().sub(screenOffset);
        layout.Controls.pan(
            (canvasSize.x / 2) - screenWinCenter.x,
            (canvasSize.y / 2) - screenWinCenter.y);
       
        var maxVal = Math.max(box.size().y, box.size().x);
        var coeff = canvasSize.y / maxVal;
        layout.Controls.dollyIn(coeff);
    }


    public KeyDown(evt: JQueryKeyEventObject)
    {
    }
}