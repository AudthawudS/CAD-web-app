/// <reference path="../_reference.d.ts" />
var TaskManager = /** @class */ (function () {
    function TaskManager($scope) {
        this.$scope = $scope;
        this._scope = $scope;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        this._scope.vm = this;
        TaskManager.Instance = this;
        this.Tasks = new Array();
        this.ClientTasks = new Array();
        this.UpdateTasks();
    }
    TaskManager.prototype.CreateTask = function (name) {
        var task = new ServerTask();
        task.Name = name;
        this.ClientTasks.push(task);
        return task;
    };
    TaskManager.prototype.RemoveTask = function (task) {
        this.ClientTasks = _.without(this.ClientTasks, task);
    };
    TaskManager.prototype.UpdateTasks = function () {
        var self = this;
        $.getJSON("Task/GetActiveTasks", function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            var tasks = new Array();
            for (var idx in data) {
                var serverTask = data[idx];
                tasks.push(serverTask);
            }
            // Add client tasks
            for (var idx in self.ClientTasks) {
                tasks.push(self.ClientTasks[idx]);
            }
            self.$scope.$apply(function () {
                self.Tasks = tasks;
            });
            setTimeout(function () {
                self.UpdateTasks();
            }, 1000);
        });
    };
    TaskManager.$inject = [
        '$scope'
    ];
    return TaskManager;
}());
var ServerTask = /** @class */ (function () {
    function ServerTask() {
    }
    return ServerTask;
}());
