/// <reference path="../_reference.d.ts" />
var ProjectViewItem = /** @class */ (function () {
    function ProjectViewItem() {
    }
    return ProjectViewItem;
}());
var ProjectController = /** @class */ (function () {
    function ProjectController($scope) {
        this._scope = $scope;
        $scope.vm = this;
        var self = this;
        ProjectController.Instance = this;
    }
    ProjectController.prototype.ShowSaveDialog = function (callback) {
        var self = this;
        $("#project-save-dialog").modal();
        self._callbackSaveProject = callback;
        self._scope.$apply(function () {
            self.DialogProjectName = "";
        });
    };
    ProjectController.prototype.AcceptSaveDialog = function () {
        var self = this;
        if (self._callbackSaveProject) {
            self._callbackSaveProject(self.DialogProjectName);
        }
    };
    ProjectController.prototype.ShowOpenDialog = function (projectNames, callback) {
        var self = this;
        self._callbackOpenProject = callback;
        $("#project-open-dialog").modal();
        self._scope.$apply(function () {
            self.Projects = new Array();
            for (var idx in projectNames) {
                var projName = projectNames[idx];
                var projItem = new ProjectViewItem();
                projItem.Name = projName;
                self.Projects.push(projItem);
            }
        });
    };
    ProjectController.prototype.AcceptOpenProject = function () {
        var selProject = _.find(this.Projects, function (p) {
            return (p.ActiveCSS == "active");
        });
        if (selProject == null) {
            MessageBox.ShowError("Project undefined");
            return;
        }
        if (this._callbackOpenProject) {
            this._callbackOpenProject(selProject.Name);
        }
    };
    ProjectController.prototype.ProjectItemClick = function (projectItem) {
        // Deselect all, and activate current
        _.each(this.Projects, function (proj) {
            proj.ActiveCSS = "";
        });
        projectItem.ActiveCSS = "active";
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    ProjectController.$inject = [
        '$scope'
    ];
    return ProjectController;
}());
