/// <reference path="../_reference.d.ts" />
/// <reference path="../Loaders/SkinMeshLoader.ts" />

class SkinMesh
{
    public EntityId: string;

    public Coords:Array<Point3DExt>;

    public SkinTriangles:Array<TriIndex>;

    public Edges:Array<EdgeIndex>;

    public VertexColors: Array<number>;

    public Elements: Array<FRDElement>;

    public Transformation:EntityMatrix;

    constructor()
    {
        this.EntityId = "";
        this.Coords = new Array<Point3DExt>();
        this.SkinTriangles = new Array<TriIndex>();
        this.Edges = new Array<EdgeIndex>();
        this.Elements = new Array<FRDElement>();
    }


    // Convert object to exact classes
    public static CreateFromObject(obj:any):SkinMesh
    {
        var skinMesh = new SkinMesh();
        _.each(obj.Coords, function(p: Point3DExt){
            skinMesh.Coords.push(new Point3DExt(p.MathTag, p.X, p.Y, p.Z));
        });
        _.each(obj.SkinTriangles, function(t: TriIndex){
            skinMesh.SkinTriangles.push(new TriIndex(t.MathTag, t.N1, t.N2, t.N3));
        });
        _.each(obj.Edges, function(e: EdgeIndex){
            skinMesh.Edges.push(new EdgeIndex(e.MathTag, e.N1, e.N2));
        });
        _.each(obj.Elements, function (e: FRDElement)
        {
            skinMesh.Elements.push(new FRDElement(e.Number, e.Type, e.Nodes));
        });

        skinMesh.EntityId = obj.EntityId;
        skinMesh.Transformation = new EntityMatrix();
        if (obj.Transformation)
        {
            skinMesh.Transformation.elements = obj.Transformation.elements;
        }

        return skinMesh;
    }

    public static Create(mesh:THREE.Mesh):SkinMesh
    {
        var skinMesh = new SkinMesh();

        skinMesh.EntityId = mesh.uuid;

        // Coords
        skinMesh.Coords = new Array<Point3DExt>();
        var verts = mesh.geometry.vertices;
        for (var idxVert in verts)
        {
            var vert = verts[idxVert];

            var tag: number = (<any>vert).tag;
            var p = new Point3DExt(tag, vert.x, vert.y, vert.z);
            skinMesh.Coords.push(p);
        }

        // SkinTriangles
        skinMesh.SkinTriangles = new Array<TriIndex>();
        var faces = mesh.geometry.faces;
        for(var idxFace in faces)
        {
            var face = faces[idxFace];
            var fTag:number = (<any>face).tag;
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
    }

    public ConvertToMesh(entType: EntityType):THREE.Mesh
    {
      
        var geometry = new THREE.Geometry();

        for (var idx in this.Coords)
        {
            var vert = this.Coords[idx];

            var destVert = new THREE.Vector3(vert.X, vert.Y, vert.Z);
            (<any>destVert).tag = vert.MathTag;

            geometry.vertices.push(destVert);
        }
        for (var idx in this.SkinTriangles)
        {
            var tri = this.SkinTriangles[idx];
            var face = new THREE.Face3(tri.N1, tri.N2, tri.N3);
            (<any>face).tag = tri.MathTag;
            if (tri.MathTag == -1)
            {
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
    }
}

class Point3DExt
{
    public MathTag: number;

    public X:number;

    public Y:number;

    public Z:number;

    constructor(tag: number, x: number, y: number, z: number)
    {
        this.MathTag = tag;
        this.X = x;
        this.Y = y;
        this.Z = z;
    }
}

class TriIndex
{
    public MathTag:number;

    public N1:number;

    public N2:number;

    public N3:number;

    constructor(tag: number, n1: number, n2: number, n3: number)
    {
        this.MathTag = tag;
        this.N1 = n1;
        this.N2 = n2;
        this.N3 = n3;
    }
}

class EdgeIndex
{
    public MathTag:number;

    public N1:number;

    public N2:number;

    constructor(tag: number, n1: number, n2: number)
    {
        this.MathTag = tag;
        this.N1 = n1;
        this.N2 = n2;
    }
}

class FRDElement
{
    public Number: number;

    public Type: number;

    public Nodes: Array<number>;

    constructor(num: number, type: number, nodes: Array<number>)
    {
        this.Number = num;
        this.Type = type;
        this.Nodes = nodes;
    }
}