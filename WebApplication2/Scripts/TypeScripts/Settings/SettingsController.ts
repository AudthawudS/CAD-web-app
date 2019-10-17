/// <reference path="../_reference.d.ts" />

interface ISettingsScope extends ng.IScope
{
    vm: SettingsController;
}

class SettingsController
{

    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope'
    ];

    public static Instance:SettingsController;

    public UnitsStr: string;

    private  _scope:ISettingsScope;

    constructor($scope:ISettingsScope)
    {
        this._scope = $scope;
        $scope.vm = this;

        var self = this;

        self.UnitsStr = "mm_g_ms";

        SettingsController.Instance = this;
    }

    public Accept()
    {
        var unitsStr = this.UnitsStr;
        if(unitsStr == "mm_g_ms")
        {
            Settings.Units = Units.mm_g_ms;
        }
        else if(unitsStr == "m_kg_s")
        {
            Settings.Units = Units.m_kg_s;
        }
        else if (unitsStr == "inch_lb_s") {
            Settings.Units = Units.inch_lb_s;
        }
        else
        {
            throw new Error("Unknown units: " + unitsStr);
        }

        // Save on server
        Settings.Save();
    }

    public ShowDialog()
    {
        var self = this;

        $("#settings-dialog").modal();
        self._scope.$apply(function()
        {
            var settings = Settings;
            if(settings.Units == Units.mm_g_ms)
            {
                self.UnitsStr = "mm_g_ms";
            }
            else if(settings.Units == Units.m_kg_s)
            {
                self.UnitsStr = "m_kg_s";
            }
            else if (settings.Units == Units.inch_lb_s) {
                self.UnitsStr = "inch_lb_s";
            }
            else
            {
                throw new Error("Unknown units: " + settings.Units);
            }
        });
    }
}

