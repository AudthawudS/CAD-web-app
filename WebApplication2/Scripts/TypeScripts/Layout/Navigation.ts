/// <reference path="../_reference.d.ts" />

class Navigation
{
    private _layout: Layout;

    private _cube: THREE.Mesh;

    private _cubeHiglight: THREE.Mesh;

    private _arrows: THREE.Object3D;

    private _arrowsTexts: THREE.Object3D;

    private _customScene: THREE.Scene;
    
    private _container: HTMLElement;

    private _mouseCursor: string;

    private _isDraging: boolean;

    private _startDragPos: THREE.Vector2;

    private _isLeftMouserPressed: boolean;

    constructor(layout: Layout, container: HTMLElement)
    {
        var self = this;
        self._layout = layout;
        self._container = container;
        self._mouseCursor = null;
        self._isDraging = false;
        self._isLeftMouserPressed = false;

        // Render cube in owner scene
        self._customScene = new THREE.Scene();

        self.CreateCube();

        self.CreateArrows();

        // Attach to events
        //
        this._layout.Controls.addEventListener("change", function (e)
        {
            self.Update();
            self._layout.Renderer.render(
                self._layout.Scene, self._layout.Camera);
        });

        this._layout.ControlsTrackball.addEventListener("change", function (e)
        {
            self.Update();
            self._layout.Renderer.render(
                self._layout.Scene, self._layout.Camera);
        });


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

    }

    private MouseDown(evt: JQueryMouseEventObject)
    {
        var self = this;

        self._isDraging = false;
        self._startDragPos = null;

        self._isLeftMouserPressed = (evt.which == 1);
    }

    private MouseUp(evt: JQueryMouseEventObject)
    {
        var self = this;

        if (!self._isDraging)
        {
            var x = evt.clientX;
            var y = evt.clientY;
            var mouseScreenPos = new THREE.Vector2(x, y);
            var side = this.GetNavigateSide(mouseScreenPos);
            if (side != NavigateBoxSide.None)
            {
                this.GotoSide(side);
            }
        }

        self._isDraging = false;
        self._startDragPos = null;
        self._isLeftMouserPressed = false;
    }

    private MouseMove(evt: JQueryMouseEventObject)
    {
        var self = this;

        var x = evt.clientX;
        var y = evt.clientY;
        var mouseScreenPos = new THREE.Vector2(x, y);

        var side = this.GetNavigateSide(mouseScreenPos);

        if (self._isLeftMouserPressed)
        {
            if (!self._isDraging)
            {
                if (side != NavigateBoxSide.None)
                {
                    if (self._startDragPos == null)
                    {
                        self._startDragPos = mouseScreenPos.clone();
                    }
                    else
                    {
                        var dist = self._startDragPos.distanceTo(mouseScreenPos);
                        if (dist > 3)
                        {
                            self._isDraging = true;
                        }
                    }
                }
                else
                {
                    self._startDragPos = null;
                }
            }
            else
            {
                // 
                // Draging process
                //

                if (this._mouseCursor == null)
                {
                    // Store original cursor
                    this._mouseCursor = this._layout.GetCursor();
                }
                this._layout.SetCursor("rotate");

                // rotating across 100px goes 180 degrees around
                var rotateCoeff = (Math.PI) / 100.0;

                var vecDiff = mouseScreenPos.clone().sub(self._startDragPos);
                if (vecDiff.x != 0)
                {
                    App.Layout.Controls.rotateLeft(vecDiff.x * rotateCoeff);
                }
                if (vecDiff.y != 0)
                {
                    App.Layout.Controls.rotateUp(vecDiff.y * rotateCoeff);
                }

                self._startDragPos = mouseScreenPos.clone();

                return;
            }
        }


        // Update cursor
        //
        if (!self._isDraging)
        {
            if (side != NavigateBoxSide.None)
            {
                if (this._mouseCursor == null)
                {
                    // Store original cursor
                    this._mouseCursor = this._layout.GetCursor();
                }
                this._layout.SetCursor("pointer");
            }
            else
            {
                if (this._mouseCursor != null)
                {
                    // store original cursor
                    this._layout.SetCursor(this._mouseCursor);
                    this._mouseCursor = null;
                }
            }
        }

        // Update higlight
        //
        var mats = (<THREE.MeshFaceMaterial>this._cubeHiglight.material).materials;
        for (var idxFace = 0; idxFace < this._cubeHiglight.geometry.faces.length; idxFace++)
        {
            // TODO: indexes of faces different that indexes of higlight cube
            var isActive = false;
            if (side == NavigateBoxSide.Front)
            {
                isActive = (idxFace == 0);
            }
            else if (side == NavigateBoxSide.Right)
            {
                isActive = (idxFace == 2);
            }
            else if (side == NavigateBoxSide.Back)
            {
                isActive = (idxFace == 1);
            }
            else if (side == NavigateBoxSide.Top)
            {
                isActive = (idxFace == 4);
            }
            else if (side == NavigateBoxSide.Bottom)
            {
                isActive = (idxFace == 5);
            }
            else if (side == NavigateBoxSide.Left)
            {
                isActive = (idxFace == 3);
            }

            //mats[idxFace] = new THREE.MeshBasicMaterial(
            //  { transparent: true, color: 0xff0000, opacity: 0, depthWrite: false, depthTest: false, vertexColors: THREE.VertexColors })
            var mat = mats[idxFace];
            if (isActive)
            {
                mat.opacity = 0.5;
            }
            else
            {
                mat.opacity = 0;
            }
            mat.needsUpdate = true;
        }
    }

