/// <reference path="../../_reference.d.ts" />
/// <reference path="../../App.ts" />

class ToolMeasure implements ITool
{
    private _mode: ToolMeasureMode;

    private _line: THREE.Line;

    private _dialog: JQuery;

    public Start()
    {
        var self = this;

        App.Layout.SetCursor("default");
        UIInteractive.Instance.SetMessage("");

        $.get("/Content/GetView?src=Home/ToolMeasure",
            function (data)
            {
                if (!data)
                {
                    return;
                }

                UIUtility.Compile(data, (element: JQuery) =>
                {
                    self._dialog = element;

                    $("body").append(element);
                    var layoutPos = App.Layout.GetContainer().position();
                    element.css("left", Math.round(layoutPos.left) + "px");
                    element.css("top", Math.round(layoutPos.top) + "px");

                    $(element).draggable({
                        handle: ".panel-heading"
                    });
                    // Set Distance mode by default
                    self.SetMode(ToolMeasureMode.Distance);

                    // Attach to event "change mode"
                    ToolMeasureController.Instance.ModeChanged.on((mode: ToolMeasureMode) =>
                    {
                        self.SetMode(mode);
                    });
                });
            });
    }

    private SetMode(mode: ToolMeasureMode)
    {
        var self = this;
        self._mode = mode;

        if (self._line)
        {
            App.Layout.Scene.remove(self._line);
        }

        var editor = App.Layout.Editor;
        editor.Cancel();

        if (mode == ToolMeasureMode.Angle)
        {
            self.ExecuteAngle();
        }
        else
        {
            self.ExecuteDistance();
        }
    }

    private ExecuteAngle()
    {
        var self = this;
        var editor = App.Layout.Editor;

        ToolMeasureController.Instance.SetAngle(0, null, null, null);

        var p1: THREE.Vector3;
        var p2: THREE.Vector3;
        var p3: THREE.Vector3;

        var pickOpt1 = new PickPointOptions("Pick first point");

        editor.PickPoint(pickOpt1)
            .then((firstRes: PickPointRes) =>
            {
                p1 = firstRes.Point;

                var pickOpt2 = new PickPointOptions("Pick second point");
                pickOpt2.BasePoint = firstRes.Point;
                pickOpt2.PlaneType = firstRes.PlaneType;
                return editor.PickPoint(pickOpt2);
            })
            .then((secondRes: PickPointRes) =>
            {
                p2 = secondRes.Point;


                // Create display line
                //
                if (self._line)
                {
                    App.Layout.Scene.remove(self._line);
                }
                var pnts = new Array<THREE.Vector3>();
                pnts.push(p1);
                pnts.push(p2);
                self._line = self.CreateLine(pnts);

                // Create new pick options
                var pickOpt2 = new PickPointOptions("Pick third point");
                pickOpt2.BasePoint = secondRes.Point;
                pickOpt2.PlaneType = secondRes.PlaneType;
                return editor.PickPoint(pickOpt2);
            })
            .done((thirdRes: PickPointRes) =>
            {
                p3 = thirdRes.Point;

                var vec1 = p1.clone().sub(p2);
                var vec2 = p3.clone().sub(p2);
                var final = vec2.clone().sub(vec1);
                var angle = vec1.angleTo(vec2) / Math.PI * 180.0;

                ToolMeasureController.Instance.SetAngle(angle, p1, p2, p3);

                // Create display line
                //
                if (self._line)
                {
                    App.Layout.Scene.remove(self._line);
                }
                var pnts = new Array<THREE.Vector3>();
                pnts.push(p1);
                pnts.push(p2);
                pnts.push(p3);
                self._line = self.CreateLine(pnts);

                UIInteractive.Instance.SetMessage("Click 'Distance/Angle' button to start new measure");
            });
    }

    private ExecuteDistance()
    {
        var self = this;
        var editor = App.Layout.Editor;

        ToolMeasureController.Instance.SetDistance(0, null, null);

        var basePoint: THREE.Vector3;
        var pickOpt1 = new PickPointOptions("Pick first point");
        editor.PickPoint(pickOpt1)
            .then((firstRes: PickPointRes) =>
            {
                basePoint = firstRes.Point;

                var pickOpt2 = new PickPointOptions("Pick second point");
                pickOpt2.BasePoint = firstRes.Point;
                pickOpt2.PlaneType = firstRes.PlaneType;
                return editor.PickPoint(pickOpt2);
            })
            .done((secondRes: PickPointRes) =>
            {
                var dist = Math.round(secondRes.Point.distanceTo(basePoint));

                ToolMeasureController.Instance.SetDistance(dist, basePoint, secondRes.Point);

                // Create display line
                //
                var pnts = new Array<THREE.Vector3>();
                pnts.push(basePoint);
                pnts.push(secondRes.Point);
                self._line = self.CreateLine(pnts);

                UIInteractive.Instance.SetMessage("Click 'Distance/Angle' button to start new measure");
            });
    }

    private CreateLine(pnts: Array<THREE.Vector3>): THREE.Line
    {
        var material = new THREE.LineBasicMaterial({
            color: 0xff0000,
            linewidth: 5,
            fog: false,
            depthTest: false
        });

        var geometry = new THREE.Geometry();
        pnts.forEach((p) =>
        {
            geometry.vertices.push(p);
        });

        var line = new THREE.Line(geometry, material);
        App.Layout.Scene.add(line);

        return line;
    }

    public End()
    {
        var self = this;

        App.Layout.Controls.enabled = true;

        if (self._line)
        {
            App.Layout.Scene.remove(self._line);
        }
        if (self._dialog)
        {
            self._dialog.remove();
        }

        UIInteractive.Instance.SetMessage(null);
    }

    public MouseDown(evt: JQueryMouseEventObject) { }

    public MouseMove(evt: JQueryMouseEventObject) { }

    public MouseUp(evt: JQueryMouseEventObject) { }

    public KeyDown(evt: JQueryKeyEventObject)
    {
        if (evt.which == 27)
        {
            // Break tool
            App.Layout.SetDefaultTool();
        }
    }
}

enum ToolMeasureMode
{
    None,
    Distance,
    Angle
}
