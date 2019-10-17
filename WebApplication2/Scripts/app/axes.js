var font;
var SCALE = 0.02, COORD_SPACE = 20.0;
var labels = [];
var fontpromise = new Promise(function (resolve) {
    var loader = new THREE.FontLoader();
    loader.load('/Content/helvetiker_regular.typeface.json', function (loadedfont) {
        font = loadedfont;
        resolve();
    });
});
function buildAxis(dir, length, hex) {
    var axis = new THREE.CylinderGeometry(0.05, 0.05, length);
    var point = new THREE.CylinderGeometry(0, 0.1, 0.1 * length);
    var mat = new THREE.MeshBasicMaterial({ color: hex })
    var msh = new THREE.Mesh(axis, mat);
    var mshpoint = new THREE.Mesh(point, mat);
    var coords = [];
    for (var i = COORD_SPACE; i < length / SCALE; i += COORD_SPACE) {
        var coord = new THREE.TextGeometry(i+'', { size: 0.1, height: 0.02, curveSegments: 6, font: font });
        var textMesh = new THREE.Mesh(coord, new THREE.MeshBasicMaterial({ color: hex }));
        labels.push(textMesh);
        coords.push(textMesh);
    }
    var translation = function (i) {
        return (parseInt(i) + 1) * COORD_SPACE * SCALE;
    }
    switch (dir) {        
        case 'y':
            msh.rotateX(Math.PI / 2);
            mshpoint.rotateX(Math.PI / 2);
            for (var i in coords) {
                coords[i].translateZ(translation(i));
                coords[i].translateX(-0.4);
            }
            break;
        case 'z':
            for (var i in coords) {
                coords[i].translateY(translation(i));
                coords[i].translateX(-0.4);
            }
            break;
        case 'x':
            msh.rotateZ(-Math.PI / 2);
            mshpoint.rotateZ(-Math.PI / 2);
            for (var i in coords) {
                coords[i].translateX(translation(i));
                coords[i].translateZ(-0.4);
            }
            break;
        default:
            break;
    }
    msh.translateY(length / 2);
    mshpoint.translateY(length * 1.05);
    var axis = new THREE.Object3D();
    axis.add(msh);
    axis.add(mshpoint);
    for(var i in coords)axis.add(coords[i]);
    return axis;

}

function buildAxes(length) {
    size = length || 1;

    
    var geometry = new THREE.Object3D();
    geometry.add(buildAxis('x', size, 0xff0000));
    geometry.add(buildAxis('y', size, 0x00ff00));
    geometry.add(buildAxis('z', size, 0x0000ff));
        //geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));


    return geometry;
    
    //return new THREE.AxisHelper(length);

}