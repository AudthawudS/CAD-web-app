/// <reference path="../_reference.d.ts" />

class ProgressToken
{
    public IsDone: boolean;

    constructor()
    {
        this.IsDone = false;
    }

    public Stop()
    {
        this.IsDone = true;
    }
}