/// <reference path="../_reference.d.ts" />


interface ILegendScope extends ng.IScope
{
    vm: LegendController;
}

class  LegendItem
{
    ColorCSS : string;

    Label: string;
}

class LegendUserItem
{
    public Value: string;

    constructor(val: string)
    {
        this.Value = val;
    }
}

class  Legend
{
    public LegendUserItems: Array<LegendUserItem>;

    public PredefinedItems: Array<LegendUserItem>;

    public LegendItems: Array<LegendItem>;

    constructor()
    {
        this.LegendUserItems = new Array<LegendUserItem>();
        this.LegendItems = new Array<LegendItem>();
        this.PredefinedItems = new Array<LegendUserItem>();
    }
}

class LegendController
{
    public static $inject = [
        '$scope'
    ];

    public Legend : Legend;

    private _scope:ILegendScope;

    public static Instance:LegendController;

    constructor(private $scope:ILegendScope)
    {
        this._scope = $scope;

        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        $scope.vm = this;

        this.Legend = new Legend();

        if (LegendController.Instance)
        {
            throw new Error("LegendController double init");
        }
        LegendController.Instance = this;
    }

    public static UpdateScope(legend: Legend)
    {
        LegendController.Instance.Update(legend);
    }
    
    private Update(legend: Legend)
    {
        var self = this;
        self.Legend = legend;
        UIUtility.ApplyScopeChanges(self._scope);
    }


    private IsContainsWith(items: Array<LegendUserItem>, str: string) : boolean
    {
        var item = this.GetItem(items, str);
        if (item)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    private GetItem(items: Array<LegendUserItem>, str: string) : LegendUserItem
    {
        return _.find(items, (l) => { return l.Value.indexOf(str) == 0; });
    }

    public AddUserItem()
    {
        var userItem = new LegendUserItem("");
        this.Legend.LegendUserItems.push(userItem);
    }

    public ClearUserItem()
    {
        this.Legend.LegendUserItems = new Array<LegendUserItem>();
    }

    public RemoveUserItem(item: LegendUserItem)
    {
        if (!item)
        {
            return;
        }
        
        // remove item
        this.Legend.LegendUserItems = _.without(this.Legend.LegendUserItems, item);            
    }
}