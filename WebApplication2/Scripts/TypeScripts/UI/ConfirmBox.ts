/// <reference path="../_reference.d.ts" />

class ConfirmBoxClass
{
    private _container : JQuery;

    constructor()
    {
        this._container = $("#confirm-dialog");
    }

    public Confirm(msg: string, doneCallback: (isAccept: boolean) => void)
    {
        var controller = ConfirmBoxController.Instance;

        controller.SetMessage(msg);
        controller.DoneCallback = doneCallback;
        this._container.modal();
    }    
}

var ConfirmBox = new ConfirmBoxClass();
