/// <reference path="../_reference.d.ts" />
/// <reference path="../Editor/Editor.ts" />
/// <reference path="../UI/UIInteractive.ts" />
/// <reference path="./ToolTransfrom.ts" />
/// <reference path="../Operations/OperationManager.ts" />
var ToolRotateAtPoint = /** @class */ (function () {
    function ToolRotateAtPoint() {
    }
    ToolRotateAtPoint.prototype.Start = function () {
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
        self._selectedMesh.geometry.computeBoundingBox();
        var meshBox = self._selectedMesh.geometry.boundingBox;
        var meshSize = meshBox.max.clone().sub(meshBox.min);
        var defaultRotatePoint = self._selectedMesh.position.clone();
        var pickOptions = new PickPointOptions("Pick rotate point");
        pickOptions.BasePoint = defaultRotatePoint;
        // Select rotate point
        var baseDeffer = App.Layout.Editor.PickPoint(pickOptions);
        baseDeffer.done(function (targetRes) {
            var material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0
            });
            var meshPos = self._selectedMesh.position.clone();
            var geometry = new THREE.BoxGeometry(meshSize.x, meshSize.y, meshSize.z);
            var tempObject = new THREE.Mesh(geometry, material);
            App.Layout.Scene.add(tempObject);
            tempObject.position.set(targetRes.Point.x, targetRes.Point.y, targetRes.Point.z);
            // Create transform tool
            var transformTool = new ToolTransform(TransformMode.Rotate);
            // Set up transform object
            transformTool.TransformObject = tempObject;
            tempObject.add(self._selectedMesh);
            var translateVec = meshPos.clone().sub(targetRes.Point);
            self._selectedMesh.position.set(translateVec.x, translateVec.y, translateVec.z);
            App.Layout.Scene.add(tempObject);
            OperationManager.Disable();
            // Attach to complete event
            transformTool.Ended.on(function () {
                var worldMat = self._selectedMesh.matrixWorld.clone();
                // Handler of end transform tool
                App.Layout.Scene.remove(tempObject);
                // Move back original mesh to scene
                App.Layout.Scene.add(self._selectedMesh);
                // Restore world position and rotation
                self._selectedMesh.matrix.identity();
                self._selectedMesh.applyMatrix(worldMat);
                OperationManager.Enable();
                OperationManager.CommitEditEntOp();
                OperationManager.CommitCameraOp();
            });
            App.Layout.SetTool(transformTool);
        })
            .fail(function () {
            self.Clear();
            App.Layout.SetDefaultTool();
        });
    };
    ToolRotateAtPoint.prototype.End = function () {
        this.Clear();
    };
    ToolRotateAtPoint.prototype.MouseDown = function (evt) { };
    ToolRotateAtPoint.prototype.MouseMove = function (evt) { };
    ToolRotateAtPoint.prototype.MouseUp = function (evt) { };
    ToolRotateAtPoint.prototype.KeyDown = function (evt) { };
    ToolRotateAtPoint.prototype.Clear = function () {
        UIInteractive.Instance.SetMessage(null);
    };
    return ToolRotateAtPoint;
}());
