/// <reference path="../_reference.d.ts" />

class SelectGroupDialogController
{
    public static $inject = [
        '$scope',
        '$modalInstance'
    ];

    private IsLoading: boolean;

    private Items: Array<UICheckItem>;

    private _scope: ng.IScope;

    private _modalInstance: ng.ui.bootstrap.IModalServiceInstance;

    constructor($scope: ng.IScope, $modalInstance: ng.ui.bootstrap.IModalServiceInstance)
    {
        this._scope = $scope;
        (<any>this._scope).vm = this;

        this._modalInstance = $modalInstance;

        this.IsLoading = false;

        this.Refersh();
    }

    private Refersh()
    {
        var self = this;

        self.IsLoading = true;

        $.getJSON("/Groups/GetGroups",
            function (data, textStatus, jq)
            {
                self.IsLoading = false;

                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                var checkItems = new Array<UICheckItem>();
                var groups = <Array<EntityGroup>>data;
                groups.forEach(g =>
                {
                    checkItems.push(new UICheckItem(g.Name, g));
                });

                self._scope.$apply(function ()
                {
                    self.Items = checkItems;
                });
            });
    }

    private ItemCheckedChanged(sourceItem: UICheckItem)
    {
        if (sourceItem.IsChecked)
        {
            // Disable others items
            this.Items.forEach(item =>
            {
                if (item != sourceItem)
                {
                    item.IsChecked = false;
                }
            });
            UIUtility.ApplyScopeChanges(this._scope);
        }
    }

    private Cancel()
    {
        this._modalInstance.dismiss();
    }

    private Accept()
    {
        var selItem: UICheckItem = _.find(this.Items, (item) => item.IsChecked);
        if (selItem == null)
        {
            MessageBox.ShowError("Group not selected");
            return;
        }

        this._modalInstance.close(selItem.Object);
    }


} 


