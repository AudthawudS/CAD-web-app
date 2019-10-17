/// <reference path="../_reference.d.ts" />

function HtmlInnerDirective($compile): ng.IDirective
{
    return {
        link: ($scope: ng.IScope, element: JQuery, attributes: any) =>
        {
            $scope.$watch(
                function (scope)
                {
                    return scope.$eval(attributes.htmlinner);
                },
                function (value)
                {
                    element.html(value);
                });
        }
    };
}

CompileDirective.$inject = ['$compile'];