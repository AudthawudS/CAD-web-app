/// <reference path="../_reference.d.ts" />

class RenderingController
{
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    public static $inject = [
        '$scope'
    ];

    private _scope: ng.IScope;

    private IsLoadArrowsEnabled: boolean;

    private IsFixedSymbolsEnabled: boolean;

    private IsMomentSymbolEnabled: boolean;

    private IsGridEnabled: boolean;

    private CameraType : string;

    constructor(private $scope: ng.IScope)
    {
        var self = this;

        this._scope = $scope;

        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        (<any>$scope).vm = this;

        this.CameraType = "Perspective";

        // Apply settings
        self.ApplySettings(Settings);

        // Attach to change event
        Settings.Changed.on((settings) =>
        {
            // Apply settings when they changes

            if (!self._scope.$$phase)
            {
                self._scope.$apply(() =>
                {
                    self.ApplySettings(settings);
                });
            }
            else
            {
                self.ApplySettings(settings);
            }
        });
        

        // Enable color palette for Solid
        (<any>$('#selector-shading-color-palette')).colorPalette()
            .on('selectColor', function (e)
            {
                // Handler of color changes
                //

                $("#selector-shading-color").css("background-color", e.color);
                // Convert from hex string to decimal
                var strColor = <string>e.color;
                strColor = strColor.replace("#", "");
                var colorNr = parseInt(strColor, 16);
                if (!isNaN(colorNr))
                {
                    Settings.ShadingColor = colorNr;
                    // Save to server
                    Settings.Save();

                    Rendering.SetRenderingMode(RenderingModeType.ShadingEdge);
                }
            });

        // Enable color palette for Viewer Background
        (<any>$('#selector-viewer-bg-color-palette')).colorPalette()
            .on('selectColor', function (e)
            {
                // Handler of color changes
                //

                $("#selector-viewer-bg-color").css("background-color", e.color);
                // Convert from hex string to decimal
                var strColor = <string>e.color;
                strColor = strColor.replace("#", "");
                var colorNr = parseInt(strColor, 16);
                if (!isNaN(colorNr))
                {
                    Settings.ViewerBackgroundColor = colorNr;
                    // Save to server
                    Settings.Save();

                    Rendering.SetViewerBackgroundColor(colorNr);
                }
            });

        // Enable color palette for Load Arrows
        (<any>$('#selector-load-arrows-color-palette')).colorPalette()
            .on('selectColor', function (e)
            {
                // Handler of color changes
                //
                $("#selector-load-arrows-color").css("background-color", e.color);
                // Convert from hex string to decimal
                var strColor = <string>e.color;
                strColor = strColor.replace("#", "");
                var colorNr = parseInt(strColor, 16);
                if (!isNaN(colorNr))
                {
                    Settings.LoadArrowsColor = colorNr;
                    // Save to server
                    Settings.Save();

                    // Set colors
                    Rendering.SetForceArrowsColor(colorNr);
                }
            });

        // Enable color palette for Moment symbols
        (<any>$('#selector-moment-symb-color-palette')).colorPalette()
            .on('selectColor', function (e)
            {
                // Handler of color changes
                //
                $("#selector-moment-symb-color").css("background-color", e.color);
                // Convert from hex string to decimal
                var strColor = <string>e.color;
                strColor = strColor.replace("#", "");
                var colorNr = parseInt(strColor, 16);
                if (!isNaN(colorNr))
                {
                    Settings.MomentSymbolColor = colorNr;
                    // Save to server
                    Settings.Save();

                    // Set colors
                    Rendering.SetMomentColor(colorNr);
                }
            });

        // Enable color palette for Fixed Symbols
        (<any>$('#selector-fixed-symbs-color-palette')).colorPalette()
            .on('selectColor', function (e)
            {
                // Handler of color changes
                //
                $("#selector-fixed-symbs-color").css("background-color", e.color);
                // Convert from hex string to decimal
                var strColor = <string>e.color;
                strColor = strColor.replace("#", "");
                var colorNr = parseInt(strColor, 16);
                if (!isNaN(colorNr))
                {
                    Settings.FixedSymbolColor = colorNr;

                    // Save to server
                    Settings.Save();

                    // Set colors
                    Rendering.SetFixedSymbolColor(colorNr);
                }
            });
    }

