/// <reference path="../_reference.d.ts" />
var UIUtility = /** @class */ (function () {
    function UIUtility() {
    }
    UIUtility.GetModalService = function () {
        var injector = UIUtility.GetInjector();
        var modalService = injector.get("$uibModal");
        return modalService;
    };
    UIUtility.Compile = function (html, doneCallback) {
        var injector = UIUtility.GetInjector();
        injector.invoke(function ($rootScope, $compile) {
            var element = $compile(html)($rootScope);
            if (doneCallback != undefined) {
                doneCallback(element);
            }
        });
    };
    UIUtility.GetInjector = function () {
        if (!this._injector) {
            this._injector = angular.injector(['ng', 'feamvc']);
        }
        return this._injector;
    };
    UIUtility.ApplyScopeChanges = function (scope) {
        if (!scope.$$phase) {
            scope.$apply();
        }
    };
    return UIUtility;
}());
