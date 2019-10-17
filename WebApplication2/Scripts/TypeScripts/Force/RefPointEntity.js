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
var RefPointEntity = /** @class */ (function (_super) {
    __extends(RefPointEntity, _super);
    function RefPointEntity() {
        var _this = _super.call(this) || this;
        var self = _this;
        var layoutSize = App.Layout.GetExtent().size();
        var size = 0;
        if (layoutSize != null) {
            size = Math.max(layoutSize.x, layoutSize.y) / 30;
        }
        if (size == 0) {
            size = 1;
        }
        var material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        self.material = material;
        var color = ColorUtility.DecimalToTHREE(Settings.FixedSymbolColor);
        material.color.setHex(color.getHex());
        var sphereGeom = new THREE.SphereGeometry(size / 2, 12, 12);
        self.geometry = sphereGeom;
        // add attributes
        self.userData = new ObjectData(EntityType.ReferencePoint, false);
        // Create tags for faces for selector
        sphereGeom.faces.forEach(function (f) {
            f.tag = 0;
        });
        return _this;
    }
    return RefPointEntity;
}(THREE.Mesh));