    private GotoSide(side: NavigateBoxSide)
    {
        var target = this._layout.Controls.target.clone();
        var len = this._layout.Camera.position.distanceTo(target);
        var vec: THREE.Vector3;
        var piece = 0.00001;
        if (side == NavigateBoxSide.Top)
        {
            vec = new THREE.Vector3(piece, 0, 1);
        }
        else if (side == NavigateBoxSide.Bottom)
        {
            vec = new THREE.Vector3(-piece, 0, -1);
        }
        else if (side == NavigateBoxSide.Front)
        {
            vec = new THREE.Vector3(1, 0, 0);
        }
        else if (side == NavigateBoxSide.Back)
        {
            vec = new THREE.Vector3(-1, 0, 0);
        }
        else if (side == NavigateBoxSide.Left)
        {
            vec = new THREE.Vector3(0, -1, 0);
        }
        else if (side == NavigateBoxSide.Right)
        {
            vec = new THREE.Vector3(0, 1, 0);
        }
        else
        {
            throw new Error("Found unsupported NavigateBoxSide:" + side);
        }
        vec.multiplyScalar(len);
        var newCamPos = target.clone().add(vec);
        this._layout.Camera.position.set(newCamPos.x, newCamPos.y, newCamPos.z);
        this._layout.Camera.lookAt(target);
    }

    private GetNavigateSide(mousePos: THREE.Vector2): NavigateBoxSide
    {
        var layout = this._layout;
        var camera = this._layout.Camera;

        var canvasSize = this._layout.GetSize();
        var offset = this._layout.GetScreenOffset();
        var boxZoneScreen = this.GetBoxZone();
        // Revert y
        var y1 = canvasSize.y - boxZoneScreen.min.y;
        var y2 = canvasSize.y - boxZoneScreen.max.y;
        boxZoneScreen.min.y = Math.min(y1, y2);
        boxZoneScreen.max.y = Math.max(y1, y2);
        boxZoneScreen.min.add(offset);
        boxZoneScreen.max.add(offset);

        // Screen to device
        // Device is mouse position in normalized device coordinates
        // (-1 to +1) for both component
        var devicePnt = mousePos.clone();

        devicePnt.x -= (boxZoneScreen.min.x);
        devicePnt.y -= (boxZoneScreen.min.y);

        var width = boxZoneScreen.size().x;
        var height = boxZoneScreen.size().y;

        devicePnt.x = (devicePnt.x / width) * 2 - 1;
        devicePnt.y = -(devicePnt.y / height) * 2 + 1;


        var rayc = new THREE.Raycaster();
        var vec2 = new THREE.Vector2();
        rayc.setFromCamera(devicePnt, camera);
        var inters = rayc.intersectObjects(this._customScene.children, true);
        if (inters == null || inters.length == 0)
        {
            return NavigateBoxSide.None;
        }

        for (var idx in inters)
        {
            var inter = inters[idx];
            var indexFace = this._cube.geometry.faces.indexOf(inter.face);
            switch (indexFace)
            {
                case 0:
                case 1:
                    return NavigateBoxSide.Front;
                case 2:
                case 3:
                    return NavigateBoxSide.Back;
                case 4:
                case 5:
                    return NavigateBoxSide.Right;
                case 6:
                case 7:
                    return NavigateBoxSide.Left;
                case 8:
                case 9:
                    return NavigateBoxSide.Top;
                case 10:
                case 11:
                    return NavigateBoxSide.Bottom;
            }
        }

        return NavigateBoxSide.None;
    }


