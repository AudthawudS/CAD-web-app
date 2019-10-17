/// <reference path="../_reference.d.ts" />
/// <reference path="../Project/Project.ts" />
/// <reference path="IOperation.ts" />
/// <reference path="OperationEditEntity.ts" />
/// <reference path="OperationCamera.ts" />
/// <reference path="OperationDelete.ts" />

class OperationManagerClass
{
    private _operations: Array<IOperation>;

    private _opIndex : number;

    private _maxOpCount: number;

    private _btnUndo: JQueryRibbonButton;

    private _btnRedo: JQueryRibbonButton;

    private _isObjectChanged: boolean;

    private _isEnable: boolean;

    constructor()
    {
        var self = this;

        self._maxOpCount = 3;
        self._opIndex = 0;
        self._operations = new Array<IOperation>();
        self._btnUndo = <JQueryRibbonButton>$("#btn-undo");
        self._btnRedo = <JQueryRibbonButton>$("#btn-redo");
        self._isObjectChanged = false;
        self._isEnable = true;


        self._btnRedo.click(function ()
        {
            self.Redo();
        });

        self._btnUndo.click(function ()
        {
            self.Undo();
        });

        $(document).ready(function ()
        {
            self.AttachToEvents();
                        
            self.Reset();

            self.UpdateButtons();
        });
    }

    public Reset()
    {
        var self = this;

        self._operations = new Array<IOperation>();
        self.AddInitOp();
        self.UpdateButtons();
    }

    private AttachToEvents()
    {
        var self = this;

        App.Layout.TransformControl.addEventListener("objectChange", function ()
        {
            self.TransformObjectChanged();
        });
        App.Layout.TransformControl.addEventListener("mouseUp", function ()
        {
            self.CommitEditEntOp();
        });

        App.Layout.Controls.addEventListener("end", function ()
        {
            self.CommitCameraOp();
        });

        Project.Changed.on(function ()
        {
            self.Reset();
        });
    }

    private TransformObjectChanged()
    {
        var self = this;
        self._isObjectChanged = true;
    }

    public Enable()
    {
        this._isEnable = true;
    }

    public Disable()
    {
        this._isEnable = false;
    }

    public IsHaveEditOperations()
    {

    }

    public CommitCameraOp()
    {
        var self = this;

        if (!self._isEnable)
        {
            return;
        }

        var newOp = new OperationCamera();

        var arrReverse = _.clone(self._operations).reverse();
        var prevCamOp = _.find(arrReverse, function (op) { return (op instanceof OperationCamera); });
        if (prevCamOp)
        {
            if ((<OperationCamera>prevCamOp).IsEqual(newOp))
            {
                // Changes not detect
                return;
            }
        }

        self.PrepareOpArray();

        self._operations.push(newOp);
        self._opIndex = self._operations.length - 1;

        self.UpdateButtons();
    }


    public CommitEditEntOp()
    {
        var self = this;

        if (!self._isEnable)
        {
            return;
        }

        if (!self._isObjectChanged)
        {
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
    }

    public CommitDeleteOp(obj: THREE.Object3D)
    {
        var self = this;

        if (!self._isEnable)
        {
            return;
        }
        
        self.PrepareOpArray();

        var newOp = new OperationDelete(obj);
        self._operations.push(newOp);
        self._opIndex = self._operations.length - 1;

        self.UpdateButtons();

        Project.IsDirty = true;
    }

    private PrepareOpArray()
    {
        var self = this;

        if (self._operations.length == 0)
        {
            // Add start operation
            self.AddInitOp();
            return;
        }

        self.ClipOpIndex();

        if (self._operations.length > self._maxOpCount &&
            self._opIndex > 0)
        {
            // Remove first operation
            self._operations.slice(0, 1);
        }


        if (self._opIndex >= 0)
        {
            // Remove elements
            self._operations.splice(self._opIndex + 1);
        }

    }

    private AddInitOp()
    {
        var self = this;

        if (self._operations.length == 0)
        {
            var newOp = new OperationEditEntity();
            self._operations.push(newOp);
            self._opIndex = 0;
        }
    }

    private ClipOpIndex()
    {
        var self = this;

        self._opIndex = Math.max(self._opIndex, 0);
        self._opIndex = Math.min(self._opIndex, self._operations.length - 1);
    }

    private Undo(): void
    {
        var self = this;
        if (self._operations.length == 0)
        {
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
    }

    private Redo(): void
    {
        var self = this;
        if (self._operations.length == 0)
        {
            self._opIndex = -1;
            return;
        }
        self._opIndex++;
        self.ClipOpIndex();        

        var curOp = self._operations[self._opIndex];
        curOp.Apply();

        self.UpdateButtons();
    }

    private UpdateButtons()
    {
        var self = this;

        self._btnUndo.enableRbButton();
        self._btnRedo.enableRbButton();

        if (self._operations.length == 0)
        {
            self._btnUndo.disableRbButton();
            self._btnRedo.disableRbButton();
            return;
        }

        if (self._opIndex == 0)
        {
            self._btnUndo.disableRbButton();
        }
        if (self._opIndex == (self._operations.length - 1))
        {
            self._btnRedo.disableRbButton();
        }
    }
}

var OperationManager = new OperationManagerClass();