/// <reference path="./_reference.d.ts" />
/// <reference path="./typings/angular/angular.d.ts" />
/// <reference path="./Layout/Layout.ts" />
/// <reference path="./Ribbon/Ribbon.ts" />
/// <reference path="./Tools/ToolPan.ts" />
/// <reference path="./Project/Project.ts" />

class AppClass
{
    'use strict';

    public Ribbon: RibbonClass;
    
    public Layout: Layout;

    constructor()
    {
        this.Layout = new Layout();
        this.Ribbon = new RibbonClass(this.Layout);
        
        this.Ribbon.GotoImport();
    }

}

