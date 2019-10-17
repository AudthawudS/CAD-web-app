/// <reference path="../_reference.d.ts" />

function GeomTranslateVec(geom: THREE.Geometry, vec: THREE.Vector3): void
{
    var mat = new THREE.Matrix4();
    mat.makeTranslation(vec.x, vec.y, vec.z);
    geom.applyMatrix(mat);
}

function GeomTranslate(geom: THREE.Geometry, x: number, y: number, z: number): void
{
    var mat = new THREE.Matrix4();
    mat.makeTranslation(x, y, z);
    geom.applyMatrix(mat);
}

function GeomTranslateBuf(geom: THREE.BufferGeometry, x: number, y: number, z: number): void
{
    var mat = new THREE.Matrix4();
    mat.makeTranslation(x, y, z);
    geom.applyMatrix(mat);
}


function GeomRotate(geom: THREE.Geometry, x: number, y: number, z: number): void
{
    var mat = new THREE.Matrix4();
    x = x / 180.0 * Math.PI;
    y = y / 180.0 * Math.PI;
    z = z / 180.0 * Math.PI;
    mat.makeRotationFromEuler(new THREE.Euler(x, y, z));
    geom.applyMatrix(mat);
}

function GeomRotateVec(geom: THREE.Geometry, vec: THREE.Vector3): void
{
    GeomRotate(geom, vec.x, vec.y, vec.z);
}

function GeomGetCenter(verts: Array<THREE.Vector3>): THREE.Vector3
{
    if (!verts || verts.length == 0)
    {
        return;
    }

    if (verts.length == 1)
    {
        return verts[0].clone();
    }
    var box = new THREE.Box3(verts[0].clone(), verts[0].clone());
    verts.forEach(v =>
    {
        box.expandByPoint(v);
    });

    return box.center();
}
