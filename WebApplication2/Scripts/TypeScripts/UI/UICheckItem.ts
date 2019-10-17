/// <reference path="../_reference.d.ts" />

class UICheckItem
{
    public Object: any;

    public IsChecked: boolean;

    public DisplayName: string;

    constructor(name: string, obj: any)
    {
        this.Object = obj;
        this.IsChecked = false;
        this.DisplayName = name;
    }
}