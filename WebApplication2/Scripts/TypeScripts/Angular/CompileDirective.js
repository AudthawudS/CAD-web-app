/// <reference path="../_reference.d.ts" />
function CompileDirective($compile) {
    return {
        link: function ($scope, element, attributes) {
            $scope.$watch(function (scope) {
                return scope.$eval(attributes.compile);
            }, function (value) {
                element.html(value);
                $compile(element.contents())($scope);
            });
        }
    };
}
CompileDirective.$inject = ['$compile'];
