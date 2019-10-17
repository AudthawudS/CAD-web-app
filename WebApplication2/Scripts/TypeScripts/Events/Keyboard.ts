/// <reference path="../_reference.d.ts" />

class KeyboardClass
{
    public IsCntrlPressed: boolean;

    public IsShiftPressed: boolean;

    constructor()
    {
        var self = this;

        $(document).keydown(function (e:JQueryKeyEventObject)
        {
            self.Onkeydown(e) 
        });

        $(document).keyup(function (e: JQueryKeyEventObject)
        {
            self.Onkeyup(e)
        });
    }

    Onkeydown(e: JQueryKeyEventObject)
    {
        if (e.ctrlKey)
        {
            this.IsCntrlPressed = true;
        }
        if (e.shiftKey)
        {
            this.IsShiftPressed = true;
        }
    }

    Onkeyup(e: JQueryKeyEventObject)
    {
        if (!e.ctrlKey)
        {
            this.IsCntrlPressed = false;
        }
        if (!e.shiftKey)
        {
            this.IsShiftPressed = false;
        }
    }
}

var Keyboard: KeyboardClass = new KeyboardClass();