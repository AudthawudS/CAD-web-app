/// <reference path="../_reference.d.ts" />
/// <reference path="../Editor/Editor.ts" />
/// <reference path="../UI/UIInteractive.ts" />


class ToolMovePoint implements ITool
{
    private _selectedMesh: THREE.Mesh;

    private _originalPos: THREE.Vector3;

    public Start()
    {
        var self = this;

        var selMeshes = App.Layout.Selector.GetSelectedMeshes();
        if (selMeshes.length == 0)
        {
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

        var basePoint : THREE.Vector3;

        baseDeffer
            .then(function (baseRes: PickPointRes)
            {
                basePoint = baseRes.Point;

                var pickOptions = new PickPointOptions("Pick target point");
                pickOptions.IsSnapEnabled = true;
                pickOptions.BasePoint = baseRes.Point;
                pickOptions.MouseMove = (op, sc, w) => { self.TargetMouseMove(op, sc, w) };

                var deffer = App.Layout.Editor.PickPoint(pickOptions);
                return deffer;
            })
            .done(function (targeRes: PickPointRes)
            {
                var translateVec = targeRes.Point.clone().sub(basePoint);
                var destPos = self._originalPos.clone().add(translateVec);
                self._selectedMesh.position.set(destPos.x, destPos.y, destPos.z);
                self._selectedMesh.matrixWorldNeedsUpdate = true;

                self.Clear();
                App.Layout.SetDefaultTool();
            })
            .fail(function ()
            {
                // Restore original position
                self._selectedMesh.position.set(self._originalPos.x, self._originalPos.y, self._originalPos.z);
                self.Clear();
                App.Layout.SetDefaultTool();
            });
    }

    private TargetMouseMove(options: PickPointOptions, screenPnt: THREE.Vector2, worldPnt: THREE.Vector3)
    {
        var self = this;

        //if (self._selectedMesh)
        //{
        //    var translateVec = worldPnt.clone().sub(options.BasePoint);
        //    var destPos = self._originalPos.clone().add(translateVec);
        //    self._selectedMesh.position.set(destPos.x, destPos.y, destPos.z);
        //    self._selectedMesh.matrixWorldNeedsUpdate = true;
        //}
    }

    public End()
    {
        this.Clear();
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

    private Clear()
    {
        UIInteractive.Instance.SetMessage(null);        
    }

}
