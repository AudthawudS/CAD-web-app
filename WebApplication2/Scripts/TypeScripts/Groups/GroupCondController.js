/// <reference path="../_reference.d.ts" />
var GroupCondController = /** @class */ (function () {
    function GroupCondController($scope) {
        this.$scope = $scope;
        this._scope = $scope;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        this._scope.vm = this;
        GroupCondController.Instance = this;
        this.Conditions = null;
        this.ActiveCondition = null;
        this.IsFixedVisible = false;
        this.IsNodalLoadVisible = false;
        this.IsDisplacementVisible = false;
        this.IsMomentVisible = false;
    }
    GroupCondController.prototype.Refresh = function (items) {
        var self = this;
        self._scope.$apply(function () {
            self.IsFixedVisible = false;
            self.IsNodalLoadVisible = false;
            self.IsDisplacementVisible = false;
            self.IsMomentVisible = false;
            self.Conditions = items;
        });
    };
    GroupCondController.prototype.EditCondition = function (cond) {
        var self = this;
        self.ActiveCondition = cond;
        self.IsFixedVisible = false;
        self.IsNodalLoadVisible = false;
        self.IsMomentVisible = false;
        self.IsDisplacementVisible = false;
        if (cond.ConditionType == "BoundConditionFixed") {
            self.IsFixedVisible = true;
        }
        else if (cond.ConditionType == "BoundConditionNodalLoad") {
            self.IsNodalLoadVisible = true;
        }
        else if (cond.ConditionType == "BoundConditionMoment") {
            self.IsMomentVisible = true;
        }
        else if (cond.ConditionType == "BoundConditionDisplacement") {
            self.IsDisplacementVisible = true;
        }
    };
    GroupCondController.prototype.AddCondition = function (typeVal) {
        var self = this;
        if (!self._activeGroupName) {
            MessageBox.ShowError("Group not selected");
            return;
        }
        $.post("/Groups/AddCondition?" +
            "groupName=" + self._activeGroupName +
            "&type=" + typeVal, function (data, textStatus) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self.RefreshConditions(self._activeGroupName);
        });
    };
    GroupCondController.prototype.RemoveAllConditions = function () {
        var self = this;
        if (!self._activeGroupName) {
            MessageBox.ShowError("Group not selected");
            return;
        }
        $.post("/Groups/RemoveConditions?" +
            "groupName=" + self._activeGroupName, function (data, textStatus) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self.RefreshConditions(self._activeGroupName);
        });
    };
    GroupCondController.prototype.RefreshConditions = function (groupName) {
        var self = this;
        var loader = $("#condition-dialog .id-loading-indicator");
        loader.show();
        $.getJSON("/Groups/GetConditions?groupName=" + groupName, function (data, textStatus, jq) {
            loader.hide();
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self._activeGroupName = groupName;
            self.Refresh(data);
        });
        loader.hide();
    };
    GroupCondController.prototype.Apply = function () {
        this.SaveConditions();
        $("#condition-dialog").modal("hide");
    };
    GroupCondController.prototype.SaveConditions = function () {
        var self = this;
        if (this._activeGroupName == null) {
            return;
        }
        $.post("/Groups/SaveConditions?groupName=" + this._activeGroupName, JSON.stringify(GroupCondController.Instance.Conditions), function (data, textStatus) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            // Refresh groups
            TabGroups.Refresh();
        });
    };
    GroupCondController.prototype.AddConditionSupport = function () {
        this.AddCondition("support");
    };
    GroupCondController.prototype.AddConditionNodalLoad = function () {
        this.AddCondition("nodalLoad");
    };
    GroupCondController.prototype.AddConditionMoment = function () {
        this.AddCondition("moment");
    };
    GroupCondController.prototype.AddConditionDisplacement = function () {
        this.AddCondition("displacement");
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    GroupCondController.$inject = [
        '$scope'
    ];
    return GroupCondController;
}());
