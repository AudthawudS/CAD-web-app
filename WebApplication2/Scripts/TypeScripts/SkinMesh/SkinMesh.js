/// <reference path="../_reference.d.ts" />
/// <reference path="../Loaders/SkinMeshLoader.ts" />
var SkinMesh = /** @class */ (function () {
    function SkinMesh() {
        this.EntityId = "";
        this.Coords = new Array();
        this.SkinTriangles = new Array();
        this.Edges = new Array();
        this.Elements = new Array();
    }
    // Convert object to exact classes
    SkinMesh.CreateFromObject = function (obj) {
        var skinMesh = new SkinMesh();
        _.each(obj.Coords, function (p) {
            skinMesh.Coords.push(new Point3DExt(p.MathTag, p.X, p.Y, p.Z));
        });
        _.each(obj.SkinTriangles, function (t) {
            skinMesh.SkinTriangles.push(new TriIndex(t.MathTag, t.N1, t.N2, t.N3));
        });
        _.each(obj.Edges, function (e) {
            skinMesh.Edges.push(new EdgeIndex(e.MathTag, e.N1, e.N2));
        });
        _.each(obj.Elements, function (e) {
            skinMesh.Elements.push(new FRDElement(e.Number, e.Type, e.Nodes));
        });
        skinMesh.EntityId = obj.EntityId;
        skinMesh.Transformation = new EntityMatrix();
        if (obj.Transformation) {
            skinMesh.Transformation.elements = obj.Transformation.elements;
        }
        return skinMesh;
    };
    SkinMesh.Create = function (mesh) {
        var skinMesh = new SkinMesh();
        skinMesh.EntityId = mesh.uuid;
        // Coords
        skinMesh.Coords = new Array();
        var verts = mesh.geometry.vertices;
        for (var idxVert in verts) {
            var vert = verts[idxVert];
            var tag = vert.tag;
            var p = new Point3DExt(tag, vert.x, vert.y, vert.z);
            skinMesh.Coords.push(p);
        }
        // SkinTriangles
        skinMesh.SkinTriangles = new Array();
        var faces = mesh.geometry.faces;
        for (var idxFace in faces) {
            var face = faces[idxFace];
            var fTag = face.tag;
            var tri = new TriIndex(fTag, face.a, face.b, face.c);
            skinMesh.SkinTriangles.push(tri);
        }
        // Edges
        var objData = GetObjectData(mesh);
        skinMesh.Edges = objData.Edges;
        skinMesh.Elements = objData.Elements;
        // Transform
        skinMesh.Transformation = EntityMatrix.Create(mesh.matrix);
        return skinMesh;
    };
    SkinMesh.prototype.ConvertToMesh = function (entType) {
        var geometry = new THREE.Geometry();
        for (var idx in this.Coords) {
            var vert = this.Coords[idx];
            var destVert = new THREE.Vector3(vert.X, vert.Y, vert.Z);
            destVert.tag = vert.MathTag;
            geometry.vertices.push(destVert);
        }
        for (var idx in this.SkinTriangles) {
            var tri = this.SkinTriangles[idx];
            var face = new THREE.Face3(tri.N1, tri.N2, tri.N3);
            face.tag = tri.MathTag;
            if (tri.MathTag == -1) {
                continue;
            }
            geometry.faces.push(face);
        }
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        var mesh = new THREE.Mesh(geometry);
        mesh.uuid = this.EntityId;
        var objData = new ObjectData(entType, false);
        objData.Edges = this.Edges;
        objData.Elements = this.Elements;
        mesh.userData = objData;
        return mesh;
    };
    return SkinMesh;
}());
var Point3DExt = /** @class */ (function () {
    function Point3DExt(tag, x, y, z) {
        this.MathTag = tag;
        this.X = x;
        this.Y = y;
        this.Z = z;
    }
    return Point3DExt;
}());
var TriIndex = /** @class */ (function () {
    function TriIndex(tag, n1, n2, n3) {
        this.MathTag = tag;
        this.N1 = n1;
        this.N2 = n2;
        this.N3 = n3;
    }
    return TriIndex;
}());
var EdgeIndex = /** @class */ (function () {
    function EdgeIndex(tag, n1, n2) {
        this.MathTag = tag;
        this.N1 = n1;
        this.N2 = n2;
    }
    return EdgeIndex;
}());
var FRDElement = /** @class */ (function () {
    function FRDElement(num, type, nodes) {
        this.Number = num;
        this.Type = type;
        this.Nodes = nodes;
    }
    return FRDElement;
}());
