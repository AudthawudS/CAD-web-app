/// <reference path="../_reference.d.ts" />
/// <reference path="../Groups/GroupCondController.ts" />
/// <reference path="../SetUps/TabSetUpsController.ts" />
/// <reference path="../Simulation/Simulation.ts" />
/// <reference path="../Force/ForceManager.ts" />

class TabGroups
{
    public static $inject = [
        '$scope'
    ];

    private Groups: Array<EntityGroup>;

    private IsSimulationRunning: boolean;

    private IsUpdating: boolean;

    private _activeGroupName: string;

    private _activeConditionId: string;

    private _activeConditionObj: any;

    private _conditionDialog: JQuery;

    private _scope: ng.IScope;

    private static _instance: TabGroups;

    constructor(private $scope: ng.IScope)
    {
        this._scope = $scope;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        (<any>this._scope).vm = this;

        var self = this;

        this._activeGroupName = null;
        this._activeConditionId = null;
        this.Groups = null;
        this.IsSimulationRunning = false;
        this.IsUpdating = false;
        this._conditionDialog = $("#condition-dialog");

        TabGroups._instance = this;
    }

    private CreateGroupShowModal()
    {
        // Clear input
        $("#modal-group-name .modal-text").val("");
        // Show dialog
        $("#modal-group-name").modal();
    }

    private CreateGroupAccept()
    {
        $("#modal-group-name").modal('hide');
        var text = $("#modal-group-name .modal-text").val();
        if (!text || text == "")
        {
            MessageBox.ShowError("Name not set");
            return;
        }
        this.CreateGroup(text);
    }

    private CreateGroup(name: string)
    {
        var self = this;
        self.ShowLoader();

        $.post(
            "/Groups/CreateNew?name=" + name,
            function (data, textStatus)
            {
                self.HideLoader();

                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self.RefreshInternal();
            });
    }

    public ClearGroups()
    {
        var self = this;
        self.ShowLoader();

        $.post(
            "/Groups/Clear",
            "",
            function (data, textStatus)
            {
                self.HideLoader();

                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }
                self.RefreshInternal();
            });
    }

    public RefreshInternal()
    {
        var self = this;

        self.ShowLoader();

        $.getJSON("/Groups/GetGroups",
            function (data, textStatus, jq)
            {
                self.HideLoader();

                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self._scope.$apply(function ()
                {
                    self.Groups = data;

                    ForceManager.RecreateByGroups(self.Groups);
                });
            });
    }

    private ShowLoader()
    {
        this.IsUpdating = true;
        UIUtility.ApplyScopeChanges(this._scope);
    }

    private HideLoader()
    {
        this.IsUpdating = false;
        UIUtility.ApplyScopeChanges(this._scope);
    }

  

    public RemoveGroup(groupName: string)
    {
        var self = this;
        $.post("/Groups/RemoveGroup?groupName=" + groupName,
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }
                self.RefreshInternal();
            });
    }

    private EditConditions(groupName: string)
    {
        this._activeGroupName = groupName;

        $("#condition-dialog").modal();
        GroupCondController.Instance.RefreshConditions(groupName);
    }

    public RunSimulation()
    {
        var self = this;

        self.IsSimulationRunning = true;
        UIUtility.ApplyScopeChanges(self._scope);

        Simulation.Run(() =>
        {
            self.IsSimulationRunning = false;
            UIUtility.ApplyScopeChanges(self._scope);
        });
    }

    public SaveSetUpDialog()
    {
        $("#modal-setup-name").modal();
    }

    public CreateSetUp(name: string)
    {
        TabSetUpsController.Instance.CreateSetUp(name);
    }
    
    private ToogleEnabledState(group: any)
    {
        var self = this;

        var groupName = group.Name;
        var isEnabled = group.IsEnabled;
        $.post("/Groups/SetGroupEnable?" +
            "groupName=" + groupName +
            "&isEnabled=" + isEnabled,
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }
            });
    }



    // Add nodes/faces/object
    private SetContent(groupName: string)
    {
        var self = this;

        var selectedItems = App.Layout.Selector.SelectionItems;
        if (selectedItems.length == 0)
        {
            MessageBox.ShowError("Selection is empty");
            return;
        }

        var entId = selectedItems[0].EntityId;

        $.getJSON("/Groups/IsNeedSync?entId=" + entId, function (data)
        {
            if (!ErrorHandler.CheckJsonRes(data))
            {
                return;
            }

            if (data.IsNeedSync)
            {
                Project.SyncWithServer(function ()
                {
                    self.SetContentRequest(groupName, entId, selectedItems);
                });
            }
            else
            {
                self.SetContentRequest(groupName, entId, selectedItems);
            }
        });
    }

    // Set reference node to group
    private SetReferencePoint(groupName: string)
    {
       
        var self = this;

        var selectedItems = App.Layout.Selector.SelectionItems;
        if (selectedItems.length == 0)
        {
            MessageBox.ShowError("Reference point not selected");
            return;
        }
        var refPoint: RefPointEntity = null;
        selectedItems.forEach((selItem) =>
        {
            var ent = App.Layout.GetEntityById(selItem.EntityId);
            if (GetEntityType(ent) == EntityType.ReferencePoint)
            {
                refPoint = <RefPointEntity>ent;                
            }
        });
        if (refPoint == null)
        {
            MessageBox.ShowError("Reference point not selected");
            return;
        }

        $.post("/Groups/SetReferencePoint?groupName=" + groupName + "&id=" + refPoint.uuid,
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                App.Layout.Selector.Clear();
                self.RefreshInternal();
            });
    }


    private SetContentRequest(groupName: string, entId: string, selectedItems: SelectionItem[])
    {
        var self = this;

        $.post("/Groups/SetGroupContent?groupName=" + groupName +
            "&entId=" + entId,
            JSON.stringify(selectedItems),
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                App.Layout.Selector.Clear();
                self.RefreshInternal();
            });
    }

    public static Refresh()
    {
        TabGroups._instance.RefreshInternal();
    }
}
