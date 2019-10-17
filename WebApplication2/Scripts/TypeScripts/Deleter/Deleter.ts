/// <reference path="../_reference.d.ts" />

class Deleter
{
    public static DeleteSelection()
    {
        var layout = App.Layout;
        if (layout.Selector.SelectionItems.length == 0)
        {
            MessageBox.ShowError("Objects not selected");
            return;
        }

        for (var idx in layout.Selector.SelectionItems)
        {
            var item = layout.Selector.SelectionItems[idx];

            if (item instanceof SelectionItemEntity)
            {
                var mesh = App.Layout.GetMeshById(item.EntityId);
                if (mesh)
                {
                    App.Layout.Scene.remove(mesh);
                    // Store operation action for undo/redo
                    OperationManager.CommitDeleteOp(mesh);
                }
            }
        }

        layout.Selector.Clear();
        App.Layout.SetDefaultTool();
    }
}