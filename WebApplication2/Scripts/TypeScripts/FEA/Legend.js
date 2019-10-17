/// <reference path="../_reference.d.ts" />
var LegendItem = /** @class */ (function () {
    function LegendItem() {
    }
    return LegendItem;
}());
var LegendUserItem = /** @class */ (function () {
    function LegendUserItem(val) {
        this.Value = val;
    }
    return LegendUserItem;
}());
var Legend = /** @class */ (function () {
    function Legend() {
        this.LegendUserItems = new Array();
        this.LegendItems = new Array();
        this.PredefinedItems = new Array();
    }
    return Legend;
}());
var LegendController = /** @class */ (function () {
    function LegendController($scope) {
        this.$scope = $scope;
        this._scope = $scope;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        $scope.vm = this;
        this.Legend = new Legend();
        if (LegendController.Instance) {
            throw new Error("LegendController double init");
        }
        LegendController.Instance = this;
    }
    LegendController.UpdateScope = function (legend) {
        LegendController.Instance.Update(legend);
    };
    LegendController.prototype.Update = function (legend) {
        var self = this;
        self.Legend = legend;
        UIUtility.ApplyScopeChanges(self._scope);
    };
    LegendController.prototype.IsContainsWith = function (items, str) {
        var item = this.GetItem(items, str);
        if (item) {
            return true;
        }
        else {
            return false;
        }
    };
    LegendController.prototype.GetItem = function (items, str) {
        return _.find(items, function (l) { return l.Value.indexOf(str) == 0; });
    };
    LegendController.prototype.AddUserItem = function () {
        var userItem = new LegendUserItem("");
        this.Legend.LegendUserItems.push(userItem);
    };
    LegendController.prototype.ClearUserItem = function () {
        this.Legend.LegendUserItems = new Array();
    };
    LegendController.prototype.RemoveUserItem = function (item) {
        if (!item) {
            return;
        }
        // remove item
        this.Legend.LegendUserItems = _.without(this.Legend.LegendUserItems, item);
    };
    LegendController.$inject = [
        '$scope'
    ];
    return LegendController;
}());
