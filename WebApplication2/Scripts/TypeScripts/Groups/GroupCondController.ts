/// <reference path="../_reference.d.ts" />

class GroupCondController
{
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope'
    ];

    public static Instance: GroupCondController;

    public Conditions: Array<BoundCondition>;

    public ActiveCondition: BoundCondition;

    public IsFixedVisible: boolean;

    public IsNodalLoadVisible: boolean;

    public IsMomentVisible: boolean;

    public IsDisplacementVisible: boolean;

    private _scope: ng.IScope;

    private _activeGroupName: string;

    constructor(private $scope: ng.IScope)
    {
        this._scope = $scope;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        (<any>this._scope).vm = this;

        GroupCondController.Instance = this;

        this.Conditions = null;
        this.ActiveCondition = null;
        this.IsFixedVisible = false;
        this.IsNodalLoadVisible = false;
        this.IsDisplacementVisible = false;
        this.IsMomentVisible = false;
    }

    public Refresh(items: Array<BoundCondition>)
    {
        var self = this;
        self._scope.$apply(function ()
        {
            self.IsFixedVisible = false;
            self.IsNodalLoadVisible = false;
            self.IsDisplacementVisible = false;
            self.IsMomentVisible = false;
            self.Conditions = items;
        });
    }

    private EditCondition(cond: BoundCondition)
    {
        var self = this;

        self.ActiveCondition = cond;

        self.IsFixedVisible = false;
        self.IsNodalLoadVisible = false;
        self.IsMomentVisible = false;
        self.IsDisplacementVisible = false;

        if (cond.ConditionType == "BoundConditionFixed")
        {
            self.IsFixedVisible = true;
        }
        else if (cond.ConditionType == "BoundConditionNodalLoad")
        {
            self.IsNodalLoadVisible = true;
        }
        else if (cond.ConditionType == "BoundConditionMoment")
        {
            self.IsMomentVisible = true;
        }
        else if (cond.ConditionType == "BoundConditionDisplacement")
        {
            self.IsDisplacementVisible = true;
        }
    }


    private AddCondition(typeVal: string)
    {
        var self = this;
        if (!self._activeGroupName)
        {
            MessageBox.ShowError("Group not selected");
            return;
        }

        $.post("/Groups/AddCondition?" +
            "groupName=" + self._activeGroupName +
            "&type=" + typeVal,
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self.RefreshConditions(self._activeGroupName);
            });
    }


    private RemoveAllConditions()
    {
        var self = this;
        if (!self._activeGroupName)
        {
            MessageBox.ShowError("Group not selected");
            return;
        }

        $.post("/Groups/RemoveConditions?" +
            "groupName=" + self._activeGroupName,
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self.RefreshConditions(self._activeGroupName);
            });
    }

    public RefreshConditions(groupName: string)
    {
        var self = this;

        var loader = $("#condition-dialog .id-loading-indicator");
        loader.show();

        $.getJSON("/Groups/GetConditions?groupName=" + groupName,
            function (data, textStatus, jq)
            {
                loader.hide();
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self._activeGroupName = groupName;
                self.Refresh(data);
            });
        loader.hide();
    }

    private Apply()
    {
        this.SaveConditions();
        $("#condition-dialog").modal("hide");
    }

    private SaveConditions()
    {
        var self = this;

        if (this._activeGroupName == null)
        {
            return;
        }
        $.post("/Groups/SaveConditions?groupName=" + this._activeGroupName,
            JSON.stringify(GroupCondController.Instance.Conditions),
            function (data, textStatus)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }
                // Refresh groups
                TabGroups.Refresh();
            });
    }

    private AddConditionSupport()
    {
        this.AddCondition("support");
    }

    private AddConditionNodalLoad()
    {
        this.AddCondition("nodalLoad");
    }

    private AddConditionMoment()
    {
        this.AddCondition("moment");
    }

    private AddConditionDisplacement()
    {
        this.AddCondition("displacement");
    }
}
