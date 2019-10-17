/// <reference path="../_reference.d.ts" />
/// <reference path="../Groups/TabGroups.ts" />
var TabSetUpsController = /** @class */ (function () {
    function TabSetUpsController($scope) {
        this.$scope = $scope;
        this._scope = $scope;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        this._scope.vm = this;
        if (TabSetUpsController.Instance) {
            throw new Error("Double init of TabSetUpsController");
        }
        this.CurrentSetUpName = null;
        this.CurrentSetupId = null;
        this.IsSimulationRunning = false;
        TabSetUpsController.Instance = this;
    }
    TabSetUpsController.prototype.IsSelected = function (setUp) {
        return (setUp.Name == this.CurrentSetUpName);
    };
    TabSetUpsController.prototype.GetIndex = function (setUp) {
        var self = this;
        self.CurrentSetupId = setUp.Id;
    };
    TabSetUpsController.prototype.RunSimulation = function () {
        var self = this;
        self.IsSimulationRunning = true;
        UIUtility.ApplyScopeChanges(self._scope);
        Simulation.Run(function () {
            self.IsSimulationRunning = false;
            UIUtility.ApplyScopeChanges(self._scope);
        });
    };
    TabSetUpsController.prototype.Load = function (setUp) {
        var self = this;
        $.post("/Groups/LoadSetUp?setUpId=" + setUp.Id, function (data, textStatus) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            // Refresh groups
            TabGroups.Refresh();
            MessageBox.ShowMessage("Set-Up Loaded");
            self.CurrentSetUpName = setUp.Name;
            // Set activate name on server
            $.post("/Groups/SetActivateSetUpName?setUpId=" + setUp.Id, function (data) {
                ErrorHandler.CheckJsonRes(data);
            });
        });
    };
    TabSetUpsController.prototype.Delete = function (setUp) {
        var self = this;
        $.post("/Groups/RemoveSetUp?setUpId=" + setUp.Id, function (data, textStatus) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self.Refresh();
        });
    };
    TabSetUpsController.prototype.CreateSetUp = function (name) {
        debugger;
        var self = this;
        $.post("/Groups/CreateSetUp?name=" + name, function (data, textStatus) {
            if (data) {
                if (data.message == "Material not set") {
                    MaterialTabController.Instance.MaterialDatabase();
                    MessageBox.ShowMessage("Material not set");
                    return;
                }
                else if (!ErrorHandler.CheckJsonRes(data)) {
                    return;
                }
            }
            self.CurrentSetUpName = name;
            var setups = data.setups;
            // self.SetUps = setups;
            self.Refresh();
            MessageBox.ShowMessage("Set-Up Created");
            // self.Load(setups);
            $.post("/Groups/LoadSetUp?setUpId=" + setups.Id, function (data, textStatus) {
                if (!ErrorHandler.CheckJsonRes(data)) {
                    return;
                }
                // Refresh groups
                TabGroups.Refresh();
                //  MessageBox.ShowMessage("Set-Up Loaded");
                self.CurrentSetUpName = setups.Name;
                // Set activate name on server
                $.post("/Groups/SetActivateSetUpName?setUpId=" + setups.Id, function (data) {
                    ErrorHandler.CheckJsonRes(data);
                });
            });
        });
    };
    TabSetUpsController.prototype.Refresh = function () {
        var self = this;
        if (!self._scope.$$phase) {
            self._scope.$apply(function () {
                self.RefreshInternal();
            });
        }
        else {
            self.RefreshInternal();
        }
    };
    TabSetUpsController.prototype.RefreshInternal = function () {
        var self = this;
        $.post("/Groups/GetSetUps", function (data, textStatus) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self._scope.$apply(function () {
                self.SetUps = data;
            });
        });
    };
    TabSetUpsController.prototype.ClearSetUps = function () {
        var self = this;
        $.post("/Groups/ClearSetUps", function (data, textStatus) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self.CurrentSetUpName = null;
            self.Refresh();
        });
    };
    TabSetUpsController.$inject = [
        '$scope'
    ];
    return TabSetUpsController;
}());
var SetUp = /** @class */ (function () {
    function SetUp() {
    }
    return SetUp;
}());
