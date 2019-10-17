/// <reference path="../_reference.d.ts" />

class FixedSymbEntity extends THREE.Object3D
{
    public Material: THREE.MeshBasicMaterial;

    private _baseMesh: THREE.Mesh;

    private _arrows: IHashtable<number, THREE.Mesh>;

    constructor(baseMesh: THREE.Mesh, pointsIdxs: Array<number>, size: number)
    {
        super();

        var self = this;

        self._baseMesh = baseMesh;

        var points = self.GetPointsFromIndexes(baseMesh, pointsIdxs);
        self.SortPoints(points);

        var excludeBox: THREE.Box3 = null;

        self._arrows = new Hashtable<number, THREE.Mesh>();

        self.Material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
        var color = ColorUtility.DecimalToTHREE(Settings.FixedSymbolColor);
        self.Material.color.setHex(color.getHex());

        var material = self.Material;

        for (var idx in points)
        {
            var pnt = points[idx];

            if (excludeBox)
            {
                if (excludeBox.containsPoint(pnt))
                {
                    continue;
                }
            }

            var sizeArrow = size;

            var sphereGeom = new THREE.SphereGeometry(sizeArrow / 2, 12, 12);
            var mesh = new THREE.Mesh(sphereGeom, material);

            mesh.position.set(pnt.x, pnt.y, pnt.z);

            this.add(mesh);

            var index = baseMesh.geometry.vertices.indexOf(pnt);
            self._arrows.put(index, mesh);

            var minBox = pnt.clone().sub(new THREE.Vector3(size / 2, size / 2, size / 2));
            var maxBox = pnt.clone().add(new THREE.Vector3(size / 2, size / 2, size / 2));
            excludeBox = new THREE.Box3(minBox, maxBox);
        }

        // add attributes
        this.userData = new ObjectData(EntityType.FixedSymb, true);
    }

    public Update()
    {
        var self = this;

        self._arrows.each(function (vertIdx: number, mesh: THREE.Mesh)
        {
            var vert = self._baseMesh.geometry.vertices[vertIdx];
            vert = vert.clone().applyMatrix4(self._baseMesh.matrixWorld);
            mesh.position.set(vert.x, vert.y, vert.z);
        });
    }

    private GetPointsFromIndexes(baseMesh: THREE.Mesh, pointsIdxs: Array<number>): Array<THREE.Vector3>
    {
        var outPoints = new Array<THREE.Vector3>();

        var vertices = baseMesh.geometry.vertices;
        pointsIdxs.forEach(function (pntIdx: number)
        {
            var pnt = vertices[pntIdx];
            outPoints.push(pnt);
        });

        return outPoints;
    }

    private SortPoints(points: Array<THREE.Vector3>)
    {
        // Sort point by XY
        //
        points.sort(function (a, b)
        {
            if (a.y > b.y)
            {
                return 1;
            }
            else if (a.y < b.y)
            {
                return -1;
            }

            if (a.x > b.x)
            {
                return 1;
            }
            else if (a.x < b.x)
            {
                return -1;
            }

            if (a.z > b.z)
            {
                return 1;
            }
            else if (a.z < b.z)
            {
                return -1;
            }

            return 0;
        });
    }
}