    public Update()
    {
        var camera = this._layout.Camera;
        var control = this._layout.Controls;
        var renderer = this._layout.Renderer;

        var canvasSize = new THREE.Vector2();
        canvasSize.x = renderer.context.canvas.width;
        canvasSize.y = renderer.context.canvas.height;

        var arrowsPnt: THREE.Vector3;

        if (camera instanceof THREE.PerspectiveCamera)
        {
            var screenOffset = this._layout.GetScreenOffset();

            // Setup arrows
            var arrowsSreenPnt = new THREE.Vector2(screenOffset.x + 150, screenOffset.y + canvasSize.y - 50);
            arrowsPnt = this._layout.ScreenToWorld(arrowsSreenPnt);            

            this._arrows.scale.set(1, 1, 1);
            this._arrowsTexts.scale.set(1, 1, 1);
        }
        else if (camera instanceof THREE.OrthographicCamera)
        {
            var cameraOrtho = <THREE.OrthographicCamera>camera;
            var camPos = camera.position;

            arrowsPnt = camPos.clone();

            var dirY = new THREE.Vector3(0, 1, 0);
            dirY.transformDirection(camera.matrixWorld);
            dirY.multiplyScalar((-(canvasSize.y/2) + 50) / cameraOrtho.zoom);
            arrowsPnt.add(dirY);

            var dirX = new THREE.Vector3(1, 0, 0);
            dirX.transformDirection(camera.matrixWorld);
            dirX.multiplyScalar((-(canvasSize.x / 2) + 150) / cameraOrtho.zoom);
            arrowsPnt.add(dirX);

            var scale = (30000) / cameraOrtho.zoom;

            this._arrows.scale.set(scale, scale, scale);
            this._arrowsTexts.scale.set(scale, scale, scale);
        }
        else
        {
            console.warn("Unsuported camera type");
            return;
        }

        this._arrows.position.set(arrowsPnt.x, arrowsPnt.y, arrowsPnt.z);
        this._arrows.updateMatrixWorld(true);

        this._arrowsTexts.position.set(arrowsPnt.x, arrowsPnt.y, arrowsPnt.z);
        this._arrowsTexts.updateMatrixWorld(true);
    }

    public Render()
    {
        //
        // Render custom scene
        //
        var layout = this._layout;
        var camera = layout.Camera;

        var boxZone = this.GetBoxZone();
        var cubeSize = 20;

        var oldCameraZoom: number = 1;

        if (camera instanceof THREE.OrthographicCamera)
        {
            var cameraOrtho = <THREE.OrthographicCamera>camera;
            oldCameraZoom = cameraOrtho.zoom;

            var halfHeight = (cameraOrtho.top - cameraOrtho.bottom) / 2;
            cameraOrtho.zoom =  halfHeight / (cubeSize / 3);
            cameraOrtho.updateProjectionMatrix();
        }

        // Set cube position
        var vec = camera.position.clone().sub(layout.Controls.target).normalize();
        vec.multiplyScalar(cubeSize);
        var cubePos = camera.position.clone().sub(vec);
        this._cube.position.copy(cubePos);
        this._cubeHiglight.position.copy(cubePos);


        // Render
        //

        var canvasSize = layout.GetSize();

        layout.Renderer.clearDepth(); // important! clear the depth buffer
        layout.Renderer.setViewport(boxZone.min.x, boxZone.min.y, boxZone.size().x, boxZone.size().y);
        layout.Renderer.render(this._customScene, layout.Camera);

        // Restore viewport
        layout.Renderer.setViewport(0, 0, canvasSize.x, canvasSize.y);
        if (camera instanceof THREE.OrthographicCamera)
        {
            // Restore zoom
            var cameraOrtho = <THREE.OrthographicCamera>camera;
            cameraOrtho.zoom = oldCameraZoom;
            cameraOrtho.updateProjectionMatrix();
        }
    }

