/// <reference path="../_reference.d.ts" />
var EntityMatrix = /** @class */ (function () {
    function EntityMatrix() {
        // Create ident elements
        var mat = new THREE.Matrix4();
        mat.identity();
        var elementsArr = Array.prototype.slice.call(mat.elements); // Float32 to array
        this.elements = elementsArr;
    }
    EntityMatrix.Create = function (mat) {
        var elementsArr = Array.prototype.slice.call(mat.elements); // Float32 to array
        var outMat = new EntityMatrix();
        outMat.elements = elementsArr;
        return outMat;
    };
    EntityMatrix.prototype.ToMatrix4 = function () {
        var thMat = new THREE.Matrix4();
        thMat.elements = new Float32Array(this.elements);
        return thMat;
    };
    return EntityMatrix;
}());
