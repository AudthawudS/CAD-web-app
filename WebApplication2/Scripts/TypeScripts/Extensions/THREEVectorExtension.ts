/// <reference path="../_reference.d.ts" />

function Vec2To3(vec: THREE.Vector2)
{
    return new THREE.Vector3(vec.x, vec.y, 0);
}

function GetVec3(arr: Float32Array, idx: number)
{
    var x = arr[idx];
    var y = arr[idx + 1];
    var z = arr[idx + 2];
    var vec3 = new THREE.Vector3(x, y, z);
    return vec3;
}

/// <summary>
/// Get the rotations that would make a (0,0,1) Degrees. direction vector point 
/// in the same direction as this direction vector.
/// Vertex toTarget(target - seeker);
/// Vertex requiredRotation = toTarget.GetHorizontalAngle();
/// seeker->SetRotation(requiredRotation);
/// </summary>
function GetHorizontalAngle(vec: THREE.Vector3): THREE.Vector3
{
    var angle = new THREE.Vector3();

    var tmp = (Math.atan2(vec.x, vec.z) * (180.0 / Math.PI));
    angle.y = tmp;

    if (angle.y < 0)
        angle.y += 360;
    if (angle.y >= 360)
        angle.y -= 360;

    var z1 = Math.sqrt(vec.x * vec.x + vec.z * vec.z);

    angle.x = (Math.atan2(z1, vec.y) * (180.0 / Math.PI) - 90.0);

    if (angle.x < 0)
    {
        angle.x += 360;
    }
    if (angle.x >= 360)
    {
        angle.x -= 360;
    }

    // Convert to radians
    //
    angle.x = (angle.x / 180 * Math.PI);
    angle.y = (angle.y / 180 * Math.PI);
    angle.z = (angle.z / 180 * Math.PI);

    return angle;
}


function GetNormal(vA: THREE.Vector3, vB: THREE.Vector3, vC: THREE.Vector3) : THREE.Vector3
{
    var cb = new THREE.Vector3();
    var ab = new THREE.Vector3();

    cb.subVectors(vC, vB);
    ab.subVectors(vA, vB);
    cb.cross(ab);

    cb.normalize();

    return cb;
}

function RoundVector(vec: THREE.Vector3, round: number): THREE.Vector3
{
    if (round == 0)
    {
        return vec.round();
    }
    var count = Math.pow(10, round - 1);
    vec.x = Math.round(vec.x * count) / count;
    vec.y = Math.round(vec.y * count) / count;
    vec.z = Math.round(vec.z * count) / count;
}