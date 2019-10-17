/// <reference path="../_reference.d.ts" />

enum Units
{
    mm_g_ms,
    m_kg_s,
    inch_lb_s
}

class SettingsClass
{
    public Units: Units;

    public ShadingColor: number;

    public ViewerBackgroundColor: number;

    public LoadArrowsColor: number;

    public IsLoadArrowsEnabled: boolean;

    public FixedSymbolColor: number;

    public IsFixedSymbolEnabled: boolean;

    public MomentSymbolColor: number;

    public IsMomentSymbolEnabled: boolean;

    public IsGridEnabled: boolean;

    public Changed: CEvent<SettingsClass>;

    constructor()
    {
        this.Changed = new CEvent<SettingsClass>();
        this.Units = Units.mm_g_ms;
        this.ShadingColor = 0x00ff00;
        this.ViewerBackgroundColor = 0xffffff;

        this.LoadArrowsColor = 0x009ee0;
        this.IsLoadArrowsEnabled = true;

        this.FixedSymbolColor = 0xff0000;
        this.IsFixedSymbolEnabled = true;
        
        this.MomentSymbolColor = 0xff00ff;
        this.IsMomentSymbolEnabled = true;

        this.IsGridEnabled = true;
    }

    public GetUnitsName() : string
    {
        switch (this.Units)
        {
            case Units.m_kg_s:
                return "m";
            case Units.mm_g_ms:
                return "mm";
            case Units.inch_lb_s:
                return "inch";
        }
        return "";
    }

    public Load()
    {
        var self = this;

        $.getJSON("/Settings/GetSettings",
            function (data)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                self.Units = <Units>data.Units;
                self.ShadingColor = data.ShadingColor;
                self.IsGridEnabled = data.IsGridEnabled;
                self.ViewerBackgroundColor = data.ViewerBackgroundColor;
                self.LoadArrowsColor = data.LoadArrowsColor;
                self.IsLoadArrowsEnabled = data.IsLoadArrowsEnabled;
                self.FixedSymbolColor = data.FixedSymbolColor;
                self.IsFixedSymbolEnabled = data.IsFixedSymbolEnabled;
                self.MomentSymbolColor = data.MomentSymbolColor;
                self.IsMomentSymbolEnabled = data.IsMomentSymbolEnabled;

                self.Changed.fire(self);
            });
    }

    public Save()
    {
        var self = this;
        $.post("/Settings/Save",
            JSON.stringify(self),
            function (data)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }
            });
    }

    public Clone(): any
    {
        var cloneObj = new SettingsClass();
        for (var key in this)
        {
            if (this.hasOwnProperty(key))
            {
                //cloneObj[key] = this[key];
            }
        }
        return cloneObj;
    }

    public CopyFrom(objSource: SettingsClass)
    {
        for (var key in objSource)
        {
            if (objSource.hasOwnProperty(key))
            {
                this[key] = objSource[key];
            }
        }
    }
}

var Settings: SettingsClass = new SettingsClass();

// Load settings from server
Settings.Load();
