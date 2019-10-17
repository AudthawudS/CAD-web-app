/// <reference path="../_reference.d.ts" />
var Units;
(function (Units) {
    Units[Units["mm_g_ms"] = 0] = "mm_g_ms";
    Units[Units["m_kg_s"] = 1] = "m_kg_s";
    Units[Units["inch_lb_s"] = 2] = "inch_lb_s";
})(Units || (Units = {}));
var SettingsClass = /** @class */ (function () {
    function SettingsClass() {
        this.Changed = new CEvent();
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
    SettingsClass.prototype.GetUnitsName = function () {
        switch (this.Units) {
            case Units.m_kg_s:
                return "m";
            case Units.mm_g_ms:
                return "mm";
            case Units.inch_lb_s:
                return "inch";
        }
        return "";
    };
    SettingsClass.prototype.Load = function () {
        var self = this;
        $.getJSON("/Settings/GetSettings", function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
            self.Units = data.Units;
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
    };
    SettingsClass.prototype.Save = function () {
        var self = this;
        $.post("/Settings/Save", JSON.stringify(self), function (data) {
            if (!ErrorHandler.CheckJsonRes(data)) {
                return;
            }
        });
    };
    SettingsClass.prototype.Clone = function () {
        var cloneObj = new SettingsClass();
        for (var key in this) {
            if (this.hasOwnProperty(key)) {
                //cloneObj[key] = this[key];
            }
        }
        return cloneObj;
    };
    SettingsClass.prototype.CopyFrom = function (objSource) {
        for (var key in objSource) {
            if (objSource.hasOwnProperty(key)) {
                this[key] = objSource[key];
            }
        }
    };
    return SettingsClass;
}());
var Settings = new SettingsClass();
// Load settings from server
Settings.Load();
