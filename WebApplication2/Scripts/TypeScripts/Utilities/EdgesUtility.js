/// <reference path="../_reference.d.ts" />
var EdgesUtility = /** @class */ (function () {
    function EdgesUtility(object, thresholdAngle) {
        var thresholdDot = Math.cos(THREE.Math.degToRad(thresholdAngle));
        var edge = [0, 0], hash = {};
        var sortFunction = function (a, b) { return a - b; };
        var keys = ['a', 'b', 'c'];
        var geometry = new THREE.BufferGeometry();
        var geometry2;
        if (object.geometry instanceof THREE.BufferGeometry) {
            geometry2 = new THREE.Geometry();
            geometry2.fromBufferGeometry(object.geometry);
        }
        else {
            geometry2 = object.geometry.clone();
        }
        geometry2.mergeVertices();
        geometry2.computeFaceNormals();
        var vertices = geometry2.vertices;
        var faces = geometry2.faces;
        var numEdges = 0;
        for (var i = 0, l = faces.length; i < l; i++) {
            var face = faces[i];
            for (var j = 0; j < 3; j++) {
                edge[0] = face[keys[j]];
                edge[1] = face[keys[(j + 1) % 3]];
                edge.sort(sortFunction);
                var key = edge.toString();
                if (hash[key] === undefined) {
                    hash[key] = { vert1: edge[0], vert2: edge[1], face1: i, face2: undefined };
                    numEdges++;
                }
                else {
                    hash[key].face2 = i;
                }
            }
        }
        this.Geometry = new THREE.Geometry();
        var index = 0;
        for (var keyHash in hash) {
            var h = hash[keyHash];
            if (h.face2 === undefined || faces[h.face1].normal.dot(faces[h.face2].normal) <= thresholdDot) {
                var vertex = vertices[h.vert1];
                this.Geometry.vertices.push(vertex);
                vertex = vertices[h.vert2];
                this.Geometry.vertices.push(vertex);
            }
        }
    }
    return EdgesUtility;
}());
