/// <reference path="../_reference.d.ts" />

class TaskManager
{
    public static $inject = [
        '$scope'
    ];

    public static Instance: TaskManager;

    public Tasks: Array<ServerTask>;

    // tasks executed at client
    private ClientTasks: Array<ServerTask>;

    private _scope: ng.IScope;

    constructor(private $scope: ng.IScope)
    {
        this._scope = $scope;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        (<any>this._scope).vm = this;

        TaskManager.Instance = this;

        this.Tasks = new Array<ServerTask>();
        this.ClientTasks = new Array<ServerTask>();

        this.UpdateTasks();
    }

    public CreateTask(name: string) : ServerTask
    {
        var task = new ServerTask();
        task.Name = name;
        this.ClientTasks.push(task);

        return task;
    }

    public RemoveTask(task: ServerTask)
    {
        this.ClientTasks = _.without(this.ClientTasks, task);
    }

    private UpdateTasks()
    {
        var self = this;

        $.getJSON("Task/GetActiveTasks",
            function (data)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                var tasks = new Array<ServerTask>();
                for (var idx in data)
                {
                    var serverTask = <ServerTask>data[idx];
                    tasks.push(serverTask);
                }
                // Add client tasks
                for (var idx in self.ClientTasks)
                {
                    tasks.push(self.ClientTasks[idx]);
                }

                self.$scope.$apply(function ()
                {
                    self.Tasks = tasks;
                });

                setTimeout(function ()
                {
                    self.UpdateTasks();
                }, 1000);
            });
    }
}

class ServerTask
{
    Name: string;

    IsDone: boolean;
}
