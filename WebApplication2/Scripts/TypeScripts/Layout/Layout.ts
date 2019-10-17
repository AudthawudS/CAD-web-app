/// <reference path="../_reference.d.ts" />
/// <reference path="../Tools/ITool.ts" />
/// <reference path="../Selection/Selector.ts" />
/// <reference path="../Entities/EntitySelector.ts" />
/// <reference path="./Navigation.ts" />
/// <reference path="../Editor/Editor.ts" />
/// <reference path="../Force/ForceManager.ts" />

class Layout
{
    public Camera: THREE.Camera;

    public Controls: THREE.OrbitControls;

    public ControlsTrackball: THREE.TrackballControls;

    public TransformControl: THREE.TransformControls;

    public Scene: THREE.Scene;

    public Renderer: THREE.WebGLRenderer;

    public Selector: Selector;

    public ToolChanged = new CEvent<ITool>();

    public Navigation: Navigation;

    public Editor: Editor;

    private _container: HTMLElement;

    private _tool: ITool;

    constructor()
    {
        if (!Detector.webgl) Detector.addGetWebGLMessage();

        var self = this;

        self._tool = null;

        self.Selector = new Selector();

        self._container = document.getElementById('layout');
        self.Scene = new THREE.Scene();

        self.Camera = self.CreatePerspectiveCamera(window.innerWidth, window.innerHeight);        
        self.Scene.add(self.Camera);

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
        self.Editor = new Editor(self, self._container);

        window.addEventListener('resize', function ()
        {
            self.OnResize();
        }, false);

        $(self._container).resize(function ()
        {
            self.OnResize();
        });
        $(self._container).change(function ()
        {
            self.OnResize();
        });

        self.OnResize();
        // Start animation
        self.Animate();

        self.AttachToEvents();
    }

    public GetContainer(): JQuery
    {
        return $(this._container);
    }

    private AttachToEvents()
    {
        var self = this;

        $(self._container).mousedown(function (evt: JQueryMouseEventObject)
        {
            self.MouseDown(evt);
        });

        $(self._container).mouseup(function (evt: JQueryMouseEventObject)
        {
            self.MouseUp(evt);
        });

        $(self._container).mousemove(function (evt: JQueryMouseEventObject)
        {
            self.MouseMove(evt);
        });

        $(window).keydown(function (evt: JQueryKeyEventObject)
        {
            self.KeyDown(evt);
        });
    }

    public SwitchCameraToPerspective()
    {
        var self = this;

        var width: number = self.GetSize().x;
        var height: number = self.GetSize().y;

        var oldCamera = self.Camera;

        var oldZoom = 1;
        if (oldCamera instanceof THREE.OrthographicCamera)
        {
            oldZoom = (<THREE.OrthographicCamera>oldCamera).zoom;
        }
        var oldTarget = this.Controls.target;
        self.Scene.remove(oldCamera);

        self.Camera = self.CreatePerspectiveCamera(width, height);
        var destPos = oldCamera.position;
        self.Camera.position.set(destPos.x, destPos.y, destPos.z);
        self.Camera.lookAt(oldTarget);

        self.RemoveCamera();// remove old camera
        self.Scene.add(self.Camera);
        self.AddLight();

        (<any>self.Controls).object = self.Camera;
        (<any>self.TransformControl).SetCamera(self.Camera);

        self.OnResize();
        self.ZoomToFit(true);
    }

    public SwitchCameraToOrtho()
    {
        var self = this;

        var width: number = self.GetSize().x;
        var height: number = self.GetSize().y;

        var oldTarget = this.Controls.target;
        var oldCamera = self.Camera;
        self.Scene.remove(oldCamera);

        self.Camera = self.CreateOrthoCamera(width, height);
        self.Camera.position.set(oldCamera.position.x, oldCamera.position.y, oldCamera.position.z);
        self.Camera.lookAt(oldTarget);

        self.RemoveCamera();// remove old camera
        self.Scene.add(self.Camera);
        self.AddLight();

        // Change camera into controls
        (<any>self.Controls).object = self.Camera;
        (<any>self.TransformControl).SetCamera(self.Camera);

        self.OnResize();
        self.ZoomToFit(true);
    }

    private RemoveCamera()
    {
        var self = this;

        self.Scene.children.forEach((ent) =>
        {
            if (ent instanceof THREE.PerspectiveCamera ||
                ent instanceof THREE.OrthographicCamera)
            {
                self.Scene.remove(ent);
            }
        });
    }

