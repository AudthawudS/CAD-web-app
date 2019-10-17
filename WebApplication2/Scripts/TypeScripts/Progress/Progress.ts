/// <reference path="../_reference.d.ts" />

class Progress
{
    _msgBox: Element;

    constructor(msgBox: Element)
    {
        this._msgBox = msgBox;
    }

    Message(msg : string)
    {
        $(this._msgBox).html(msg);
    }

} 