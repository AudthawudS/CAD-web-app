/// <reference path="./_reference.d.ts" />
var ButtonSize;
(function (ButtonSize) {
    ButtonSize[ButtonSize["Middle"] = 0] = "Middle";
    ButtonSize[ButtonSize["Large"] = 1] = "Large";
})(ButtonSize || (ButtonSize = {}));
var ButtonIcon;
(function (ButtonIcon) {
    ButtonIcon[ButtonIcon["None"] = 0] = "None";
    ButtonIcon[ButtonIcon["Add"] = 1] = "Add";
    ButtonIcon[ButtonIcon["Remove"] = 2] = "Remove";
    ButtonIcon[ButtonIcon["Cog"] = 3] = "Cog";
    ButtonIcon[ButtonIcon["Ok"] = 4] = "Ok";
})(ButtonIcon || (ButtonIcon = {}));
var HtmlFactoryClass = /** @class */ (function () {
    function HtmlFactoryClass() {
    }
    HtmlFactoryClass.prototype.CreateButton = function (text, size, icon) {
        var outButton = $('<button type="button" class="btn btn-default"></button>');
        if (size == ButtonSize.Large) {
            outButton.addClass("btn-lg");
        }
        else if (size == ButtonSize.Middle) {
            outButton.addClass("btn-sm");
        }
        var span = $("<span aria-hidden='true'></span>");
        outButton.append(span);
        span.html(text);
        if (icon == ButtonIcon.Add) {
            span.addClass("glyphicon glyphicon-plus");
        }
        else if (icon == ButtonIcon.Remove) {
            span.addClass("glyphicon glyphicon-remove");
        }
        else if (icon == ButtonIcon.Cog) {
            span.addClass("glyphicon glyphicon-cog");
        }
        else if (icon == ButtonIcon.Ok) {
            span.addClass("glyphicon glyphicon-ok");
        }
        return outButton;
    };
    return HtmlFactoryClass;
}());
var HtmlFactory = new HtmlFactoryClass();
