/// <reference path="../_reference.d.ts" />
var SelectGroupDialogController = /** @class */ (function () {
    function SelectGroupDialogController($scope, $modalInstance) {
        this._scope = $scope;
        this._scope.vm = this;
        this._modalInstance = $modalInstance;
        this.IsLoading = false;
        this.Refersh();
    }
    SelectGroupDialogController.prototype.Refersh = function () {
        var self = this;
        self.IsLoading = true;
        $.getJSON("/Groups/GetGroups", function (data, textStatus, jq) {
            self.IsLoading = false;
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            var checkItems = new Array();
            var groups = data;
            groups.forEach(function (g) {
                checkItems.push(new UICheckItem(g.Name, g));
            });
            self._scope.$apply(function () {
                self.Items = checkItems;
            });
        });
    };
    SelectGroupDialogController.prototype.ItemCheckedChanged = function (sourceItem) {
        if (sourceItem.IsChecked) {
            // Disable others items
            this.Items.forEach(function (item) {
                if (item != sourceItem) {
                    item.IsChecked = false;
                }
            });
            UIUtility.ApplyScopeChanges(this._scope);
        }
    };
    SelectGroupDialogController.prototype.Cancel = function () {
        this._modalInstance.dismiss();
    };
    SelectGroupDialogController.prototype.Accept = function () {
        var selItem = _.find(this.Items, function (item) { return item.IsChecked; });
        if (selItem == null) {
            MessageBox.ShowError("Group not selected");
            return;
        }
        this._modalInstance.close(selItem.Object);
    };
    SelectGroupDialogController.$inject = [
        '$scope',
        '$modalInstance'
    ];
    return SelectGroupDialogController;
}());
