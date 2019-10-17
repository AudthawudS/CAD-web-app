/// <reference path="../_reference.d.ts" />

interface JQueryRibbon extends JQuery {
    OfficeRibbon(): JQueryRibbon;
} 

interface JQueryRibbonButton extends JQuery {
    disableRbButton();

    enableRbButton();
} 