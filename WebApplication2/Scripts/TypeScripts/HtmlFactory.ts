/// <reference path="./_reference.d.ts" />

enum ButtonSize
{
    Middle,
    Large,
}

enum ButtonIcon
{
    None,
    Add,
    Remove,
    Cog,
    Ok
}

class HtmlFactoryClass
{
    CreateButton(text: string, size: ButtonSize, icon: ButtonIcon) : JQuery
    {
        var outButton = $('<button type="button" class="btn btn-default"></button>');
        if (size == ButtonSize.Large)
        {
            outButton.addClass("btn-lg");
        }
        else if (size == ButtonSize.Middle)
        {
            outButton.addClass("btn-sm");
        }

        var span = $("<span aria-hidden='true'></span>");
        outButton.append(span);
        span.html(text);

        if (icon == ButtonIcon.Add)
        {
            span.addClass("glyphicon glyphicon-plus");
        }
        else if (icon == ButtonIcon.Remove)
        {
            span.addClass("glyphicon glyphicon-remove");
        }
        else if (icon == ButtonIcon.Cog)
        {
            span.addClass("glyphicon glyphicon-cog");
        }
        else if (icon == ButtonIcon.Ok)
        {
            span.addClass("glyphicon glyphicon-ok");
        }

        return outButton;
    }
} 

var HtmlFactory = new HtmlFactoryClass();