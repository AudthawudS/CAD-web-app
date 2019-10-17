/// <reference path="../_reference.d.ts" />
var RenderingController = /** @class */ (function () {
    function RenderingController($scope) {
        this.$scope = $scope;
        var self = this;
        this._scope = $scope;
        // 'vm' stands for 'view model'. We're adding a reference to the controller to the scope
        // for its methods to be accessible from view / HTML
        $scope.vm = this;
        this.CameraType = "Perspective";
        // Apply settings
        self.ApplySettings(Settings);
        // Attach to change event
        Settings.Changed.on(function (settings) {
            // Apply settings when they changes
            if (!self._scope.$$phase) {
                self._scope.$apply(function () {
                    self.ApplySettings(settings);
                });
            }
            else {
                self.ApplySettings(settings);
            }
        });
        // Enable color palette for Solid
        $('#selector-shading-color-palette').colorPalette()
            .on('selectColor', function (e) {
            // Handler of color changes
            //
            $("#selector-shading-color").css("background-color", e.color);
            // Convert from hex string to decimal
            var strColor = e.color;
            strColor = strColor.replace("#", "");
            var colorNr = parseInt(strColor, 16);
            if (!isNaN(colorNr)) {
                Settings.ShadingColor = colorNr;
                // Save to server
                Settings.Save();
                Rendering.SetRenderingMode(RenderingModeType.ShadingEdge);
            }
        });
        // Enable color palette for Viewer Background
        $('#selector-viewer-bg-color-palette').colorPalette()
            .on('selectColor', function (e) {
            // Handler of color changes
            //
            $("#selector-viewer-bg-color").css("background-color", e.color);
            // Convert from hex string to decimal
            var strColor = e.color;
            strColor = strColor.replace("#", "");
            var colorNr = parseInt(strColor, 16);
            if (!isNaN(colorNr)) {
                Settings.ViewerBackgroundColor = colorNr;
                // Save to server
                Settings.Save();
                Rendering.SetViewerBackgroundColor(colorNr);
            }
        });
        // Enable color palette for Load Arrows
        $('#selector-load-arrows-color-palette').colorPalette()
            .on('selectColor', function (e) {
            // Handler of color changes
            //
            $("#selector-load-arrows-color").css("background-color", e.color);
            // Convert from hex string to decimal
            var strColor = e.color;
            strColor = strColor.replace("#", "");
            var colorNr = parseInt(strColor, 16);
            if (!isNaN(colorNr)) {
                Settings.LoadArrowsColor = colorNr;
                // Save to server
                Settings.Save();
                // Set colors
                Rendering.SetForceArrowsColor(colorNr);
            }
        });
        // Enable color palette for Moment symbols
        $('#selector-moment-symb-color-palette').colorPalette()
            .on('selectColor', function (e) {
            // Handler of color changes
            //
            $("#selector-moment-symb-color").css("background-color", e.color);
            // Convert from hex string to decimal
            var strColor = e.color;
            strColor = strColor.replace("#", "");
            var colorNr = parseInt(strColor, 16);
            if (!isNaN(colorNr)) {
                Settings.MomentSymbolColor = colorNr;
                // Save to server
                Settings.Save();
                // Set colors
                Rendering.SetMomentColor(colorNr);
            }
        });
        // Enable color palette for Fixed Symbols
        $('#selector-fixed-symbs-color-palette').colorPalette()
            .on('selectColor', function (e) {
            // Handler of color changes
            //
            $("#selector-fixed-symbs-color").css("background-color", e.color);
            // Convert from hex string to decimal
            var strColor = e.color;
            strColor = strColor.replace("#", "");
            var colorNr = parseInt(strColor, 16);
            if (!isNaN(colorNr)) {
                Settings.FixedSymbolColor = colorNr;
                // Save to server
                Settings.Save();
                // Set colors
                Rendering.SetFixedSymbolColor(colorNr);
            }
        });
    }
    RenderingController.prototype.ApplySettings = function (settings) {
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
    };
    RenderingController.prototype.CameraTypeChanged = function () {
        var self = this;
        if (self.CameraType == "Perspective") {
            App.Layout.SwitchCameraToPerspective();
        }
        else {
            App.Layout.SwitchCameraToOrtho();
        }
    };
    RenderingController.prototype.GridChanged = function () {
        var self = this;
        if (this.IsGridEnabled != Settings.IsGridEnabled) {
            Settings.IsGridEnabled = this.IsGridEnabled;
            Settings.Save();
            Rendering.EnableGrid(Settings.IsGridEnabled);
        }
    };
    RenderingController.prototype.FixedSymbolsChanged = function () {
        var self = this;
        if (this.IsFixedSymbolsEnabled != Settings.IsFixedSymbolEnabled) {
            Settings.IsFixedSymbolEnabled = this.IsFixedSymbolsEnabled;
            Settings.Save();
            Rendering.EnableFixedSymbols(Settings.IsFixedSymbolEnabled);
        }
    };
    RenderingController.prototype.LoadArrowsChanged = function () {
        var self = this;
        if (this.IsLoadArrowsEnabled != Settings.IsLoadArrowsEnabled) {
            Settings.IsLoadArrowsEnabled = this.IsLoadArrowsEnabled;
            Settings.Save();
            Rendering.EnableLoadArrows(Settings.IsLoadArrowsEnabled);
        }
    };
    RenderingController.prototype.MomentChanged = function () {
        var self = this;
        if (this.IsMomentSymbolEnabled != Settings.IsMomentSymbolEnabled) {
            Settings.IsMomentSymbolEnabled = this.IsMomentSymbolEnabled;
            Settings.Save();
            Rendering.EnableMomentSymbols(Settings.IsMomentSymbolEnabled);
        }
    };
    RenderingController.prototype.SetPaletteShadingColor = function (color) {
        var strColor = ColorUtility.DecimalToCSSRGB(color);
        $("#selector-shading-color").css("background-color", strColor);
    };
    RenderingController.prototype.SetPaletteViewerBackgroundColor = function (color) {
        var strColor = ColorUtility.DecimalToCSSRGB(color);
        $("#selector-viewer-bg-color").css("background-color", strColor);
    };
    RenderingController.prototype.SetPaletteLoadArrowsColor = function (color) {
        var strColor = ColorUtility.DecimalToCSSRGB(color);
        $("#selector-load-arrows-color").css("background-color", strColor);
    };
    RenderingController.prototype.SetPaletteMomentColor = function (color) {
        var strColor = ColorUtility.DecimalToCSSRGB(color);
        $("#selector-moment-symb-color").css("background-color", strColor);
    };
    RenderingController.prototype.SetPaletteFixedSymbolColor = function (color) {
        var strColor = ColorUtility.DecimalToCSSRGB(color);
        $("#selector-fixed-symbs-color").css("background-color", strColor);
    };
    // $inject annotation.
    // It provides $injector with information about dependencies to be injected into constructor
    // it is better to have it close to the constructor, because the parameters must match in count and type.
    // See http://docs.angularjs.org/guide/di
    RenderingController.$inject = [
        '$scope'
    ];
    return RenderingController;
}());
