/// <reference path="../_reference.d.ts" />
/// <reference path="../Editor/Editor.ts" />
/// <reference path="../UI/UIInteractive.ts" />
var ToolMovePoint = /** @class */ (function () {
    function ToolMovePoint() {
    }
    ToolMovePoint.prototype.Start = function () {
        var self = this;
        var selMeshes = App.Layout.Selector.GetSelectedMeshes();
        if (selMeshes.length == 0) {
            MessageBox.ShowError("Object not selected");
            App.Layout.SetDefaultTool();
            return;
        }
        App.Layout.SetCursor("default");
        self._selectedMesh = selMeshes[0];
        self._originalPos = self._selectedMesh.position.clone();
        // First select target 
        var pickOptions = new PickPointOptions("Pick base point");
        pickOptions.IsSnapEnabled = true;
        var baseDeffer = App.Layout.Editor.PickPoint(pickOptions);
        var basePoint;
        baseDeffer
            .then(function (baseRes) {
            basePoint = baseRes.Point;
            var pickOptions = new PickPointOptions("Pick target point");
            pickOptions.IsSnapEnabled = true;
            pickOptions.BasePoint = baseRes.Point;
            pickOptions.MouseMove = function (op, sc, w) { self.TargetMouseMove(op, sc, w); };
            var deffer = App.Layout.Editor.PickPoint(pickOptions);
            return deffer;
        })
            .done(function (targeRes) {
            var translateVec = targeRes.Point.clone().sub(basePoint);
            var destPos = self._originalPos.clone().add(translateVec);
            self._selectedMesh.position.set(destPos.x, destPos.y, destPos.z);
            self._selectedMesh.matrixWorldNeedsUpdate = true;
            self.Clear();
            App.Layout.SetDefaultTool();
        })
            .fail(function () {
            // Restore original position
            self._selectedMesh.position.set(self._originalPos.x, self._originalPos.y, self._originalPos.z);
            self.Clear();
            App.Layout.SetDefaultTool();
        });
    };
    ToolMovePoint.prototype.TargetMouseMove = function (options, screenPnt, worldPnt) {
        var self = this;
        //if (self._selectedMesh)
        //{
        //    var translateVec = worldPnt.clone().sub(options.BasePoint);
        //    var destPos = self._originalPos.clone().add(translateVec);
        //    self._selectedMesh.position.set(destPos.x, destPos.y, destPos.z);
        //    self._selectedMesh.matrixWorldNeedsUpdate = true;
        //}
    };
    ToolMovePoint.prototype.End = function () {
        this.Clear();
    };
    ToolMovePoint.prototype.MouseDown = function (evt) { };
    ToolMovePoint.prototype.MouseMove = function (evt) { };
    ToolMovePoint.prototype.MouseUp = function (evt) { };
    ToolMovePoint.prototype.KeyDown = function (evt) {
        if (evt.which == 27) {
            // Break tool
            App.Layout.SetDefaultTool();
        }
    };
    ToolMovePoint.prototype.Clear = function () {
        UIInteractive.Instance.SetMessage(null);
    };
    return ToolMovePoint;
}());
