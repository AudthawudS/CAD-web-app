/// <reference path="../_reference.d.ts" />
function HtmlInnerDirective($compile) {
    return {
        link: function ($scope, element, attributes) {
            $scope.$watch(function (scope) {
                return scope.$eval(attributes.htmlinner);
            }, function (value) {
                element.html(value);
            });
        }
    };
}
CompileDirective.$inject = ['$compile'];