    private ApplySettings(settings: SettingsClass)
    {
        var self = this;

        self.IsLoadArrowsEnabled = settings.IsLoadArrowsEnabled;
        Rendering.EnableLoadArrows(settings.IsLoadArrowsEnabled);

        self.IsMomentSymbolEnabled = settings.IsMomentSymbolEnabled;
        Rendering.EnableMomentSymbols(settings.IsMomentSymbolEnabled);

        self.IsFixedSymbolsEnabled = settings.IsFixedSymbolEnabled;
        Rendering.EnableFixedSymbols(settings.IsFixedSymbolEnabled);

        self.IsGridEnabled = settings.IsGridEnabled;
        Rendering.EnableGrid(self.IsGridEnabled);

        self.SetPaletteShadingColor(settings.ShadingColor);

        self.SetPaletteViewerBackgroundColor(settings.ViewerBackgroundColor);
        Rendering.SetViewerBackgroundColor(settings.ViewerBackgroundColor);

        self.SetPaletteLoadArrowsColor(settings.LoadArrowsColor);
        Rendering.SetForceArrowsColor(settings.LoadArrowsColor);

        self.SetPaletteMomentColor(settings.MomentSymbolColor);
        Rendering.SetMomentColor(settings.MomentSymbolColor);

        self.SetPaletteFixedSymbolColor(Settings.FixedSymbolColor);
        Rendering.SetFixedSymbolColor(settings.FixedSymbolColor);
    }

    private CameraTypeChanged()
    {
        var self = this;
        if (self.CameraType == "Perspective")
        {
            App.Layout.SwitchCameraToPerspective();
        }
        else
        {
            App.Layout.SwitchCameraToOrtho();
        }
    }

    private GridChanged()
    {
        var self = this;
        if (this.IsGridEnabled != Settings.IsGridEnabled)
        {
            Settings.IsGridEnabled = this.IsGridEnabled;
            Settings.Save();

            Rendering.EnableGrid(Settings.IsGridEnabled);
        }
    }

    private FixedSymbolsChanged()
    {
        var self = this;
        if (this.IsFixedSymbolsEnabled != Settings.IsFixedSymbolEnabled)
        {
            Settings.IsFixedSymbolEnabled = this.IsFixedSymbolsEnabled;
            Settings.Save();

            Rendering.EnableFixedSymbols(Settings.IsFixedSymbolEnabled);
        }
    }

    private LoadArrowsChanged()
    {
        var self = this;
        if (this.IsLoadArrowsEnabled != Settings.IsLoadArrowsEnabled)
        {
            Settings.IsLoadArrowsEnabled = this.IsLoadArrowsEnabled;
            Settings.Save();

            Rendering.EnableLoadArrows(Settings.IsLoadArrowsEnabled);
        }
    }

    private MomentChanged()
    {
        var self = this;
        if (this.IsMomentSymbolEnabled != Settings.IsMomentSymbolEnabled)
        {
            Settings.IsMomentSymbolEnabled = this.IsMomentSymbolEnabled;
            Settings.Save();

            Rendering.EnableMomentSymbols(Settings.IsMomentSymbolEnabled);
        }
    }
    


    private SetPaletteShadingColor(color: number)
    {
        var strColor = ColorUtility.DecimalToCSSRGB(color);
        $("#selector-shading-color").css("background-color", strColor);
    }

    private SetPaletteViewerBackgroundColor(color: number)
    {
        var strColor = ColorUtility.DecimalToCSSRGB(color);
        $("#selector-viewer-bg-color").css("background-color", strColor);
    }

    private SetPaletteLoadArrowsColor(color: number)
    {
        var strColor = ColorUtility.DecimalToCSSRGB(color);
        $("#selector-load-arrows-color").css("background-color", strColor);
    }

    private SetPaletteMomentColor(color: number)
    {
        var strColor = ColorUtility.DecimalToCSSRGB(color);
        $("#selector-moment-symb-color").css("background-color", strColor);
    }

    private SetPaletteFixedSymbolColor(color: number)
    {
        var strColor = ColorUtility.DecimalToCSSRGB(color);
        $("#selector-fixed-symbs-color").css("background-color", strColor);
    }
}