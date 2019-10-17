/// <reference path="../_reference.d.ts" />
/// <reference path="../Groups/GroupCondController.ts" />
/// <reference path="../SetUps/TabSetUpsController.ts" />
/// <reference path="../Simulation/Simulation.ts" />
/// <reference path="../Force/ForceManager.ts" />
var TabGroups = /** @class */ (function () {
    function TabGroups($scope) {
        this.$scope = $scope;
        this._scope = $scope;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        this._scope.vm = this;
        var self = this;
        this._activeGroupName = null;
        this._activeConditionId = null;
        this.Groups = null;
        this.IsSimulationRunning = false;
        this.IsUpdating = false;
        this._conditionDialog = $("#condition-dialog");
        TabGroups._instance = this;
    }
    TabGroups.prototype.CreateGroupShowModal = function () {
        // Clear input
        $("#modal-group-name .modal-text").val("");
        // Show dialog
        $("#modal-group-name").modal();
    };
    TabGroups.prototype.CreateGroupAccept = function () {
        $("#modal-group-name").modal('hide');
        var text = $("#modal-group-name .modal-text").val();
        if (!text || text == "") {
            MessageBox.ShowError("Name not set");
            return;
        }
        this.CreateGroup(text);
    };
    TabGroups.prototype.CreateGroup = function (name) {
        var self = this;
        self.ShowLoader();
        $.post("/Groups/CreateNew?name=" + name, function (data, textStatus) {
            self.HideLoader();
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self.RefreshInternal();
        });
    };
    TabGroups.prototype.ClearGroups = function () {
        var self = this;
        self.ShowLoader();
        $.post("/Groups/Clear", "", function (data, textStatus) {
            self.HideLoader();
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self.RefreshInternal();
        });
    };
    TabGroups.prototype.RefreshInternal = function () {
        var self = this;
        self.ShowLoader();
        $.getJSON("/Groups/GetGroups", function (data, textStatus, jq) {
            self.HideLoader();
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self._scope.$apply(function () {
                self.Groups = data;
                ForceManager.RecreateByGroups(self.Groups);
            });
        });
    };
    TabGroups.prototype.ShowLoader = function () {
        this.IsUpdating = true;
        UIUtility.ApplyScopeChanges(this._scope);
    };
    TabGroups.prototype.HideLoader = function () {
        this.IsUpdating = false;
        UIUtility.ApplyScopeChanges(this._scope);
    };
    TabGroups.prototype.RemoveGroup = function (groupName) {
        var self = this;
        $.post("/Groups/RemoveGroup?groupName=" + groupName, function (data, textStatus) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self.RefreshInternal();
        });
    };
    TabGroups.prototype.EditConditions = function (groupName) {
        this._activeGroupName = groupName;
        $("#condition-dialog").modal();
        GroupCondController.Instance.RefreshConditions(groupName);
    };
    TabGroups.prototype.RunSimulation = function () {
        var self = this;
        self.IsSimulationRunning = true;
        UIUtility.ApplyScopeChanges(self._scope);
        Simulation.Run(function () {
            self.IsSimulationRunning = false;
            UIUtility.ApplyScopeChanges(self._scope);
        });
    };
    TabGroups.prototype.SaveSetUpDialog = function () {
        $("#modal-setup-name").modal();
    };
    TabGroups.prototype.CreateSetUp = function (name) {
        TabSetUpsController.Instance.CreateSetUp(name);
    };
    TabGroups.prototype.ToogleEnabledState = function (group) {
        var self = this;
        var groupName = group.Name;
        var isEnabled = group.IsEnabled;
        $.post("/Groups/SetGroupEnable?" +
            "groupName=" + groupName +
            "&isEnabled=" + isEnabled, function (data, textStatus) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
        });
    };
    // Add nodes/faces/object
    TabGroups.prototype.SetContent = function (groupName) {
        var self = this;
        var selectedItems = App.Layout.Selector.SelectionItems;
        if (selectedItems.length == 0) {
            MessageBox.ShowError("Selection is empty");
            return;
        }
        var entId = selectedItems[0].EntityId;
        $.getJSON("/Groups/IsNeedSync?entId=" + entId, function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            if (data.IsNeedSync) {
                Project.SyncWithServer(function () {
                    self.SetContentRequest(groupName, entId, selectedItems);
                });
            }
            else {
                self.SetContentRequest(groupName, entId, selectedItems);
            }
        });
    };
    // Set reference node to group
    TabGroups.prototype.SetReferencePoint = function (groupName) {
        var self = this;
        var selectedItems = App.Layout.Selector.SelectionItems;
        if (selectedItems.length == 0) {
            MessageBox.ShowError("Reference point not selected");
            return;
        }
        var refPoint = null;
        selectedItems.forEach(function (selItem) {
            var ent = App.Layout.GetEntityById(selItem.EntityId);
            if (GetEntityType(ent) == EntityType.ReferencePoint) {
                refPoint = ent;
            }
        });
        if (refPoint == null) {
            MessageBox.ShowError("Reference point not selected");
            return;
        }
        $.post("/Groups/SetReferencePoint?groupName=" + groupName + "&id=" + refPoint.uuid, function (data, textStatus) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            App.Layout.Selector.Clear();
            self.RefreshInternal();
        });
    };
    TabGroups.prototype.SetContentRequest = function (groupName, entId, selectedItems) {
        var self = this;
        $.post("/Groups/SetGroupContent?groupName=" + groupName +
            "&entId=" + entId, JSON.stringify(selectedItems), function (data, textStatus) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            App.Layout.Selector.Clear();
            self.RefreshInternal();
        });
    };
    TabGroups.Refresh = function () {
        TabGroups._instance.RefreshInternal();
    };
    TabGroups.$inject = [
        '$scope'
    ];
    return TabGroups;
}());
