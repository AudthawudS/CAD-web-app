/// <reference path="../_reference.d.ts" />

interface IProjectScope extends ng.IScope
{
    vm: ProjectController;
}

class ProjectViewItem
{
    public Name: string;

    public ActiveCSS: string;
}

interface ProjectCallback
{
    (name: string): void;
}


class ProjectController
{

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope'
    ];

    public static Instance:ProjectController;

    public Projects: Array<ProjectViewItem>;

    public DialogProjectName: string;

    private  _scope:IProjectScope;

    private _callbackSaveProject : ProjectCallback;

    private _callbackOpenProject : ProjectCallback;

    constructor($scope:IProjectScope)
    {
        this._scope = $scope;
        $scope.vm = this;

        var self = this;

        ProjectController.Instance = this;
    }

    public ShowSaveDialog(callback: ProjectCallback)
    {
        var self = this;
        $("#project-save-dialog").modal();

        self._callbackSaveProject = callback;

        self._scope.$apply(()=>
        {
            self.DialogProjectName = "";
        });
    }

    public AcceptSaveDialog()
    {
        var self = this;
        if(self._callbackSaveProject)
        {
            self._callbackSaveProject(self.DialogProjectName);
        }
    }

    public ShowOpenDialog(projectNames: Array<string>, callback: ProjectCallback)
    {
        var self = this;

        self._callbackOpenProject = callback;

        $("#project-open-dialog").modal();
        self._scope.$apply(function()
        {
            self.Projects = new Array<ProjectViewItem>();
            for(var idx in projectNames)
            {
                var projName = projectNames[idx];

                var projItem = new ProjectViewItem();
                projItem.Name = projName;

                self.Projects.push(projItem);
            }
        });
    }

    public AcceptOpenProject()
    {
        var selProject = _.find(this.Projects, function(p: ProjectViewItem)
        {
            return (p.ActiveCSS == "active");
        });
        if(selProject == null)
        {
            MessageBox.ShowError("Project undefined");
            return;
        }

        if(this._callbackOpenProject)
        {
            this._callbackOpenProject(selProject.Name);
        }
    }

    public ProjectItemClick(projectItem: ProjectViewItem)
    {
        // Deselect all, and activate current
        _.each(this.Projects, function (proj : ProjectViewItem)
        {
            proj.ActiveCSS = "";
        });

        projectItem.ActiveCSS = "active";
    }

}

