var container, stats;
var camera, scene1, renderer, objects, controls, axis, object, grids, mesh, clock;
var clock = new THREE.Clock();
var SCALE = .02;
var objects = [];
var mouseX = 0;                                               // Mouse X pos relative to window centre
var mouseY = 0;
var windowCentreX = window.innerWidth / 2;                    // Window centre (X pos)
var windowCentreY = window.innerHeight / 2;

con();
var initPromise = new Promise(function (resolve, reject) {
    fontpromise.then(function () {
        init();
        resolve();
    });
});
window.addEventListener('loadModel', function (e) {

    initPromise.then(function () {
        loadModel(e.detail);
    });
});

function con() {
    scene1 = new THREE.Scene();
    container = document.getElementById('canvas');
    renderer = new THREE.WebGLRenderer();
    camera = new THREE.PerspectiveCamera(50, $(window).width() / $(window).height(), 1, 2000);
    camera.position.set(2, 4, 5);
}
// init scene



var onProgress = function (xhr) {
    if (xhr.lengthComputable) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
};
var onError = function (xhr) {
};

/*document.getElementById('layoutPanel').addEventListener('SlideComplete', function () {
    render();
});*/

function init() {
    if (!$(container).is(':visible')) {
        setTimeout(init, 500);
        return;
    }

    onWindowResize();

    container.scene = scene1;
    scene1.fog = new THREE.FogExp2(0x000000, 0.12);
    // Lights
    scene1.add(new THREE.AmbientLight(0xcccccc));
    var directionalLight = new THREE.DirectionalLight(0xeeeeee);
    directionalLight.position.x = Math.random() - 0.5;
    directionalLight.position.y = Math.random();
    directionalLight.position.z = Math.random() - 0.5;
    directionalLight.position.normalize();
    scene1.add(directionalLight);

    clock = new THREE.Clock();

    //Axis

    axes = buildAxes(6);
    scene1.add(axes);

    grids = new THREE.Object3D();
    gridX = new THREE.GridHelper(20, 50);
    gridY = new THREE.GridHelper(20, 50);
    gridZ = new THREE.GridHelper(20, 50);
    gridY.rotateX(Math.PI / 2);
    gridZ.rotateZ(Math.PI / 2);
    grids.add(gridX);
    //grids.add(gridY);
    //grids.add(gridZ);
    scene1.add(grids);



    // Renderer

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize($(window).width(), $(window).height());
    container.appendChild(renderer.domElement);
    // Stats
    //stats = new Stats();
    //container.appendChild(stats.dom);
    // Controls
    controls = new THREE.TrackballControls(camera, renderer.domElement);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;

    var dragControls = new THREE.DragControls(objects, camera, renderer.domElement);
    dragControls.addEventListener('dragstart', function (event) { controls.enabled = false; });
    dragControls.addEventListener('dragend', function (event) { controls.enabled = true; });

    //window.addEventListener('resize', onWindowResize, false);
    
    render();
    animate();
}


//
function onWindowResize(event) {
    renderer.setSize($(window).width(), $(window).height());
    camera.aspect = $(window).width() / $(window).height();
    camera.updateProjectionMatrix();
}
//
var t = 0;
function animate() {
    if (object != undefined) {
        object.rotation.y = mouseX * 0.005;
        object.rotation.x = mouseY * 0.005;
    }

    requestAnimationFrame(animate);
    render();
    controls.update();
}

//
function render() {
    for (var i in labels) {
        labels[i].lookAt(camera.position);
    }
    controls.update();
    renderer.render(scene1, camera);
}


var geometry = new THREE.BoxGeometry( 40, 40, 40 );

function loadModel(jsoncontent) {
debugger;
    var loader = new THREE.AssimpJSONLoader();
    //if (object != null) { scene1.remove(object) }
    if (mesh != null) { scene1.remove(mesh) }
   // var object = new loader.parse(jsoncontent);

    object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));
    object.scale.multiplyScalar(SCALE);

        object.position.x = 0;
        object.position.y = 0;
        object.position.z = 0;
  
    object.castShadow = true;
    object.receiveShadow = true;

    scene1.add(object);

    objects.push(object);

    
    debugger;


    //var animate = function () {
    //    requestAnimationFrame(animate);

    //    object.rotation.x += 0.1;
    //    object.rotation.y += 0.1;

    //    renderer.render(scene1, camera);
    //};
    animate();
}

function loadSTL(stlpath) {
    var loader = new THREE.STLLoader();
    loader.load('./STLFile/File.stl', function (geometry) {
        if (mesh != null) { scene1.remove(mesh) }
        if (object != null) { scene1.remove(object) }
        var material = new THREE.MeshNormalMaterial();
        mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(0.1, 0.1, 0.1);
        scene1.add(mesh);
        objects.push(mesh);
        //render();
        animate();
    });
}

function loadDAE() {

    var loader = new THREE.ColladaLoader();
    loader.load("./DAEFile/File.dae", function loadCollada(collada) {
        var model = collada.scene;
        model.scale = 0.1;
        model.updateMatrix();
        scene1.add(model);
        objects.push(model);
        //render();
        animate();
    });


    //// instantiate a loader
    //var loader = new THREE.ColladaLoader();

    //loader.load(
    //    // resource URL
    //    './DAEFile/File.dae',
    //    // Function when resource is loaded
    //    function (collada) {
    //        scene.add(collada.scene);
    //    },
    //    // Function called when download progresses
    //    function (xhr) {
    //        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    //    }
    //);
}

var uploader = new ss.SimpleUpload(
    {
        button: $('#uploadModel'), // file upload button
        url: '/Home/UploadFile', // server side handler
        name: 'uploadfile', // upload parameter name        
        responseType: 'json',
        allowedExtensions: ["json", "stl", "DAE"],
        hoverClass: 'ui-state-hover',
        focusClass: 'ui-state-focus',
        disabledClass: 'ui-state-disabled',
        dropzone: $('body'),
        onComplete: function (filename, response, btn) {
            if (!response) {
                alert(filename + 'upload failed');
                return false;
            }

            if (filename.toUpperCase().indexOf("STL") >= 0) {
                loadSTL(response);
                btn.innerText = filename;
            }
            else if (filename.toUpperCase().indexOf("JSON") >= 0) {
                loadModel(JSON.parse(response.model));
                btn.innerText = filename;
            }
            else if (filename.toUpperCase().indexOf("DAE") >= 0) {

                loadDAE();
                btn.innerText = filename;
            }
            // do something with response...
        }
    }

);