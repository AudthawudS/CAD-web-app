/// <reference path="../_reference.d.ts" />
/// <reference path="../UI/UIInteractive.ts" />
var TransformMode;
(function (TransformMode) {
    TransformMode[TransformMode["Move"] = 0] = "Move";
    TransformMode[TransformMode["Rotate"] = 1] = "Rotate";
    TransformMode[TransformMode["Scale"] = 2] = "Scale";
})(TransformMode || (TransformMode = {}));
var ToolTransform = /** @class */ (function () {
    function ToolTransform(mode) {
        this._mode = mode;
        this._space = "local";
        this.TransformObject = null;
        this.Ended = new CEvent();
    }
    ToolTransform.prototype.Start = function () {
        debugger;
        this._originalTransform = null;
        App.Layout.SetCursor("default");
        if (!this.TransformObject) {
            var selMeshes = App.Layout.Selector.GetSelectedMeshes();
            if (selMeshes.length == 0) {
                MessageBox.ShowError("Object not selected");
                App.Layout.SetDefaultTool();
                return;
            }
            this.TransformObject = selMeshes[0];
        }
        var transformCntrl = App.Layout.TransformControl;
        transformCntrl.setSpace("local"); // local, world
        if (this._mode == TransformMode.Move) {
            transformCntrl.setMode("translate");
            UIInteractive.Instance.SetMessage("Translate object or Press Enter to input values");
        }
        else if (this._mode == TransformMode.Rotate) {
            transformCntrl.setMode("rotate");
            UIInteractive.Instance.SetMessage("Rotate object or Press Enter to input values");
        }
        else if (this._mode == TransformMode.Scale) {
            transformCntrl.setMode("scale");
            UIInteractive.Instance.SetMessage("Scale object or Press Enter to input values");
        }
        else {
            throw new Error("Not support mode : " + this._mode);
        }
        transformCntrl.setSize(1); // relative size
        this.AttachToEntity(this.TransformObject);
    };
    ToolTransform.prototype.End = function () {
        var layout = App.Layout;
        var transformCntrl = App.Layout.TransformControl;
        if (transformCntrl.object) {
            transformCntrl.detach(transformCntrl.object);
        }
        transformCntrl.setMode("");
        // Also remove from scene
        if (_.contains(layout.Scene.children, transformCntrl)) {
            layout.Scene.remove(transformCntrl);
        }
        this.Ended.fire();
    };
    ToolTransform.prototype.MouseDown = function (evt) {
    };
    ToolTransform.prototype.MouseUp = function (evt) {
    };
    ToolTransform.prototype.AttachToEntity = function (pickEnt) {
        var layout = App.Layout;
        var transformCntrl = App.Layout.TransformControl;
        if (transformCntrl.object == null || transformCntrl.object != pickEnt) {
            if (!(pickEnt instanceof THREE.Mesh)) {
                return;
            }
            var mesh = pickEnt;
            // Add transform control to scene
            //
            if (!_.contains(layout.Scene.children, transformCntrl)) {
                layout.Scene.add(transformCntrl);
            }
            transformCntrl.attach(pickEnt);
            this._originalTransform = mesh.matrix.clone();
        }
    };
    ToolTransform.prototype.MouseMove = function (evt) {
    };
    ToolTransform.prototype.KeyDown = function (evt) {
        debugger;
        var self = this;
        var transformCntrl = App.Layout.TransformControl;
        if (!transformCntrl.object) {
            return;
        }
        if (!(transformCntrl.object instanceof THREE.Mesh)) {
            return;
        }
        var mesh = transformCntrl.object;
        if (evt.keyCode === 27) {
            // Restore orig transform
            if (self._originalTransform != null) {
                mesh.matrix.identity();
                mesh.applyMatrix(self._originalTransform);
            }
            // Abort tool
            App.Layout.SetDefaultTool();
        }
        else if (evt.keyCode === 32) {
            var transformCntrl = App.Layout.TransformControl;
            if (this._space == "local") {
                this._space = "world";
            }
            else {
                this._space = "local";
            }
            transformCntrl.setSpace(this._space);
        }
        else if (evt.keyCode === 13) {
            // Enter coords in modal dialog
            var isAngleInput = (self._mode == TransformMode.Rotate);
            Vector3InputController.Instance.Show(isAngleInput, function (vec) {
                var mesh = transformCntrl.object;
                if (self._mode == TransformMode.Move) {
                    var matTranslate = new THREE.Matrix4();
                    matTranslate.makeTranslation(vec.x, vec.y, vec.z);
                    mesh.applyMatrix(matTranslate);
                }
                else if (self._mode == TransformMode.Rotate) {
                    // Convert to radiance
                    vec.x = (vec.x / 180) * Math.PI;
                    vec.y = (vec.y / 180) * Math.PI;
                    vec.z = (vec.z / 180) * Math.PI;
                    var matRot = new THREE.Matrix4();
                    matRot.makeRotationFromEuler(new THREE.Euler(vec.x, vec.y, vec.z));
                    var origMat = mesh.matrix.clone();
                    mesh.matrix.identity();
                    mesh.applyMatrix(matRot);
                    mesh.applyMatrix(origMat);
                }
            });
        }
    };
    return ToolTransform;
}());
