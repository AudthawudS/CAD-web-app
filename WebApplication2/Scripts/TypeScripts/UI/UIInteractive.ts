/// <reference path="../_reference.d.ts" />
/// <reference path="../App.ts" />

class UIInteractive
{
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope',
        '$sce',
        '$compile'
    ];

    public static Instance: UIInteractive;

    private Message: string;

    private MessageDisplayCSS: string;

    private MessageLeftCSS: string;

    private SideDataContent: any;

    private IsSideDataVisible: boolean;

    private _scope: ng.IScope;

    private _sce: ng.ISCEService;

    private _compile: ng.ICompileService;

    constructor($scope: ng.IScope, $sce: ng.ISCEService, $compile: ng.ICompileService)
    {
        this._scope = $scope;
        this._sce = $sce;
        this._compile = $compile;

        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        (<any>$scope).vm = this;

        this.Message = "";
        this.MessageDisplayCSS = "none";
        this.MessageLeftCSS = "0px";

        this.SideDataContent = null;
        this.IsSideDataVisible = false;

        UIInteractive.Instance = this;
    }

    public SetMessage(msg: string)
    {
        var self = this;

        var self = this;

        self.Message = msg;

        if (msg == null || msg == "")
        {
            self.MessageDisplayCSS = "none";
        }
        else
        {
            var w = $(window).width();
            self.MessageDisplayCSS = "block";
            self.MessageLeftCSS = (w / 2).toString() + "px";
        }

        UIUtility.ApplyScopeChanges(self._scope);
    }


    public SetSideContent(data: string, doneCallback?: (res: JQuery) => void)
    {
        var self = this;

        self.SideDataContent = self._compile(data)(self._scope);

        if (data == null || data == "")
        {
            self.IsSideDataVisible = false;
        }
        else
        {
            self.IsSideDataVisible = true;
        }

        if (doneCallback)
        {
            doneCallback(self.SideDataContent);
        }
    }

}