/// <reference path="../_reference.d.ts" />
/// <reference path="../Groups/TabGroups.ts" />

class TabSetUpsController
{
    public static $inject = [
        '$scope'
    ];

    public static Instance: TabSetUpsController;

    public SetUps: Array<SetUp>;

    public CurrentSetUpName: string;
    public CurrentSetupId: string;

    private IsSimulationRunning: boolean;
    private _scope: ng.IScope;

    constructor(private $scope: ng.IScope)
    {
        this._scope = $scope;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        (<any>this._scope).vm = this;

        if (TabSetUpsController.Instance)
        {
            throw new Error("Double init of TabSetUpsController");
        }

        this.CurrentSetUpName = null;
        this.CurrentSetupId = null;
        this.IsSimulationRunning = false;

        TabSetUpsController.Instance = this;
    }
    public IsSelected(setUp: SetUp) {
        return (setUp.Name == this.CurrentSetUpName);
    }
    public GetIndex(setUp: SetUp) {
        var self = this;
        self.CurrentSetupId = setUp.Id;
    }
    public RunSimulation() {
        var self = this;

        self.IsSimulationRunning = true;
        UIUtility.ApplyScopeChanges(self._scope);

        Simulation.Run(() => {
            self.IsSimulationRunning = false;
            UIUtility.ApplyScopeChanges(self._scope);
        });
    }
    public Load(setUp: SetUp)
    {
        var self = this;

        $.post(
            "/Groups/LoadSetUp?setUpId=" + setUp.Id,
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                // Refresh groups
                TabGroups.Refresh();
                MessageBox.ShowMessage("Set-Up Loaded");

                self.CurrentSetUpName = setUp.Name;

                // Set activate name on server
                $.post("/Groups/SetActivateSetUpName?setUpId=" + setUp.Id, (data) =>
                {
                    ErrorHandler.CheckJsonRes(data);
                });
            });
    }

    public Delete(setUp: SetUp)
    {
        var self = this;

        $.post(
            "/Groups/RemoveSetUp?setUpId=" + setUp.Id,
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self.Refresh();
            });
    }

    public CreateSetUp(name: string)
    {
        debugger;
        var self = this;

        $.post(
            "/Groups/CreateSetUp?name=" + name,
            function (data, textStatus)
            {
                if (data)
                {
                   
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

                var setups: SetUp = data.setups;
               // self.SetUps = setups;
                self.Refresh();

                MessageBox.ShowMessage("Set-Up Created");
               // self.Load(setups);

                $.post(
                    "/Groups/LoadSetUp?setUpId=" + setups.Id,
                    function (data, textStatus) {
                        if (!ErrorHandler.CheckJsonRes(data)) {
                            return;
                        }

                        // Refresh groups
                        TabGroups.Refresh();
                      //  MessageBox.ShowMessage("Set-Up Loaded");

                        self.CurrentSetUpName = setups.Name;

                        // Set activate name on server
                        $.post("/Groups/SetActivateSetUpName?setUpId=" + setups.Id, (data) => {
                            ErrorHandler.CheckJsonRes(data);
                        });
                    });


            });
    }

    public Refresh()
    {
        var self = this;

        if (!self._scope.$$phase)
        {
            self._scope.$apply(function ()
            {
                self.RefreshInternal();
            });
        }
        else
        {
            self.RefreshInternal();
        }
    }

    private RefreshInternal()
    {
        var self = this;

        $.post(
            "/Groups/GetSetUps",
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self._scope.$apply(function ()
                {
                    self.SetUps = data;
                });
            });
    }
  
    private ClearSetUps()
    {
        var self = this;

        $.post(
            "/Groups/ClearSetUps",
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self.CurrentSetUpName = null;
                self.Refresh();
            });
    }

}

class SetUp
{
    Id: string;

    Name: string;

    Groups: Array<any>;
}