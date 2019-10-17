/// <reference path="../_reference.d.ts" />
var Deleter = /** @class */ (function () {
    function Deleter() {
    }
    Deleter.DeleteSelection = function () {
        var layout = App.Layout;
        if (layout.Selector.SelectionItems.length == 0) {
            MessageBox.ShowError("Objects not selected");
            return;
        }
        for (var idx in layout.Selector.SelectionItems) {
            var item = layout.Selector.SelectionItems[idx];
            if (item instanceof SelectionItemEntity) {
                var mesh = App.Layout.GetMeshById(item.EntityId);
                if (mesh) {
                    App.Layout.Scene.remove(mesh);
                    // Store operation action for undo/redo
                    OperationManager.CommitDeleteOp(mesh);
                }
            }
        }
        layout.Selector.Clear();
        App.Layout.SetDefaultTool();
    };
    return Deleter;
}());
