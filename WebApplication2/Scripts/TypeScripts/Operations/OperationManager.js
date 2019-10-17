/// <reference path="../_reference.d.ts" />
/// <reference path="../Project/Project.ts" />
/// <reference path="IOperation.ts" />
/// <reference path="OperationEditEntity.ts" />
/// <reference path="OperationCamera.ts" />
/// <reference path="OperationDelete.ts" />
var OperationManagerClass = /** @class */ (function () {
    function OperationManagerClass() {
        var self = this;
        self._maxOpCount = 3;
        self._opIndex = 0;
        self._operations = new Array();
        self._btnUndo = $("#btn-undo");
        self._btnRedo = $("#btn-redo");
        self._isObjectChanged = false;
        self._isEnable = true;
        self._btnRedo.click(function () {
            self.Redo();
        });
        self._btnUndo.click(function () {
            self.Undo();
        });
        $(document).ready(function () {
            self.AttachToEvents();
            self.Reset();
            self.UpdateButtons();
        });
    }
    OperationManagerClass.prototype.Reset = function () {
        var self = this;
        self._operations = new Array();
        self.AddInitOp();
        self.UpdateButtons();
    };
    OperationManagerClass.prototype.AttachToEvents = function () {
        var self = this;
        App.Layout.TransformControl.addEventListener("objectChange", function () {
            self.TransformObjectChanged();
        });
        App.Layout.TransformControl.addEventListener("mouseUp", function () {
            self.CommitEditEntOp();
        });
        App.Layout.Controls.addEventListener("end", function () {
            self.CommitCameraOp();
        });
        Project.Changed.on(function () {
            self.Reset();
        });
    };
    OperationManagerClass.prototype.TransformObjectChanged = function () {
        var self = this;
        self._isObjectChanged = true;
    };
    OperationManagerClass.prototype.Enable = function () {
        this._isEnable = true;
    };
    OperationManagerClass.prototype.Disable = function () {
        this._isEnable = false;
    };
    OperationManagerClass.prototype.IsHaveEditOperations = function () {
    };
    OperationManagerClass.prototype.CommitCameraOp = function () {
        var self = this;
        if (!self._isEnable) {
            return;
        }
        var newOp = new OperationCamera();
        var arrReverse = _.clone(self._operations).reverse();
        var prevCamOp = _.find(arrReverse, function (op) { return (op instanceof OperationCamera); });
        if (prevCamOp) {
            if (prevCamOp.IsEqual(newOp)) {
                // Changes not detect
                return;
            }
        }
        self.PrepareOpArray();
        self._operations.push(newOp);
        self._opIndex = self._operations.length - 1;
        self.UpdateButtons();
    };
    OperationManagerClass.prototype.CommitEditEntOp = function () {
        var self = this;
        if (!self._isEnable) {
            return;
        }
        if (!self._isObjectChanged) {
            // If changed not detected, then return
            return;
        }
        // Reset flag
        self._isObjectChanged = false;
        self.PrepareOpArray();
        var newOp = new OperationEditEntity();
        self._operations.push(newOp);
        self._opIndex = self._operations.length - 1;
        self.UpdateButtons();
        Project.IsDirty = true;
    };
    OperationManagerClass.prototype.CommitDeleteOp = function (obj) {
        var self = this;
        if (!self._isEnable) {
            return;
        }
        self.PrepareOpArray();
        var newOp = new OperationDelete(obj);
        self._operations.push(newOp);
        self._opIndex = self._operations.length - 1;
        self.UpdateButtons();
        Project.IsDirty = true;
    };
    OperationManagerClass.prototype.PrepareOpArray = function () {
        var self = this;
        if (self._operations.length == 0) {
            // Add start operation
            self.AddInitOp();
            return;
        }
        self.ClipOpIndex();
        if (self._operations.length > self._maxOpCount &&
            self._opIndex > 0) {
            // Remove first operation
            self._operations.slice(0, 1);
        }
        if (self._opIndex >= 0) {
            // Remove elements
            self._operations.splice(self._opIndex + 1);
        }
    };
    OperationManagerClass.prototype.AddInitOp = function () {
        var self = this;
        if (self._operations.length == 0) {
            var newOp = new OperationEditEntity();
            self._operations.push(newOp);
            self._opIndex = 0;
        }
    };
    OperationManagerClass.prototype.ClipOpIndex = function () {
        var self = this;
        self._opIndex = Math.max(self._opIndex, 0);
        self._opIndex = Math.min(self._opIndex, self._operations.length - 1);
    };
    OperationManagerClass.prototype.Undo = function () {
        var self = this;
        if (self._operations.length == 0) {
            self._opIndex = -1;
            return;
        }
        self.ClipOpIndex();
        var curOp = self._operations[self._opIndex];
        curOp.Undo();
        self._opIndex--;
        self.ClipOpIndex();
        var newOp = self._operations[self._opIndex];
        newOp.Apply();
        self.UpdateButtons();
    };
    OperationManagerClass.prototype.Redo = function () {
        var self = this;
        if (self._operations.length == 0) {
            self._opIndex = -1;
            return;
        }
        self._opIndex++;
        self.ClipOpIndex();
        var curOp = self._operations[self._opIndex];
        curOp.Apply();
        self.UpdateButtons();
    };
    OperationManagerClass.prototype.UpdateButtons = function () {
        var self = this;
        self._btnUndo.enableRbButton();
        self._btnRedo.enableRbButton();
        if (self._operations.length == 0) {
            self._btnUndo.disableRbButton();
            self._btnRedo.disableRbButton();
            return;
        }
        if (self._opIndex == 0) {
            self._btnUndo.disableRbButton();
        }
        if (self._opIndex == (self._operations.length - 1)) {
            self._btnRedo.disableRbButton();
        }
    };
    return OperationManagerClass;
}());
var OperationManager = new OperationManagerClass();
