/// <reference path="../_reference.d.ts" />
var ToolMoment = /** @class */ (function () {
    function ToolMoment() {
    }
    ToolMoment.prototype.Start = function () {
        var self = this;
        var layout = App.Layout;
        layout.SetCursor("default");
        var selPoints = self.GetSelectedPoints();
        if (selPoints.length != 2) {
            MessageBox.ShowError("Points not selected. Please select 2 points");
            App.Layout.SetDefaultTool();
            return;
        }
        // Select Group
        //
        self.SelectGroup(function (group) {
            // Get group points
            //
            if (!group.FemMeshId) {
                MessageBox.ShowError("Group not contains nodes or faces");
                return;
            }
            var mesh = layout.GetMeshById(group.FemMeshId);
            if (!mesh) {
                MessageBox.ShowError("Mesh not found");
                return;
            }
            var groupPoints = new Array();
            group.Nodes.forEach(function (node) {
                var vert = mesh.geometry.vertices[node.Number];
                groupPoints.push(vert);
            });
            if (groupPoints.length == 0) {
                MessageBox.ShowError("Group not contains nodes or faces");
                return;
            }
            var p1 = selPoints[0];
            var p2 = selPoints[1];
            // Calculate vector of moment
            //
            var momentVec = p2.clone().sub(p1);
            momentVec.normalize();
            if (momentVec.length() == 0) {
                MessageBox.ShowError("Vector of moment is zero");
                return;
            }
            InputBox.InputNumber("Input Force (N)", "Input Force (N)", function (forceVal) {
                if (forceVal <= 0) {
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
    };
    ToolMoment.prototype.AttachPointToGroup = function (group, refPoint) {
        $.post("/Groups/SetReferencePoint?groupName=" + group.Name + "&id=" + refPoint.uuid, function (data, textStatus) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            App.Layout.Selector.Clear();
        });
    };
    ToolMoment.prototype.AddMomentCondition = function (group, momentVec) {
        $.post("/Groups/AddCondition?" +
            "groupName=" + group.Name +
            "&type=moment", JSON.stringify(momentVec), function (data, textStatus) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            TabGroups.Refresh();
            MessageBox.ShowMessage("Moment Created");
        });
    };
    ToolMoment.prototype.SelectGroup = function (doneCallback) {
        var options = {
            templateUrl: '/Content/GetView?src=Groups/SelectGroupDialog',
            controller: 'selectGroupDialogCntrl',
            size: "md",
            backdrop: "static"
        };
        var modalService = UIUtility.GetModalService();
        var dlgRes = modalService.open(options).result;
        dlgRes.then(function (res) {
            // success callback
            doneCallback(res);
        });
    };
    ToolMoment.prototype.GetSelectedPoints = function () {
        var layout = App.Layout;
        var outPoints = new Array();
        if (layout.Selector.SelectionItems.length == 0) {
            return outPoints;
        }
        layout.Selector.SelectionItems.forEach(function (selItem) {
            if (selItem instanceof SelectionItemBufVert) {
                var selVert = selItem;
                outPoints.push(selVert.Vertex.clone());
            }
        });
        return outPoints;
    };
    ToolMoment.prototype.End = function () {
        var self = this;
        UIInteractive.Instance.SetMessage("");
    };
    ToolMoment.prototype.MouseDown = function (evt) { };
    ToolMoment.prototype.MouseMove = function (evt) { };
    ToolMoment.prototype.MouseUp = function (evt) { };
    ToolMoment.prototype.KeyDown = function (evt) { };
    return ToolMoment;
}());
