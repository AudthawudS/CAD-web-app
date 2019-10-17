/// <reference path="../_reference.d.ts" />

function CompileDirective($compile): ng.IDirective
{
    return {
        link: ($scope: ng.IScope, element: JQuery, attributes: any) =>
        {
            $scope.$watch(
                function (scope)
                {
                    return scope.$eval(attributes.compile);
                },
                function (value)
                {
                    element.html(value);
                    $compile(element.contents())($scope);
                });
        }
    };
}

CompileDirective.$inject = ['$compile'];