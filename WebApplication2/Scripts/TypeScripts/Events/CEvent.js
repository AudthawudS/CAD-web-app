var CEvent = /** @class */ (function () {
    function CEvent() {
        this.handlers = [];
    }
    CEvent.prototype.on = function (handler) {
        this.handlers.push(handler);
    };
    CEvent.prototype.off = function (handler) {
        this.handlers = this.handlers.filter(function (h) { return h !== handler; });
    };
    CEvent.prototype.fire = function (data) {
        if (this.handlers) {
            this.handlers.slice(0).forEach(function (h) { return h(data); });
        }
    };
    return CEvent;
}());
