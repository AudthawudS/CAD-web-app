/// <reference path="../_reference.d.ts" />
/// <reference path="../Tools/ITool.ts" />
/// <reference path="../Selection/Selector.ts" />
/// <reference path="../Entities/EntitySelector.ts" />
/// <reference path="./Navigation.ts" />
/// <reference path="../Editor/Editor.ts" />
/// <reference path="../Force/ForceManager.ts" />
var Layout = /** @class */ (function () {
    function Layout() {
        debugger;
        this.ToolChanged = new CEvent();
        if (!Detector.webgl)
            Detector.addGetWebGLMessage();
        var self = this;
        alert('test');
        var obj = new THREE.Object3D();
        obj.userData =  { URL: "https://www.google.com" };
       


        self._tool = null;
        self.Selector = new Selector();
        self._container = document.getElementById('layout');
        self.Scene = new THREE.Scene();
        self.Scene.add(obj);
        self.Camera = self.CreatePerspectiveCamera(window.innerWidth, window.innerHeight);
        //self.Scene.add(self.Camera);
        // Create orbit control
        //
        self.Controls = new THREE.OrbitControls(self.Camera, self._container);
        self.Controls.mouseButtons = { ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.LEFT };
        self.Controls.rotateSpeed = 2.0;
        self.Controls.zoomSpeed = 2;
        self.Controls.panSpeed = 0.8;
        self.Controls.noZoom = false;
        self.Controls.noPan = false;
        // Create trackball control
        self.ControlsTrackball = new THREE.TrackballControls(self.Camera, self._container);
        self.ControlsTrackball.rotateSpeed = 2.0;
        self.ControlsTrackball.zoomSpeed = 2;
        self.ControlsTrackball.panSpeed = 0.8;
        self.ControlsTrackball.noZoom = true;
        self.ControlsTrackball.noPan = true;
        self.ControlsTrackball.noRotate = true;
        self.ControlsTrackball.noRoll = true;
        self.ControlsTrackball.enabled = false;
        // Create transform control
        //
        self.TransformControl = new THREE.TransformControls(self.Camera, self._container);
        // Renderer
        //
        self.Renderer = new THREE.WebGLRenderer({ antialias: false });
        self.Renderer.setClearColor(new THREE.Color(0xffffff));
        self.Renderer.setPixelRatio(window.devicePixelRatio);
        self.Renderer.setSize(window.innerWidth, window.innerHeight);
        self._container.appendChild(self.Renderer.domElement);
        // Create navigation
        self.Navigation = new Navigation(self, self._container);
        // Create editor
        //self.Editor = new Editor(self, self._container);
        window.addEventListener('resize', function () {
            self.OnResize();
        }, false);
        $(self._container).resize(function () {
            self.OnResize();
        });
        $(self._container).change(function () {
            self.OnResize();
        });
        self.OnResize();
        // Start animation
        //self.Animate();
        //self.AttachToEvents();
    }
    Layout.prototype.GetContainer = function () {
        return $(this._container);
    };
    Layout.prototype.AttachToEvents = function () {
        var self = this;
        $(self._container).mousedown(function (evt) {
            self.MouseDown(evt);
        });
        $(self._container).mouseup(function (evt) {
            self.MouseUp(evt);
        });
        $(self._container).mousemove(function (evt) {
            self.MouseMove(evt);
        });
        $(window).keydown(function (evt) {
            self.KeyDown(evt);
        });
    };
    Layout.prototype.SwitchCameraToPerspective = function () {
        var self = this;
        var width = self.GetSize().x;
        var height = self.GetSize().y;
        var oldCamera = self.Camera;
        var oldZoom = 1;
        if (oldCamera instanceof THREE.OrthographicCamera) {
            oldZoom = oldCamera.zoom;
        }
        var oldTarget = this.Controls.target;
        //self.Scene.remove(oldCamera);
        self.Camera = self.CreatePerspectiveCamera(width, height);
        var destPos = oldCamera.position;
        self.Camera.position.set(destPos.x, destPos.y, destPos.z);
        self.Camera.lookAt(oldTarget);
        self.RemoveCamera(); // remove old camera
        //self.Scene.add(self.Camera);
        self.AddLight();
        self.Controls.object = self.Camera;
        self.TransformControl.SetCamera(self.Camera);
        self.OnResize();
        self.ZoomToFit(true);
    };
    Layout.prototype.SwitchCameraToOrtho = function () {
        var self = this;
        var width = self.GetSize().x;
        var height = self.GetSize().y;
        var oldTarget = this.Controls.target;
        var oldCamera = self.Camera;
        self.Scene.remove(oldCamera);
        self.Camera = self.CreateOrthoCamera(width, height);
        self.Camera.position.set(oldCamera.position.x, oldCamera.position.y, oldCamera.position.z);
        self.Camera.lookAt(oldTarget);
        self.RemoveCamera(); // remove old camera
        //self.Scene.add(self.Camera);
        self.AddLight();
        // Change camera into controls
        self.Controls.object = self.Camera;
        self.TransformControl.SetCamera(self.Camera);
        self.OnResize();
        self.ZoomToFit(true);
    };
    Layout.prototype.RemoveCamera = function () {
        var self = this;
        self.Scene.children.forEach(function (ent) {
            if (ent instanceof THREE.PerspectiveCamera ||
                ent instanceof THREE.OrthographicCamera) {
                self.Scene.remove(ent);
            }
        });
    };
    Layout.prototype.CreatePerspectiveCamera = function (widthPx, heightPx) {
        var camera = new THREE.PerspectiveCamera(40, widthPx / heightPx, 0.01, 1e10);
        camera.up = new THREE.Vector3(0, 0, 1);
        return camera;
    };
    Layout.prototype.CreateOrthoCamera = function (widthWorld, heightWorld) {
        // width and height are the width and height of the camera's cuboid-shaped frustum measured in world-space units.
        // near and far are the world-space distances to the near and far planes of the frustum. 
        var camera = new THREE.OrthographicCamera(widthWorld / -2, widthWorld / 2, heightWorld / 2, heightWorld / -2, -2000, 2000);
        camera.up = new THREE.Vector3(0, 0, 1);
        return camera;
    };
    Layout.prototype.IsOrthographic = function () {
        return (App.Layout.Camera instanceof THREE.OrthographicCamera);
    };
    Layout.prototype.Animate = function () {
        var layout = this;
        requestAnimationFrame(function () {
            layout.Animate();
        });
        ForceManager.Update();
        layout.Controls.update();
        layout.ControlsTrackball.update();
        layout.TransformControl.update();
        layout.Navigation.Update();
        layout.Renderer.autoClear = false; // important!
        layout.Renderer.clear();
        layout.Renderer.render(layout.Scene, layout.Camera);
        layout.Navigation.Render();
    };
    Layout.prototype.OnResize = function () {
        var layout = this;
        var width = window.innerWidth * (8 / 12) - 10;
        var height = window.innerHeight - 225;
        if (layout.Camera instanceof THREE.PerspectiveCamera) {
            var cameraPersp = layout.Camera;
            cameraPersp.aspect = width / height;
            cameraPersp.updateProjectionMatrix();
        }
        else if (layout.Camera instanceof THREE.OrthographicCamera) {
            var cameraOrth = layout.Camera;
            cameraOrth.left = -width / 2;
            cameraOrth.right = width / 2;
            cameraOrth.top = height / 2;
            cameraOrth.bottom = -height / 2;
            cameraOrth.updateProjectionMatrix();
        }
        else {
            console.error("Unsuported camera type");
        }
        layout.Renderer.setSize(width, height);
    };
    Layout.prototype.AddLight = function () {
        // Remove lights from camera
        this.RemoveLight();
        var layout = this;
        var lightAmb = new THREE.AmbientLight(0x888888);
        layout.Camera.add(lightAmb);
        var light = new THREE.PointLight(0xffffff, 1, 100000);
        layout.Camera.add(light);
    };
    Layout.prototype.RemoveEnts = function () {
        var layout = this;
        var scene = this.Scene;
        // Remove from scene
        {
            var removeEnts = [];
            for (var i = 0; i < scene.children.length; i++) {
                var ent = scene.children[i];
                if (ent instanceof THREE.PerspectiveCamera ||
                    ent instanceof THREE.TransformControls ||
                    ent instanceof THREE.OrbitControls) {
                    continue;
                }
                var objData = GetObjectData(ent);
                if (objData != null) {
                    if (objData.EntityType == EntityType.Grid ||
                        objData.EntityType == EntityType.NavigationCube ||
                        objData.EntityType == EntityType.NavigationArrows) {
                        continue;
                    }
                }
                removeEnts.push(ent);
            }
            for (var i = 0; i < removeEnts.length; i++) {
                scene.remove(removeEnts[i]);
            }
        }
        // Remove lights from camera
        this.RemoveLight();
    };
    Layout.prototype.RemoveLight = function () {
        var layout = this;
        var removeEnts = [];
        //layout.Camera.children.length = 0; // clear
        for (var i = 0; i < layout.Camera.children.length; i++) {
            var ent = layout.Camera.children[i];
            removeEnts.push(ent);
        }
        for (var i = 0; i < removeEnts.length; i++) {
            layout.Camera.remove(removeEnts[i]);
        }
    };
    Layout.prototype.CreateGrid = function () {
        var sizeV = this.GetExtent().size();
        var maxSizeV = Math.max(sizeV.x, sizeV.y, sizeV.z);
        var size = maxSizeV * 4;
        var scene = this.Scene;
        // Remove previous grid
        this.RemoveGrid();
        // Grid
        //
        var step = size / 10;
        var geometry = new THREE.Geometry();
        for (var i = -size; i <= size; i += step) {
            geometry.vertices.push(new THREE.Vector3(-size, i, 0));
            geometry.vertices.push(new THREE.Vector3(size, i, 0));
            geometry.vertices.push(new THREE.Vector3(i, -size, 0));
            geometry.vertices.push(new THREE.Vector3(i, size, 0));
        }
        var material = new THREE.LineBasicMaterial({ color: 0xAAAAAA, opacity: 0.2 });
        var line = new THREE.Line(geometry, material, THREE.LinePieces);
        //scene.add(line);
        line.userData = new ObjectData(EntityType.Grid, true);
    };
    Layout.prototype.RemoveGrid = function () {
        var scene = this.Scene;
        // Remove prev grid
        var oldGrids = this.GetEntitiesByType(EntityType.Grid);
        _.each(oldGrids, function (g) { scene.remove(g); });
    };
    Layout.prototype.GetMeshesByType = function (entType) {
        var scene = this.Scene;
        var outMeshes = new Array();
        for (var i = 0; i < scene.children.length; i++) {
            var ent = scene.children[i];
            if (!(ent instanceof THREE.Mesh)) {
                continue;
            }
            var objData = GetObjectData(ent);
            if (objData == null) {
                continue;
            }
            if (objData.EntityType == entType) {
                outMeshes.push(ent);
            }
        }
        return outMeshes;
    };
    Layout.prototype.ZoomToFit = function (keepCameraLook) {
        var layout = this;
        var scene = this.Scene;
        var extent = this.GetExtent();
        this.ZoomToBox(extent, keepCameraLook);
    };
    Layout.prototype.ZoomToObject = function (obj, keepCameraLook) {
        // Box3.setFromObject(object) computes the world - axis - aligned bounding box of an object(including its children),
        // accounting for both the object's, and childrens', world transforms.
        var box = new THREE.Box3().setFromObject(obj);
        this.ZoomToBox(box, keepCameraLook);
    };
    Layout.prototype.ZoomToBox = function (extent, keepCameraLook) {
        var self = this;
        var layout = this;
        var scene = this.Scene;
        var camera = this.Camera;
        var oldPos = camera.position;
        var oldTarget = this.Controls.target;
        var minScene = extent.min;
        var maxScene = extent.max;
        var sphereSize = maxScene.clone().sub(minScene).length() * 0.5;
        var center = maxScene.clone().add(minScene).divideScalar(2);
        var vector = new THREE.Vector3(1, 0, 0);
        if (keepCameraLook) {
            var oldVec = oldPos.clone().sub(oldTarget);
            oldVec.normalize();
            vector = oldVec;
        }
        if (layout.Camera instanceof THREE.PerspectiveCamera) {
            var cameraPersp = layout.Camera;
            var fovRad = cameraPersp.fov * (Math.PI / 180.0);
            var d = sphereSize / Math.tan(fovRad / 2);
            vector = vector.multiplyScalar(d);
            var newCamPos = center.clone().add(vector);
            cameraPersp.position.set(newCamPos.x, newCamPos.y, newCamPos.z);
            cameraPersp.lookAt(center);
            cameraPersp.updateProjectionMatrix();
        }
        else if (layout.Camera instanceof THREE.OrthographicCamera) {
            var cameraOrth = layout.Camera;
            var newCamPos = center.clone().add(vector);
            cameraOrth.position.set(newCamPos.x, newCamPos.y, newCamPos.z);
            var heightHalfBox = (cameraOrth.top - cameraOrth.bottom) / 2;
            cameraOrth.zoom = heightHalfBox / sphereSize;
            //var extentAll = self.GetExtent();
            //var screenAspect = self.GetSize().x / self.GetSize().y;
            //var orthoHeight = sphereSize;
            //var orthoWidth = sphereSize * screenAspect;
            //cameraOrth.left = - orthoWidth / 2;
            //cameraOrth.right = orthoWidth / 2;
            //cameraOrth.top = orthoHeight / 2;
            //cameraOrth.bottom = - orthoHeight / 2;
            //cameraOrth.zoom = 0.5;
            cameraOrth.lookAt(center);
            cameraOrth.updateProjectionMatrix();
        }
        this.Controls.target.set(center.x, center.y, center.z);
        this.Controls.update();
    };
    Layout.prototype.GetExtent = function () {
        var layout = this;
        var scene = this.Scene;
        var minScene = null;
        var maxScene = null;
        for (var i = 0; i < scene.children.length; i++) {
            var obj3d = scene.children[i];
            var ent = obj3d;
            if (ent.geometry == undefined) {
                continue;
            }
            if (!(ent instanceof THREE.Mesh)) {
                continue;
            }
            var mesh = ent;
            if (IsObjectData(obj3d.userData)) {
                var objData = obj3d.userData;
                if (objData.IsSystem) {
                    continue;
                }
                if (objData.EntityType == EntityType.BCTool) {
                    continue;
                }
            }
            else {
                continue;
            }
            // Box3.setFromObject(object) computes the world - axis - aligned bounding box of an object(including its children),
            // accounting for both the object's, and childrens', world transforms.
            var box = new THREE.Box3().setFromObject(mesh);
            var min = box.min;
            var max = box.max;
            if (minScene == null) {
                minScene = min;
            }
            else {
                minScene.x = Math.min(min.x, minScene.x);
                minScene.y = Math.min(min.y, minScene.y);
                minScene.z = Math.min(min.z, minScene.z);
            }
            if (maxScene == null) {
                maxScene = max;
            }
            else {
                maxScene.x = Math.max(max.x, maxScene.x);
                maxScene.y = Math.max(max.y, maxScene.y);
                maxScene.z = Math.max(max.z, maxScene.z);
            }
        }
        if (minScene == null || maxScene == null) {
            return new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1));
        }
        var outBox = new THREE.Box3(minScene, maxScene);
        return outBox;
    };
    Layout.prototype.GetSize = function () {
        var size = new THREE.Vector2();
        size.x = this.Renderer.context.canvas.width;
        size.y = this.Renderer.context.canvas.height;
        return size;
    };
    Layout.prototype.GetPixelSize = function () {
        var self = this;
        var width = this.Renderer.context.canvas.width;
        var p1 = self.ScreenToWorld(new THREE.Vector2(0, 0));
        var p2 = self.ScreenToWorld(new THREE.Vector2(width, 0));
        var worldWidth = p1.distanceTo(p2);
        return worldWidth / width;
    };
    Layout.prototype.ScreenToDevice = function (screenPnt) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        var camera = this.Camera;
        // Clone to prevent changes
        screenPnt = screenPnt.clone();
        var offset = this.GetScreenOffset();
        screenPnt.x -= offset.x;
        screenPnt.y -= offset.y;
        var width = this.Renderer.context.canvas.width;
        var height = this.Renderer.context.canvas.height;
        screenPnt.x = (screenPnt.x / width) * 2 - 1;
        screenPnt.y = -(screenPnt.y / height) * 2 + 1;
        return screenPnt;
    };
    Layout.prototype.ScreenToWorld = function (screenPnt) {
        var camera = this.Camera;
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        var devicePnt = this.ScreenToDevice(screenPnt);
        var worldPnt = new THREE.Vector3(devicePnt.x, devicePnt.y, 0);
        if (camera instanceof THREE.OrthographicCamera) {
            worldPnt.z = -1;
        }
        worldPnt.unproject(camera);
        return worldPnt;
    };
    Layout.prototype.WorldToScreen = function (sourceVec) {
        var camera = this.Camera;
        var widthHalf = 0.5 * this.Renderer.context.canvas.width;
        var heightHalf = 0.5 * this.Renderer.context.canvas.height;
        var vec = sourceVec.clone();
        vec.project(camera);
        vec.x = (vec.x * widthHalf) + widthHalf;
        vec.y = -(vec.y * heightHalf) + heightHalf;
        var width = this.Renderer.context.canvas.width;
        var height = this.Renderer.context.canvas.height;
        var offset = this.GetScreenOffset();
        var outVec = new THREE.Vector2(vec.x + offset.x, vec.y + offset.y);
        return outVec;
    };
    Layout.prototype.GetScreenOffset = function () {
        var element = this.Renderer.context.canvas;
        var self = this;
        var screenOffset = new THREE.Vector2(0, 0);
        if (element.offsetParent) {
            do {
                screenOffset.x += element.offsetLeft;
                screenOffset.y += element.offsetTop;
            } while (element = element.offsetParent);
        }
        return screenOffset;
    };
    Layout.prototype.SetDefaultTool = function () {
        this.SetTool(new ToolPan());
    };
    Layout.prototype.SetTool = function (tool) {
        //this.Editor.Cancel();
        if (this._tool != null) {
            this._tool.End();
        }
        this._tool = tool;
        this._tool.Start();
        this.ToolChanged.fire(tool);
    };
    Layout.prototype.MouseDown = function (evt) {
        var self = this;
        if (self._tool != null) {
            self._tool.MouseDown(evt);
        }
    };
    Layout.prototype.MouseUp = function (evt) {
        var self = this;
        if (self._tool != null) {
            self._tool.MouseUp(evt);
        }
    };
    Layout.prototype.KeyDown = function (evt) {
        var self = this;
        if (self._tool != null) {
            self._tool.KeyDown(evt);
        }
    };
    Layout.prototype.MouseMove = function (evt) {
        var self = this;
        if (self._tool != null) {
            self._tool.MouseMove(evt);
        }
    };
    // Set cursors:
    Layout.prototype.SetCursor = function (cursor) {
        if (cursor == "pick") {
            this._container.style.cursor = "url(/Images/cursor-pick.cur), none";
        }
        else if (cursor == "rotate") {
            this._container.style.cursor = "url(/Images/cursor-rotate.cur), none";
        }
        else {
            this._container.style.cursor = cursor;
        }
    };
    Layout.prototype.GetCursor = function () {
        return this._container.style.cursor;
    };
    Layout.prototype.GetEntities = function (skipSystems) {
        return EntitySelector.GetEntities(skipSystems);
    };
    Layout.prototype.GetEntitiesByType = function (entType) {
        return EntitySelector.GetEntitiesByType(entType);
    };
    Layout.prototype.GetMeshes = function (skipSystems) {
        var ents = EntitySelector.GetEntities(skipSystems);
        var outMeshes = new Array();
        for (var idx in ents) {
            var ent = ents[idx];
            if (!(ent instanceof THREE.Mesh)) {
                continue;
            }
            outMeshes.push(ent);
        }
        return outMeshes;
    };
    Layout.prototype.GetEntityById = function (id) {
        return EntitySelector.GetEntityById(id);
    };
    Layout.prototype.GetMeshById = function (id) {
        var ent = EntitySelector.GetEntityById(id);
        if (ent == null) {
            return null;
        }
        if (!(ent instanceof THREE.Mesh)) {
            return null;
        }
        return ent;
    };
    return Layout;
}());
