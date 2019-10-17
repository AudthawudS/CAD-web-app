/// <reference path="../_reference.d.ts" />

interface ITool
{
    Start() : void;

    End(): void;

    MouseDown(evt: JQueryMouseEventObject): void;

    MouseUp(evt: JQueryMouseEventObject): void;

    MouseMove(evt: JQueryMouseEventObject): void;

    KeyDown(evt:JQueryKeyEventObject): void;
}