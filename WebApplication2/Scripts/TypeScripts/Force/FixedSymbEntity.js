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
var FixedSymbEntity = /** @class */ (function (_super) {
    __extends(FixedSymbEntity, _super);
    function FixedSymbEntity(baseMesh, pointsIdxs, size) {
        var _this = _super.call(this) || this;
        var self = _this;
        self._baseMesh = baseMesh;
        var points = self.GetPointsFromIndexes(baseMesh, pointsIdxs);
        self.SortPoints(points);
        var excludeBox = null;
        self._arrows = new Hashtable();
        self.Material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        var color = ColorUtility.DecimalToTHREE(Settings.FixedSymbolColor);
        self.Material.color.setHex(color.getHex());
        var material = self.Material;
        for (var idx in points) {
            var pnt = points[idx];
            if (excludeBox) {
                if (excludeBox.containsPoint(pnt)) {
                    continue;
                }
            }
            var sizeArrow = size;
            var sphereGeom = new THREE.SphereGeometry(sizeArrow / 2, 12, 12);
            var mesh = new THREE.Mesh(sphereGeom, material);
            mesh.position.set(pnt.x, pnt.y, pnt.z);
            _this.add(mesh);
            var index = baseMesh.geometry.vertices.indexOf(pnt);
            self._arrows.put(index, mesh);
            var minBox = pnt.clone().sub(new THREE.Vector3(size / 2, size / 2, size / 2));
            var maxBox = pnt.clone().add(new THREE.Vector3(size / 2, size / 2, size / 2));
            excludeBox = new THREE.Box3(minBox, maxBox);
        }
        // add attributes
        _this.userData = new ObjectData(EntityType.FixedSymb, true);
        return _this;
    }
    FixedSymbEntity.prototype.Update = function () {
        var self = this;
        self._arrows.each(function (vertIdx, mesh) {
            var vert = self._baseMesh.geometry.vertices[vertIdx];
            vert = vert.clone().applyMatrix4(self._baseMesh.matrixWorld);
            mesh.position.set(vert.x, vert.y, vert.z);
        });
    };
    FixedSymbEntity.prototype.GetPointsFromIndexes = function (baseMesh, pointsIdxs) {
        var outPoints = new Array();
        var vertices = baseMesh.geometry.vertices;
        pointsIdxs.forEach(function (pntIdx) {
            var pnt = vertices[pntIdx];
            outPoints.push(pnt);
        });
        return outPoints;
    };
    FixedSymbEntity.prototype.SortPoints = function (points) {
        // Sort point by XY
        //
        points.sort(function (a, b) {
            if (a.y > b.y) {
                return 1;
            }
            else if (a.y < b.y) {
                return -1;
            }
            if (a.x > b.x) {
                return 1;
            }
            else if (a.x < b.x) {
                return -1;
            }
            if (a.z > b.z) {
                return 1;
            }
            else if (a.z < b.z) {
                return -1;
            }
            return 0;
        });
    };
    return FixedSymbEntity;
}(THREE.Object3D));
