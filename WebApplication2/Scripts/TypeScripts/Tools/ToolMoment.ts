/// <reference path="../_reference.d.ts" />

class ToolMoment implements ITool
{
    public Start()
    {
        var self = this;
        var layout = App.Layout;

        layout.SetCursor("default");

        var selPoints = self.GetSelectedPoints();
        if (selPoints.length != 2)
        {
            MessageBox.ShowError("Points not selected. Please select 2 points");
            App.Layout.SetDefaultTool();
            return;
        }

        // Select Group
        //
        self.SelectGroup((group: EntityGroup) =>
        {
            // Get group points
            //
            if (!group.FemMeshId)
            {
                MessageBox.ShowError("Group not contains nodes or faces");
                return;
            }
            var mesh = layout.GetMeshById(group.FemMeshId);
            if (!mesh)
            {
                MessageBox.ShowError("Mesh not found");
                return;
            }

            var groupPoints = new Array<THREE.Vector3>();
            group.Nodes.forEach(node =>
            {
                var vert = mesh.geometry.vertices[node.Number];
                groupPoints.push(vert);
            });

            if (groupPoints.length == 0)
            {
                MessageBox.ShowError("Group not contains nodes or faces");
                return;
            }

            var p1: THREE.Vector3 = selPoints[0];
            var p2: THREE.Vector3 = selPoints[1];

            // Calculate vector of moment
            //
            var momentVec = p2.clone().sub(p1);
            momentVec.normalize();

            if (momentVec.length() == 0)
            {
                MessageBox.ShowError("Vector of moment is zero");
                return;
            }

            InputBox.InputNumber("Input Force (N)", "Input Force (N)",
                (forceVal: number) =>
                {
                    if (forceVal <= 0)
                    {
                        MessageBox.ShowError("Force value lower that zero");
                        return;
                    }

                    momentVec.multiplyScalar(forceVal);
                    RoundVector(momentVec, 3);

                    // Create reference point and attach it to group
                    //
                    var refPointPos = p1.clone().add(p2).divideScalar(2);
                    var refEnt = new RefPointEntity();
                    App.Layout.Scene.add(refEnt);
                    refEnt.position.set(refPointPos.x, refPointPos.y, refPointPos.z);

                    self.AttachPointToGroup(group, refEnt);

                    // Add to group moment condition
                    //
                    self.AddMomentCondition(group, momentVec);
                });
        });
    }

    private AttachPointToGroup(group: EntityGroup, refPoint: RefPointEntity)
    {
        $.post("/Groups/SetReferencePoint?groupName=" + group.Name + "&id=" + refPoint.uuid,
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                App.Layout.Selector.Clear();
            });
    }

    private AddMomentCondition(group: EntityGroup, momentVec: THREE.Vector3)
    {
        $.post("/Groups/AddCondition?" +
            "groupName=" + group.Name +
            "&type=moment",
            JSON.stringify(momentVec),
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                TabGroups.Refresh();
                MessageBox.ShowMessage("Moment Created");
            });
    }

    private SelectGroup(doneCallback: (group: EntityGroup) => void)
    {
        var options: ng.ui.bootstrap.IModalSettings = {
            templateUrl: '/Content/GetView?src=Groups/SelectGroupDialog',
            controller: 'selectGroupDialogCntrl',
            size: "md",
            backdrop: "static"
        };

        var modalService = UIUtility.GetModalService();
        var dlgRes = modalService.open(options).result;
        dlgRes.then((res: any) =>
        {
            // success callback
            doneCallback(res);
        });
    }

    private GetSelectedPoints(): Array<THREE.Vector3>
    {
        var layout = App.Layout;

        var outPoints = new Array<THREE.Vector3>();

        if (layout.Selector.SelectionItems.length == 0)
        {
            return outPoints;
        }

        layout.Selector.SelectionItems.forEach((selItem) =>
        {
            if (selItem instanceof SelectionItemBufVert)
            {
                var selVert = <SelectionItemBufVert>selItem;
                outPoints.push(selVert.Vertex.clone()); 
            }
        });

        return outPoints;
    }

    public End()
    {
        var self = this;

        UIInteractive.Instance.SetMessage("");
    }

    public MouseDown(evt: JQueryMouseEventObject) { }

    public MouseMove(evt: JQueryMouseEventObject) { }

    public MouseUp(evt: JQueryMouseEventObject) { }

    public KeyDown(evt: JQueryKeyEventObject) { }
} 