    private CreatePerspectiveCamera(widthPx: number, heightPx: number): THREE.PerspectiveCamera
    {
        var camera = new THREE.PerspectiveCamera(40, widthPx / heightPx, 0.01, 1e10);
        camera.up = new THREE.Vector3(0, 0, 1);
        return camera;
    }

    private CreateOrthoCamera(widthWorld: number, heightWorld: number) : THREE.OrthographicCamera
    {
        // width and height are the width and height of the camera's cuboid-shaped frustum measured in world-space units.
        // near and far are the world-space distances to the near and far planes of the frustum. 
        var camera = new THREE.OrthographicCamera(widthWorld / - 2, widthWorld / 2, heightWorld / 2, heightWorld / - 2, -2000, 2000);
        camera.up = new THREE.Vector3(0, 0, 1);
        return camera;
    }

    public IsOrthographic(): boolean
    {
        return (App.Layout.Camera instanceof THREE.OrthographicCamera);
    }

    private Animate()
    {
        var layout = this;

        requestAnimationFrame(function ()
        {
            layout.Animate()
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
    }

    public OnResize()
    {
        var layout = this;

        var width: number = window.innerWidth * (8 / 12) - 10;
        var height: number = window.innerHeight - 225;

        if (layout.Camera instanceof THREE.PerspectiveCamera)
        {
            var cameraPersp = <THREE.PerspectiveCamera>layout.Camera;
            cameraPersp.aspect = width / height;
            cameraPersp.updateProjectionMatrix();
        }
        else if (layout.Camera instanceof THREE.OrthographicCamera)
        {
            var cameraOrth = <THREE.OrthographicCamera>layout.Camera;
            cameraOrth.left = - width / 2;
            cameraOrth.right = width / 2;
            cameraOrth.top = height / 2;
            cameraOrth.bottom = - height / 2;
            cameraOrth.updateProjectionMatrix();
        }
        else
        {
            console.error("Unsuported camera type");
        }

        layout.Renderer.setSize(width, height);
    }

    public AddLight()
    {
        // Remove lights from camera
        this.RemoveLight();

        var layout = this;

        var lightAmb = new THREE.AmbientLight(0x888888);
        layout.Camera.add(lightAmb);

        var light = new THREE.PointLight(0xffffff, 1, 100000);
        layout.Camera.add(light);
    }

    public RemoveEnts()
    {
        var layout = this;
        var scene = this.Scene;

        // Remove from scene
        {
            var removeEnts = [];
            for (var i = 0; i < scene.children.length; i++)
            {
                var ent = scene.children[i];
                if (ent instanceof THREE.PerspectiveCamera ||
                    ent instanceof THREE.TransformControls ||
                    ent instanceof THREE.OrbitControls)
                {
                    continue;
                }

                var objData = GetObjectData(ent);
                if (objData != null)
                {
                    if (objData.EntityType == EntityType.Grid ||
                        objData.EntityType == EntityType.NavigationCube ||
                        objData.EntityType == EntityType.NavigationArrows)
                    {
                        continue;
                    }
                }

                removeEnts.push(ent);
            }

            for (var i = 0; i < removeEnts.length; i++)
            {
                scene.remove(removeEnts[i]);
            }
        }

        // Remove lights from camera
        this.RemoveLight();
    }

    private RemoveLight()
    {
        var layout = this;
        var removeEnts = [];
        //layout.Camera.children.length = 0; // clear
        for (var i = 0; i < layout.Camera.children.length; i++)
        {
            var ent = layout.Camera.children[i];
            removeEnts.push(ent);
        }
        for (var i = 0; i < removeEnts.length; i++)
        {
            layout.Camera.remove(removeEnts[i]);
        }
    }

    public CreateGrid()
    {
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

        for (var i = -size; i <= size; i += step)
        {

            geometry.vertices.push(new THREE.Vector3(-size, i, 0));
            geometry.vertices.push(new THREE.Vector3(size, i, 0));

            geometry.vertices.push(new THREE.Vector3(i, -size, 0));
            geometry.vertices.push(new THREE.Vector3(i, size, 0));
        }

        var material = new THREE.LineBasicMaterial({ color: 0xAAAAAA, opacity: 0.2 });
        var line = new THREE.Line(geometry, material, THREE.LinePieces);
        scene.add(line);
        line.userData = new ObjectData(EntityType.Grid, true);
    }

    public RemoveGrid()
    {
        var scene = this.Scene;

        // Remove prev grid
        var oldGrids = this.GetEntitiesByType(EntityType.Grid);
        _.each(oldGrids, (g) => { scene.remove(g) });
    }

    public GetMeshesByType(entType: EntityType): Array<THREE.Mesh>
    {
        var scene = this.Scene;
        var outMeshes = new Array<THREE.Mesh>();

        for (var i = 0; i < scene.children.length; i++)
        {
            var ent = scene.children[i];

            if (!(ent instanceof THREE.Mesh))
            {
                continue;
            }

            var objData = GetObjectData(ent);
            if (objData == null)
            {
                continue;
            }
            if (objData.EntityType == entType)
            {
                outMeshes.push(<THREE.Mesh>(<any>ent));
            }
        }
        return outMeshes;
    }

    public ZoomToFit(keepCameraLook: boolean)
    {
        var layout = this;
        var scene = this.Scene;

        var extent = this.GetExtent();
        this.ZoomToBox(extent, keepCameraLook);
    }

    public ZoomToObject(obj: THREE.Object3D, keepCameraLook: boolean)
    {
        // Box3.setFromObject(object) computes the world - axis - aligned bounding box of an object(including its children),
        // accounting for both the object's, and childrens', world transforms.
        var box = new THREE.Box3().setFromObject(obj);

        this.ZoomToBox(box, keepCameraLook);
    }

    public ZoomToBox(extent: THREE.Box3, keepCameraLook: boolean)
    {
        var self = this;
        var layout = this;
        var scene = this.Scene;
        var camera = this.Camera;

        var oldPos = camera.position;
        var oldTarget = this.Controls.target;

        var minScene: THREE.Vector3 = extent.min;
        var maxScene: THREE.Vector3 = extent.max;

        var sphereSize = maxScene.clone().sub(minScene).length() * 0.5;

        var center = maxScene.clone().add(minScene).divideScalar(2);
        var vector = new THREE.Vector3(1, 0, 0);

        if (keepCameraLook)
        {
            var oldVec = oldPos.clone().sub(oldTarget);
            oldVec.normalize();
            vector = oldVec;
        }

        if (layout.Camera instanceof THREE.PerspectiveCamera)
        {
            var cameraPersp = <THREE.PerspectiveCamera>layout.Camera;
            var fovRad = cameraPersp.fov * (Math.PI / 180.0);

            var d = sphereSize / Math.tan(fovRad / 2);
            vector = vector.multiplyScalar(d);

            var newCamPos = center.clone().add(vector);
            cameraPersp.position.set(newCamPos.x, newCamPos.y, newCamPos.z);
            cameraPersp.lookAt(center);
            cameraPersp.updateProjectionMatrix();
        }
        else if (layout.Camera instanceof THREE.OrthographicCamera)
        {
            var cameraOrth = <THREE.OrthographicCamera>layout.Camera;

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
    }

    public GetExtent(): THREE.Box3
    {
        var layout = this;
        var scene = this.Scene;

        var minScene: THREE.Vector3 = null;
        var maxScene: THREE.Vector3 = null;

        for (var i = 0; i < scene.children.length; i++)
        {
            var obj3d = scene.children[i];
            var ent = (<any>obj3d);
            if (ent.geometry == undefined)
            {
                continue;
            }
            if (!(ent instanceof THREE.Mesh))
            {
                continue;
            }
            var mesh = <THREE.Mesh>ent;

            if (IsObjectData(obj3d.userData))
            {
                var objData = (<ObjectData>obj3d.userData);
                if (objData.IsSystem)
                {
                    continue;
                }
                if (objData.EntityType == EntityType.BCTool)
                {
                    continue;
                }
            }
            else
            {
                continue;
            }

            // Box3.setFromObject(object) computes the world - axis - aligned bounding box of an object(including its children),
            // accounting for both the object's, and childrens', world transforms.
            var box = new THREE.Box3().setFromObject(mesh);

            var min: THREE.Vector3 = box.min;
            var max: THREE.Vector3 = box.max;

            if (minScene == null)
            {
                minScene = min;
            }
            else
            {
                minScene.x = Math.min(min.x, minScene.x);
                minScene.y = Math.min(min.y, minScene.y);
                minScene.z = Math.min(min.z, minScene.z);
            }
            if (maxScene == null)
            {
                maxScene = max;
            }
            else
            {
                maxScene.x = Math.max(max.x, maxScene.x);
                maxScene.y = Math.max(max.y, maxScene.y);
                maxScene.z = Math.max(max.z, maxScene.z);
            }
        }

        if (minScene == null || maxScene == null)
        {
            return new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1));
        }

        var outBox = new THREE.Box3(minScene, maxScene);
        return outBox;
    }

    public GetSize(): THREE.Vector2
    {
        var size = new THREE.Vector2();
        size.x = this.Renderer.context.canvas.width;
        size.y = this.Renderer.context.canvas.height;
        return size;
    }

    public GetPixelSize(): number
    {
        var self = this;

        var width = this.Renderer.context.canvas.width;

        var p1 = self.ScreenToWorld(new THREE.Vector2(0, 0));
        var p2 = self.ScreenToWorld(new THREE.Vector2(width, 0));

        var worldWidth = p1.distanceTo(p2);
        return worldWidth / width;
    }

    public ScreenToDevice(screenPnt: THREE.Vector2): THREE.Vector2
    {
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
    }

    public ScreenToWorld(screenPnt: THREE.Vector2): THREE.Vector3
    {
        var camera = this.Camera;

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        var devicePnt = this.ScreenToDevice(screenPnt);

        var worldPnt = new THREE.Vector3(devicePnt.x, devicePnt.y, 0);
        if (camera instanceof THREE.OrthographicCamera)
        {
            worldPnt.z = -1;
        }
        worldPnt.unproject(camera);

        return worldPnt;
    }

    public WorldToScreen(sourceVec: THREE.Vector3): THREE.Vector2
    {
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
    }

    public GetScreenOffset(): THREE.Vector2
    {
        var element = this.Renderer.context.canvas;
        var self = this;
        var screenOffset = new THREE.Vector2(0, 0);
        if (element.offsetParent)
        {
            do
            {
                screenOffset.x += element.offsetLeft;
                screenOffset.y += element.offsetTop;
            }
            while (element = element.offsetParent);
        }
        return screenOffset;
    }

    public SetDefaultTool()
    {
        this.SetTool(new ToolPan());
    }

    public SetTool(tool: ITool)
    {
        this.Editor.Cancel();

        if (this._tool != null)
        {
            this._tool.End();
        }

        this._tool = tool;
        this._tool.Start();

        this.ToolChanged.fire(tool);
    }

    MouseDown(evt: JQueryMouseEventObject)
    {
        var self = this;
        if (self._tool != null)
        {
            self._tool.MouseDown(evt);
        }
    }

    private MouseUp(evt: JQueryMouseEventObject)
    {
        var self = this;
        if (self._tool != null)
        {
            self._tool.MouseUp(evt);
        }
    }

    private KeyDown(evt: JQueryKeyEventObject)
    {
        var self = this;
        if (self._tool != null)
        {
            self._tool.KeyDown(evt);
        }
    }

    private MouseMove(evt: JQueryMouseEventObject)
    {
        var self = this;
        if (self._tool != null)
        {
            self._tool.MouseMove(evt);
        }
    }

    // Set cursors:
    public SetCursor(cursor: string)
    {
        if (cursor == "pick")
        {
            this._container.style.cursor = "url(/Images/cursor-pick.cur), none";
        }
        else if (cursor == "rotate")
        {
            this._container.style.cursor = "url(/Images/cursor-rotate.cur), none";
        }
        else
        {
            this._container.style.cursor = cursor;
        }
    }

    public GetCursor(): string
    {
        return this._container.style.cursor;
    }

    public GetEntities(skipSystems: boolean): Array<THREE.Object3D>
    {
        return EntitySelector.GetEntities(skipSystems);
    }

    public GetEntitiesByType(entType: EntityType): Array<THREE.Object3D>
    {
        return EntitySelector.GetEntitiesByType(entType);
    }

    public GetMeshes(skipSystems: boolean): Array<THREE.Mesh>
    {
        var ents = EntitySelector.GetEntities(skipSystems);
        var outMeshes = new Array<THREE.Mesh>();
        for (var idx in ents)
        {
            var ent = ents[idx];
            if (!(ent instanceof THREE.Mesh))
            {
                continue;
            }
            outMeshes.push(<THREE.Mesh>ent);
        }
        return outMeshes;
    }

    public GetEntityById(id: string): THREE.Object3D
    {
        return EntitySelector.GetEntityById(id);
    }

    public GetMeshById(id: string): THREE.Mesh
    {
        var ent = EntitySelector.GetEntityById(id);
        if (ent == null)
        {
            return null;
        }
        if (!(ent instanceof THREE.Mesh))
        {
            return null;
        }
        return <THREE.Mesh>ent;
    }

} 
