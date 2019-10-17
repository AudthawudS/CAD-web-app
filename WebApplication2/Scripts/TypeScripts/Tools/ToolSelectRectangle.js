/// <reference path="../_reference.d.ts" />
/// <reference path="../Events/CEvent.ts" />
var ToolSelectRectangle = /** @class */ (function () {
    function ToolSelectRectangle() {
        this.ItemsSelected = new CEvent();
    }
    ToolSelectRectangle.prototype.Start = function () {
        var inst = this;
        inst._rect = $("<div class='ToolSelectRectangle' style='pointer-events:none; position: absolute; z-index: 100;' ></div>");
        inst._rect.hide();
        $(".ToolSelectRectangle").remove();
        $("body").append(inst._rect);
        // Change navigation
        App.Layout.Controls.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: -1 /*none*/ };
        App.Layout.SetCursor("pick");
        this._mouseDownPos = null;
    };
    ToolSelectRectangle.prototype.End = function () {
        this.Clear();
    };
    ToolSelectRectangle.prototype.Clear = function () {
        $(".ToolSelectRectangle").remove();
        // remove events
        this.ItemsSelected = new CEvent();
        // Restore navigation buttons
        App.Layout.Controls.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
        App.Layout.SetCursor("default");
    };
    ToolSelectRectangle.prototype.MouseDown = function (evt) {
        var self = this;
        if (evt.button != 0) {
            self._mouseDownPos = null;
            return;
        }
        self._mouseDownPos = new THREE.Vector2(evt.clientX, evt.clientY);
        self._rect.css('left', evt.offsetX + 'px');
        self._rect.css('top', evt.offsetY + 'px');
    };
    ToolSelectRectangle.prototype.MouseUp = function (evt) {
        var _this = this;
        var self = this;
        if (self._mouseDownPos == null) {
            return;
        }
        var posUp = new THREE.Vector2(0, 0);
        posUp.x = evt.clientX;
        posUp.y = evt.clientY;
        var box = new THREE.Box2();
        box.min.x = Math.min(posUp.x, self._mouseDownPos.x);
        box.min.y = Math.min(posUp.y, self._mouseDownPos.y);
        box.max.x = Math.max(posUp.x, self._mouseDownPos.x);
        box.max.y = Math.max(posUp.y, self._mouseDownPos.y);
        // Set min size 10x10 px
        //
        if (box.size().x < 5) {
            box.min.x -= 5;
            box.max.x += 5;
        }
        if (box.size().y < 5) {
            box.min.y -= 5;
            box.max.y += 5;
        }
        App.Layout.Selector.GetItemsByRect(box, this.SelectionItemType, function (selItems) {
            _this.ItemsSelected.fire(selItems);
        });
        self._mouseDownPos = null;
        self._rect.hide();
        App.Layout.SetCursor("pick");
    };
    ToolSelectRectangle.prototype.MouseMove = function (evt) {
        var self = this;
        if (self._mouseDownPos == null) {
            return;
        }
        var pos = new THREE.Vector2(0, 0);
        pos.x = evt.clientX - self._mouseDownPos.x;
        pos.y = evt.clientY - self._mouseDownPos.y;
        var w = Math.abs(pos.x);
        var h = Math.abs(pos.y);
        if (w < 1 || h < 1) {
            return;
        }
        App.Layout.SetCursor("crosshair");
        var rect = self._rect;
        rect.show();
        // square variations
        // (0,0) origin is the TOP LEFT pixel of the canvas.
        //
        //  1 | 2
        // ---.---
        //  4 | 3
        // there are 4 ways a square can be gestured onto the screen.  the following detects these four variations
        // and creates/updates the CSS to draw the square on the screen
        if (pos.x < 0 && pos.y < 0) {
            rect.css({ left: evt.clientX + 'px', width: -pos.x + 'px', top: evt.clientY + 'px', height: -pos.y + 'px' });
        }
        else if (pos.x >= 0 && pos.y <= 0) {
            rect.css({ left: self._mouseDownPos.x + 'px', width: pos.x + 'px', top: evt.clientY, height: -pos.y + 'px' });
        }
        else if (pos.x >= 0 && pos.y >= 0) {
            rect.css({ left: self._mouseDownPos.x + 'px', width: pos.x + 'px', height: pos.y + 'px', top: self._mouseDownPos.y + 'px' });
        }
        else if (pos.x < 0 && pos.y >= 0) {
            rect.css({ left: evt.clientX + 'px', width: -pos.x + 'px', height: pos.y + 'px', top: self._mouseDownPos.y + 'px' });
        }
    };
    ToolSelectRectangle.prototype.KeyDown = function (evt) {
    };
    return ToolSelectRectangle;
}());
