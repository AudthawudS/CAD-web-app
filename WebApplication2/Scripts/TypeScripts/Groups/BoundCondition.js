/// <reference path="../_reference.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var BoundCondition = /** @class */ (function () {
    function BoundCondition() {
    }
    return BoundCondition;
}());
var BoundConditionNodalLoad = /** @class */ (function (_super) {
    __extends(BoundConditionNodalLoad, _super);
    function BoundConditionNodalLoad() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BoundConditionNodalLoad;
}(BoundCondition));
var BoundConditionDisplacement = /** @class */ (function (_super) {
    __extends(BoundConditionDisplacement, _super);
    function BoundConditionDisplacement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BoundConditionDisplacement;
}(BoundCondition));
var BoundConditionMoment = /** @class */ (function (_super) {
    __extends(BoundConditionMoment, _super);
    function BoundConditionMoment() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BoundConditionMoment;
}(BoundCondition));
var BoundConditionFixed = /** @class */ (function (_super) {
    __extends(BoundConditionFixed, _super);
    function BoundConditionFixed() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BoundConditionFixed;
}(BoundCondition));
