/// <reference path="../../_reference.d.ts" />
/// <reference path="../../App.ts" />
var ToolMeasure = /** @class */ (function () {
    function ToolMeasure() {
    }
    ToolMeasure.prototype.Start = function () {
        var self = this;
        App.Layout.SetCursor("default");
        UIInteractive.Instance.SetMessage("");
        $.get("/Content/GetView?src=Home/ToolMeasure", function (data) {
            if (!data) {
                return;
            }
            UIUtility.Compile(data, function (element) {
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
                ToolMeasureController.Instance.ModeChanged.on(function (mode) {
                    self.SetMode(mode);
                });
            });
        });
    };
    ToolMeasure.prototype.SetMode = function (mode) {
        var self = this;
        self._mode = mode;
        if (self._line) {
            App.Layout.Scene.remove(self._line);
        }
        var editor = App.Layout.Editor;
        editor.Cancel();
        if (mode == ToolMeasureMode.Angle) {
            self.ExecuteAngle();
        }
        else {
            self.ExecuteDistance();
        }
    };
    ToolMeasure.prototype.ExecuteAngle = function () {
        var self = this;
        var editor = App.Layout.Editor;
        ToolMeasureController.Instance.SetAngle(0, null, null, null);
        var p1;
        var p2;
        var p3;
        var pickOpt1 = new PickPointOptions("Pick first point");
        editor.PickPoint(pickOpt1)
            .then(function (firstRes) {
            p1 = firstRes.Point;
            var pickOpt2 = new PickPointOptions("Pick second point");
            pickOpt2.BasePoint = firstRes.Point;
            pickOpt2.PlaneType = firstRes.PlaneType;
            return editor.PickPoint(pickOpt2);
        })
            .then(function (secondRes) {
            p2 = secondRes.Point;
            // Create display line
            //
            if (self._line) {
                App.Layout.Scene.remove(self._line);
            }
            var pnts = new Array();
            pnts.push(p1);
            pnts.push(p2);
            self._line = self.CreateLine(pnts);
            // Create new pick options
            var pickOpt2 = new PickPointOptions("Pick third point");
            pickOpt2.BasePoint = secondRes.Point;
            pickOpt2.PlaneType = secondRes.PlaneType;
            return editor.PickPoint(pickOpt2);
        })
            .done(function (thirdRes) {
            p3 = thirdRes.Point;
            var vec1 = p1.clone().sub(p2);
            var vec2 = p3.clone().sub(p2);
            var final = vec2.clone().sub(vec1);
            var angle = vec1.angleTo(vec2) / Math.PI * 180.0;
            ToolMeasureController.Instance.SetAngle(angle, p1, p2, p3);
            // Create display line
            //
            if (self._line) {
                App.Layout.Scene.remove(self._line);
            }
            var pnts = new Array();
            pnts.push(p1);
            pnts.push(p2);
            pnts.push(p3);
            self._line = self.CreateLine(pnts);
            UIInteractive.Instance.SetMessage("Click 'Distance/Angle' button to start new measure");
        });
    };
    ToolMeasure.prototype.ExecuteDistance = function () {
        var self = this;
        var editor = App.Layout.Editor;
        ToolMeasureController.Instance.SetDistance(0, null, null);
        var basePoint;
        var pickOpt1 = new PickPointOptions("Pick first point");
        editor.PickPoint(pickOpt1)
            .then(function (firstRes) {
            basePoint = firstRes.Point;
            var pickOpt2 = new PickPointOptions("Pick second point");
            pickOpt2.BasePoint = firstRes.Point;
            pickOpt2.PlaneType = firstRes.PlaneType;
            return editor.PickPoint(pickOpt2);
        })
            .done(function (secondRes) {
            var dist = Math.round(secondRes.Point.distanceTo(basePoint));
            ToolMeasureController.Instance.SetDistance(dist, basePoint, secondRes.Point);
            // Create display line
            //
            var pnts = new Array();
            pnts.push(basePoint);
            pnts.push(secondRes.Point);
            self._line = self.CreateLine(pnts);
            UIInteractive.Instance.SetMessage("Click 'Distance/Angle' button to start new measure");
        });
    };
    ToolMeasure.prototype.CreateLine = function (pnts) {
        var material = new THREE.LineBasicMaterial({
            color: 0xff0000,
            linewidth: 5,
            fog: false,
            depthTest: false
        });
        var geometry = new THREE.Geometry();
        pnts.forEach(function (p) {
            geometry.vertices.push(p);
        });
        var line = new THREE.Line(geometry, material);
        App.Layout.Scene.add(line);
        return line;
    };
    ToolMeasure.prototype.End = function () {
        var self = this;
        App.Layout.Controls.enabled = true;
        if (self._line) {
            App.Layout.Scene.remove(self._line);
        }
        if (self._dialog) {
            self._dialog.remove();
        }
        UIInteractive.Instance.SetMessage(null);
    };
    ToolMeasure.prototype.MouseDown = function (evt) { };
    ToolMeasure.prototype.MouseMove = function (evt) { };
    ToolMeasure.prototype.MouseUp = function (evt) { };
    ToolMeasure.prototype.KeyDown = function (evt) {
        if (evt.which == 27) {
            // Break tool
            App.Layout.SetDefaultTool();
        }
    };
    return ToolMeasure;
}());
var ToolMeasureMode;
(function (ToolMeasureMode) {
    ToolMeasureMode[ToolMeasureMode["None"] = 0] = "None";
    ToolMeasureMode[ToolMeasureMode["Distance"] = 1] = "Distance";
    ToolMeasureMode[ToolMeasureMode["Angle"] = 2] = "Angle";
})(ToolMeasureMode || (ToolMeasureMode = {}));
