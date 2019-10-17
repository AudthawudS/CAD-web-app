/// <reference path="../_reference.d.ts" />

class UIUtility
{
    private static _injector: ng.auto.IInjectorService;

    public static GetModalService(): ng.ui.bootstrap.IModalService
    {        
        var injector = UIUtility.GetInjector();
        var modalService = <ng.ui.bootstrap.IModalService>injector.get("$uibModal");
        return modalService;
    }

    public static Compile(html: string, doneCallback: (element: JQuery) => void)
    {
        var injector = UIUtility.GetInjector();
        injector.invoke(function ($rootScope, $compile)
        {
            var element = $compile(html)($rootScope);

            if (doneCallback != undefined)
            {
                doneCallback(element);
            }
        });
    }

    private static GetInjector(): ng.auto.IInjectorService
    {
        if (!this._injector)
        {
            this._injector = angular.injector(['ng', 'feamvc']);
        }
        return this._injector;
    }

    public static ApplyScopeChanges(scope: ng.IScope)
    {
        if (!scope.$$phase)
        {
            scope.$apply();
        }
    }

}