    private GetBoxZone(): THREE.Box2
    {
        var layout = this._layout;

        var canvasSize = layout.GetSize();

        var aspect = canvasSize.x / canvasSize.y;
        var h = 70;
        var w = h * aspect;

        return new THREE.Box2(
            new THREE.Vector2(canvasSize.x - w - 10, canvasSize.y - h - 10),
            new THREE.Vector2(canvasSize.x - 10, canvasSize.y - 10));
    }

    private CreateArrows()
    {
        var materialRed = new THREE.MeshBasicMaterial({ color: 0xFF0000, side: THREE.DoubleSide });
        var materialGreen = new THREE.MeshBasicMaterial({ color: 0x00FF00, side: THREE.DoubleSide });
        var materialBlue = new THREE.MeshBasicMaterial({ color: 0x0000FF, side: THREE.DoubleSide });
        var materialBlack = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });

        var objArrows = new THREE.Object3D();
        objArrows.userData = new ObjectData(EntityType.NavigationArrows, true);

        var objArrowsTexts = new THREE.Object3D();
        objArrowsTexts.userData = new ObjectData(EntityType.NavigationArrows, true);

        var sizeArrow = 0.0008;
        var sizeArrowText = 0.0004;

        var coneGeom = new THREE.CylinderGeometry(0, sizeArrow / 4, sizeArrow, 12, 1, false);
        var lineGeom = new THREE.CylinderGeometry(sizeArrow / 10, sizeArrow / 10, sizeArrow, 12, 1, false);

        var offsetArrow = sizeArrow * 1.5;

        var textParams =
            {
                size: sizeArrow / 1.6,
                height: sizeArrow / 4,
                curveSegments: 4,

                font: "optimer",
                weight: "normal",
                style: "normal",

                bevelEnabled: false,

                material: 0,
                extrudeMaterial: 1
            };
        // Arrow X
        //
        var arrowX = coneGeom.clone();
        GeomRotate(arrowX, 0, 0, -90);
        GeomTranslate(arrowX, offsetArrow, 0, 0);
        objArrows.add(new THREE.Mesh(arrowX, materialRed));
        var arrowXLine = lineGeom.clone();
        GeomRotate(arrowXLine, 0, 0, -90);
        GeomTranslate(arrowXLine, sizeArrow / 2, 0, 0);
        objArrows.add(new THREE.Mesh(arrowXLine, materialRed));

        var map = THREE.ImageUtils.loadTexture("/Images/ArrowX.png");
        var textX = new THREE.Sprite(new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true }));
        textX.scale.set(sizeArrowText, sizeArrowText, sizeArrowText);
        textX.position.set(offsetArrow * 1.4, 0, offsetArrow / 2);
        objArrowsTexts.add(textX);

        // Arrow Y
        //
        var arrowY = coneGeom.clone();
        GeomTranslate(arrowY, 0, offsetArrow, 0);
        objArrows.add(new THREE.Mesh(arrowY, materialGreen));
        var arrowYLine = lineGeom.clone();
        GeomTranslate(arrowYLine, 0, sizeArrow / 2, 0);
        objArrows.add(new THREE.Mesh(arrowYLine, materialGreen));

        var map = THREE.ImageUtils.loadTexture("/Images/ArrowY.png");
        var textY = new THREE.Sprite(new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true }));
        textY.scale.set(sizeArrowText, sizeArrowText, sizeArrowText);
        textY.position.set(0, offsetArrow * 1.4, offsetArrow / 2);
        objArrowsTexts.add(textY);

        // Arrow Z
        //
        var arrowZ = coneGeom.clone();
        GeomRotate(arrowZ, 90, 0, 0);
        GeomTranslate(arrowZ, 0, 0, offsetArrow);
        objArrows.add(new THREE.Mesh(arrowZ, materialBlue));
        var arrowZLine = lineGeom.clone();
        GeomRotate(arrowZLine, 90, 0, 0);
        GeomTranslate(arrowZLine, 0, 0, sizeArrow / 2);
        objArrows.add(new THREE.Mesh(arrowZLine, materialBlue));

        var map = THREE.ImageUtils.loadTexture("/Images/ArrowZ.png");
        var textZ = new THREE.Sprite(new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true }));
        textZ.scale.set(sizeArrowText, sizeArrowText, sizeArrowText);
        textZ.position.set(0, 0, offsetArrow * 1.5);
        objArrowsTexts.add(textZ);

        this._arrows = objArrows;
        this._arrowsTexts = objArrowsTexts;

        this._arrows.renderOrder = 2;
        this._layout.Scene.add(this._arrows);

        this._arrowsTexts.renderOrder = 2;
        this._layout.Scene.add(this._arrowsTexts);
    }

    private CreateCube()
    {
        var cubeSize = 8;

        var cubeGeom = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

        // texture mapping
        //
        var forward = [new THREE.Vector2(0, .666), new THREE.Vector2(.5, .666), new THREE.Vector2(.5, 1), new THREE.Vector2(0, 1)];
        var clouds = [new THREE.Vector2(.5, .666), new THREE.Vector2(1, .666), new THREE.Vector2(1, 1), new THREE.Vector2(.5, 1)];
        var crate = [new THREE.Vector2(0, .333), new THREE.Vector2(.5, .333), new THREE.Vector2(.5, .666), new THREE.Vector2(0, .666)];
        var stone = [new THREE.Vector2(.5, .333), new THREE.Vector2(1, .333), new THREE.Vector2(1, .666), new THREE.Vector2(.5, .666)];
        var top = [new THREE.Vector2(0, 0), new THREE.Vector2(.5, 0), new THREE.Vector2(.5, .333), new THREE.Vector2(0, .333)];
        var wood = [new THREE.Vector2(.5, 0), new THREE.Vector2(1, 0), new THREE.Vector2(1, .333), new THREE.Vector2(.5, .333)];

        cubeGeom.faceVertexUvs[0] = [];
        cubeGeom.faceVertexUvs[0][0] = [forward[0], forward[1], forward[3]];
        cubeGeom.faceVertexUvs[0][1] = [forward[1], forward[2], forward[3]];
        cubeGeom.faceVertexUvs[0][2] = [clouds[0], clouds[1], clouds[3]];
        cubeGeom.faceVertexUvs[0][3] = [clouds[1], clouds[2], clouds[3]];
        cubeGeom.faceVertexUvs[0][4] = [crate[0], crate[1], crate[3]];
        cubeGeom.faceVertexUvs[0][5] = [crate[1], crate[2], crate[3]];
        cubeGeom.faceVertexUvs[0][6] = [stone[0], stone[1], stone[3]];
        cubeGeom.faceVertexUvs[0][7] = [stone[1], stone[2], stone[3]];
        cubeGeom.faceVertexUvs[0][8] = [top[0], top[1], top[3]];
        cubeGeom.faceVertexUvs[0][9] = [top[1], top[2], top[3]];
        cubeGeom.faceVertexUvs[0][10] = [wood[0], wood[1], wood[3]];
        cubeGeom.faceVertexUvs[0][11] = [wood[1], wood[2], wood[3]];

        var material = new THREE.MeshBasicMaterial({ map: THREE.ImageUtils.loadTexture('/Images/Cube.jpg') });

        this._cube = new THREE.Mesh(cubeGeom, material);
        this._cube.name = "_cube";
        this._cube.userData = new ObjectData(EntityType.NavigationCube, true);
        this._customScene.add(this._cube);


        var cubeGeomHg = new THREE.BoxGeometry(cubeSize * 1.01, cubeSize * 1.01, cubeSize * 1.01);
        var materials = new Array<THREE.MeshBasicMaterial>();
        for (var idxFace in cubeGeom.faces)
        {
            var faceMat = new THREE.MeshBasicMaterial({ transparent: true, color: 0xff0000, opacity: 0, depthWrite: false, depthTest: false, vertexColors: THREE.VertexColors })
            materials.push(faceMat);
        }
        this._cubeHiglight = new THREE.Mesh(cubeGeomHg, new THREE.MeshFaceMaterial(materials));
        this._cubeHiglight.name = "_cubeHiglight";
        this._cubeHiglight.userData = new ObjectData(EntityType.NavigationCube, true);

        this._customScene.add(this._cubeHiglight);
    }
}

enum NavigateBoxSide
{
    None,
    Front,
    Back,
    Right,
    Left,
    Top,
    Bottom
}