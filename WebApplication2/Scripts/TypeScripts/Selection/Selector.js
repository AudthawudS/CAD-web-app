/// <reference path="../_reference.d.ts" />
/// <reference path="../typings/hashtable/hashtable.d.ts" />
/// <reference path="../typings/hashtable/hashset.d.ts" />
/// <reference path="../Selection/SelectionItem.ts" />
/// <reference path="../Selection/SelectionItemBufVert.ts" />
/// <reference path="../Selection/SelectionItemEdge.ts" />
/// <reference path="../Selection/SelectionItemFace.ts" />
/// <reference path="../Selection/SelectionItemEntity.ts" />
/// <reference path="../App.ts" />
var SelectionType;
(function (SelectionType) {
    SelectionType[SelectionType["Node"] = 0] = "Node";
    SelectionType[SelectionType["Edge"] = 1] = "Edge";
    SelectionType[SelectionType["Face"] = 2] = "Face";
    SelectionType[SelectionType["Entity"] = 3] = "Entity";
})(SelectionType || (SelectionType = {}));
var Selector = /** @class */ (function () {
    function Selector() {
        this.SelectionItems = new Array();
        this._toolSelRect = new ToolSelectRectangle();
        this._pointCloud = null;
        this._edges = null;
        this._ents = new HashSet();
        this._entsOrigMaterial = new Hashtable();
    }
    Selector.prototype.SelectItems = function (selType) {
        var self = this;
        var selTags = new HashSet();
        var layout = App.Layout;
        var camera = App.Layout.Camera;
        if (this._toolSelRect.SelectionItemType != selType) {
            this.Clear();
            this._toolSelRect.Clear();
        }
        this._toolSelRect.SelectionItemType = selType;
        App.Layout.SetTool(this._toolSelRect);
        if (selType == SelectionType.Node) {
            //UIInteractive.Instance.SetMessage("Select Nodes or Hold Shift to unselect");
        }
        else if (selType == SelectionType.Edge) {
            //UIInteractive.Instance.SetMessage("Select Edges or Hold Shift to unselect");
        }
        else if (selType == SelectionType.Face) {
            //UIInteractive.Instance.SetMessage("Select Face or Hold Shift to unselect");
        }
        else if (selType == SelectionType.Entity) {
            //UIInteractive.Instance.SetMessage("Select Object or Hold Shift to unselect");
        }
        this._toolSelRect.ItemsSelected.on(function (items) {
            if (items.length == 0) {
                return;
            }
            var unselect = (Keyboard.IsShiftPressed);
            var allTags = new HashSet();
            var isFaces = items[0] instanceof SelectionItemFace;
            if (!unselect && isFaces) {
                // Get closer
                var closerTag = -1;
                var closerDist = 0;
                for (var idx in items) {
                    var item = items[idx];
                    var tag = item.MatchTag;
                    if (selTags.contains(tag)) {
                        continue;
                    }
                    var mesh = layout.GetMeshById(item.EntityId);
                    var center = item.GetCenter(mesh.geometry);
                    var dist = camera.position.distanceTo(center);
                    if (closerTag == -1) {
                        closerDist = dist;
                        closerTag = tag;
                    }
                    else {
                        if (closerDist > dist) {
                            closerTag = tag;
                            closerDist = dist;
                        }
                    }
                }
                var cloneItems = items.slice(0); // clone
                items = new Array();
                for (var idx in cloneItems) {
                    var item = cloneItems[idx];
                    var tag = item.MatchTag;
                    if (tag == closerTag) {
                        items.push(item);
                    }
                }
            }
            if (Keyboard.IsShiftPressed) {
                // remove selection
                self.RemoveItems(items);
                for (var i in items) {
                    var item = items[i];
                    if (selTags.contains(item.MatchTag)) {
                        selTags.remove(item.MatchTag);
                    }
                }
            }
            else {
                self.AddSelectedItems(items);
                for (var i in items) {
                    var item = items[i];
                    selTags.add(item.MatchTag);
                }
            }
        });
    };
    Selector.prototype.RemoveItems = function (items) {
        this.SelectionItems = _.filter(this.SelectionItems, function (p) {
            if (_.any(items, function (t) {
                return p.GetId() == t.GetId();
            })) {
                return false;
            }
            return true;
        });
        this.UpdateVisuals();
    };
    Selector.prototype.AddSelectedItems = function (items) {
        // Get uniques items
        var allItems = items.concat(this.SelectionItems);
        var uniqItems = _.uniq(allItems, false, function (p) {
            return p.GetId();
        });
        this.SelectionItems = uniqItems;
        //this.SelectionItems = items;
        this.UpdateVisuals();
    };
    Selector.prototype.GetSelectedMeshes = function () {
        var outMeshes = new Array();
        var layout = App.Layout;
        if (layout.Selector.SelectionItems.length == 0) {
            return outMeshes;
        }
        for (var idx in layout.Selector.SelectionItems) {
            var item = layout.Selector.SelectionItems[idx];
            if (item instanceof SelectionItemEntity) {
                var mesh = App.Layout.GetMeshById(item.EntityId);
                if (mesh) {
                    outMeshes.push(mesh);
                }
            }
        }
        return outMeshes;
    };
    Selector.prototype.UpdateVisuals = function () {
        var scene = App.Layout.Scene;
        this.ClearVisual();
        //
        // Create primary object
        //
        var objData = new ObjectData(EntityType.Selection, true);
        var pointGeom = new THREE.Geometry();
        var edgeGeom = new THREE.Geometry();
        //
        // Add selection 
        //
        for (var idx in this.SelectionItems) {
            var item = this.SelectionItems[idx];
            var mesh = App.Layout.GetMeshById(item.EntityId);
            if (!this._ents.contains(mesh)) {
                this._ents.add(mesh);
            }
            if (item instanceof SelectionItemBufVert) {
                var selVert = item;
                pointGeom.vertices.push(selVert.Vertex);
            }
            else if (item instanceof SelectionItemFace) {
                if (!this._entsOrigMaterial.containsKey(mesh)) {
                    // Store original material and apply facing color material
                    this._entsOrigMaterial.put(mesh, mesh.material);
                    mesh.material = this.GetMeshFaceMaterial();
                    // Set default color for each face
                    //
                    var color = ColorUtility.DecimalToTHREE(Settings.ShadingColor);
                    var geom = mesh.geometry;
                    for (var idxFace in geom.faces) {
                        var face = geom.faces[idxFace];
                        face.color.setRGB(color.r, color.g, color.b);
                    }
                }
                var selFace = item;
                mesh.geometry.faces[selFace.FaceIndex].color.setHex(0xFFFFC90E);
                mesh.geometry.colorsNeedUpdate = true;
            }
            else if (item instanceof SelectionItemEdge) {
                var selEdge = item;
                var v1 = mesh.geometry.vertices[selEdge.N1].clone();
                v1.applyMatrix4(mesh.matrix);
                var v2 = mesh.geometry.vertices[selEdge.N2].clone();
                v2.applyMatrix4(mesh.matrix);
                edgeGeom.vertices.push(v1);
                edgeGeom.vertices.push(v2);
            }
            else if (item instanceof SelectionItemEntity) {
                var selEnt = item;
                if (!this._entsOrigMaterial.containsKey(mesh)) {
                    this._entsOrigMaterial.put(mesh, mesh.material);
                    mesh.material = this.GetMeshSelectMaterial();
                }
            }
            else {
                throw Error("Not supported type of selection item");
            }
        }
        // Recreate point cloud
        {
            this._pointCloud = new THREE.PointCloud(pointGeom, this.GetPointCloudMaterial());
            this._pointCloud.userData = objData;
            scene.add(this._pointCloud);
        }
        // Recreate edges
        {
            this._edges = new THREE.Line(edgeGeom, this.GetEdgeMaterial(), THREE.LinePieces);
            this._edges.userData = objData;
            scene.add(this._edges);
        }
    };
    Selector.prototype.GetEdgeMaterial = function () {
        var material = new THREE.LineBasicMaterial({
            color: 0xFFC90E,
        });
        return material;
    };
    Selector.prototype.GetMeshSelectMaterial = function () {
        var renderMode = Rendering.GetRenderingMode();
        if (renderMode == RenderingModeType.Wireframe) {
            var material = new THREE.MeshBasicMaterial({
                color: 0xFFC90E,
                side: THREE.DoubleSide,
                wireframe: true
            });
        }
        else {
            var material = new THREE.MeshBasicMaterial({
                color: 0xFFC90E,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });
        }
        return material;
    };
    Selector.prototype.GetMeshFaceMaterial = function () {
        if (Rendering.GetRenderingMode() == RenderingModeType.ShadingEdge) {
            var materialBasic = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, vertexColors: THREE.FaceColors });
            return materialBasic;
        }
        else {
            var materialLabert = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide, vertexColors: THREE.FaceColors });
            return materialLabert;
        }
    };
    Selector.prototype.GetPointCloudMaterial = function () {
        var extent = App.Layout.GetExtent();
        var size = extent.size();
        var maxVal = Math.max(size.x, size.y, size.z);
        var sizePoint = maxVal * 0.05;
        if (App.Layout.IsOrthographic()) {
            sizePoint /= 3;
        }
        var material = new THREE.PointCloudMaterial({
            color: 0xFFC90E,
            side: THREE.DoubleSide,
            size: sizePoint
        });
        return material;
    };
    Selector.prototype.Clear = function () {
        this.SelectionItems = new Array();
        this.ClearVisual();
    };
    Selector.prototype.ClearVisual = function () {
        var scene = App.Layout.Scene;
        if (this._pointCloud != null) {
            scene.remove(this._pointCloud);
            this._pointCloud = null;
        }
        if (this._edges != null) {
            scene.remove(this._edges);
            this._edges = null;
        }
        this._entsOrigMaterial.each(function (mesh, mat) {
            mesh.material = mat;
        });
        this._entsOrigMaterial.clear();
        var ents = this._ents.values();
        this._ents.clear();
    };
    Selector.prototype.GetItemsByRect = function (rect, selType, callback) {
        var self = this;
        var ents = App.Layout.GetEntities(true);
        for (var idx in ents) {
            var ent = ents[idx];
            var objData = GetObjectData(ent);
            if (objData == null) {
                continue;
            }
            if (selType == SelectionType.Node) {
                var outItems = new Array();
                self.GetNodesByRect(rect, ent, outItems, false /*anyTag*/);
                callback(outItems);
            }
            else if (selType == SelectionType.Face) {
                var outItems = new Array();
                self.GetFacesByRect(rect, ent, outItems, true, false /*anyTag*/);
                callback(outItems);
            }
            else if (selType == SelectionType.Edge) {
                var outItems = new Array();
                self.GetEdgesByRect(rect, ent, outItems);
                callback(outItems);
            }
            else if (selType == SelectionType.Entity) {
                var outItems = new Array();
                self.GetEntByRect(rect, ent, outItems);
                callback(outItems);
            }
            else {
                throw Error("Not supported : " + selType);
            }
        }
        return outItems;
    };
    Selector.prototype.GetEntitiesByScreenRect = function (rect) {
        var self = this;
        var layout = App.Layout;
        var selItems = new Array();
        var ents = layout.GetEntities(true);
        for (var idx in ents) {
            var ent = ents[idx];
            self.GetEntByRect(rect, ent, selItems);
        }
        var outItems = new Array();
        if (selItems.length == 0) {
            return outItems;
        }
        for (var idx in selItems) {
            var selItem = selItems[idx];
            var ent = layout.GetEntityById(selItem.EntityId);
            outItems.push(ent);
        }
        return outItems;
    };
    Selector.prototype.GetEntityByScreenRect = function (rect) {
        var ents = this.GetEntitiesByScreenRect(rect);
        if (ents.length == 0) {
            return null;
        }
        // Select closer to camera
        var layout = App.Layout;
        var camera = layout.Camera;
        var closerEnt = ents[0];
        var minDist = -1;
        for (var idx in ents) {
            var ent = ents[idx];
            if (!ent.geometry) {
                continue;
            }
            var geometry = ent.geometry;
            var dist = geometry.boundingBox.center().distanceTo(camera.position);
            if (minDist == -1 || dist < minDist) {
                minDist = dist;
                closerEnt = ent;
            }
        }
        return ent;
    };
    Selector.prototype.GetEntityByScreenPoint = function (pnt, entType) {
        var layout = App.Layout;
        var camera = App.Layout.Camera;
        var devicePnt = layout.ScreenToDevice(pnt);
        var rayCaster = new THREE.Raycaster();
        rayCaster.setFromCamera(devicePnt, camera);
        var ents = App.Layout.GetEntities(true);
        var intersections = rayCaster.intersectObjects(ents, false);
        if (intersections == null || intersections.length == 0) {
            return null;
        }
        for (var idx in intersections) {
            var inter = intersections[idx];
            var obj = inter.object;
            var objData = GetObjectData(obj);
            if (objData == null) {
                continue;
            }
            if (entType == EntityType.Unknown || objData.EntityType == entType) {
                return obj;
            }
        }
        return null;
    };
    Selector.prototype.GetEntByRect = function (rect, ent, outItems) {
        var layout = App.Layout;
        var camera = App.Layout.Camera;
        var scene = App.Layout.Scene;
        if (!(ent instanceof THREE.Mesh)) {
            return;
        }
        var mesh = ent;
        var geom = (ent).geometry;
        if (!IsObjectData(ent.userData)) {
            return;
        }
        var objData = ent.userData;
        if (objData.IsSystem) {
            return;
        }
        var faceItems = new Array();
        this.GetFacesByRect(rect, ent, faceItems, true, false /*anyTag*/);
        if (faceItems.length > 0) {
            var selEnt = new SelectionItemEntity(ent);
            outItems.push(selEnt);
        }
    };
    Selector.prototype.GetFacesByRect = function (rect, ent, outItems, raytrace, anyTag) {
        var layout = App.Layout;
        var camera = App.Layout.Camera;
        var scene = App.Layout.Scene;
        if (!(ent instanceof THREE.Mesh)) {
            return;
        }
        var mesh = ent;
        var geom = (ent).geometry;
        if (!IsObjectData(ent.userData)) {
            return;
        }
        var objData = ent.userData;
        if (objData.IsSystem) {
            return;
        }
        var tags = new HashSet();
        // Select all face in given rectangle
        //
        for (var idxFace in geom.faces) {
            var face = geom.faces[idxFace];
            var fTag = face.tag;
            if (!anyTag) {
                if (fTag == -1) {
                    continue;
                }
                if (tags.contains(fTag)) {
                    continue;
                }
            }
            var vec1 = geom.vertices[face.a].clone();
            vec1.applyMatrix4(mesh.matrix);
            var vec2 = geom.vertices[face.b].clone();
            vec2.applyMatrix4(mesh.matrix);
            var vec3 = geom.vertices[face.c].clone();
            vec3.applyMatrix4(mesh.matrix);
            var screen1 = layout.WorldToScreen(vec1);
            var screen2 = layout.WorldToScreen(vec2);
            var screen3 = layout.WorldToScreen(vec3);
            var box = new THREE.Box2();
            box.expandByPoint(screen1);
            box.expandByPoint(screen2);
            box.expandByPoint(screen3);
            if (rect.isIntersectionBox(box)) {
                // Make more accurate test
                var boxIntersect = rect.clone().intersect(box);
                var tri2d = new Triangle(Vec2To3(screen1), Vec2To3(screen2), Vec2To3(screen3));
                if (!tri2d.IsPointInside(Vec2To3(boxIntersect.center()))) {
                    continue;
                }
                if (raytrace) {
                    var centerFace = vec1.clone().add(vec2).add(vec3).divideScalar(3);
                    var dir = centerFace.clone().sub(camera.position).normalize();
                    var ray = new THREE.Ray(camera.position, dir);
                    var intersectionPoint = ray.intersectTriangle(vec1, vec2, vec3, true);
                    if (intersectionPoint == null) {
                        continue;
                    }
                }
                tags.add(fTag);
            }
        }
        // Get all selected faces by tag
        var arr = geom.faces;
        // for (var idxFace in geom.faces)
        for (var idxfface = 0; idxfface < arr.length; idxfface++) {
            var face = geom.faces[idxfface];
            var fTag = face.tag;
            if (!anyTag) {
                if (fTag == -1) {
                    continue;
                }
                if (!tags.contains(fTag)) {
                    continue;
                }
            }
            var selFace = new SelectionItemFace(ent, idxfface, face.a, face.b, face.c, fTag);
            outItems.push(selFace);
        }
        geom.colorsNeedUpdate = true;
    };
    Selector.prototype.GetEdgesByRect = function (rect, ent, outItems) {
        var layout = App.Layout;
        var camera = App.Layout.Camera;
        var scene = App.Layout.Scene;
        if (!(ent instanceof THREE.Mesh)) {
            return;
        }
        var mesh = ent;
        var self = this;
        var geom = (ent).geometry;
        if (!IsObjectData(ent.userData)) {
            return;
        }
        var objData = ent.userData;
        if (objData.IsSystem) {
            return;
        }
        var edges = objData.Edges;
        var tags = new HashSet();
        var verts = geom.vertices;
        for (var iEdg = 0; iEdg < edges.length; iEdg++) {
            var edge = edges[iEdg];
            var tag = edge.MathTag;
            if (tag == -1) {
                continue;
            }
            if (tags.contains(tag)) {
                continue;
            }
            var vec1 = verts[edge.N1].clone();
            vec1.applyMatrix4(mesh.matrix);
            var vec2 = verts[edge.N2].clone();
            vec2.applyMatrix4(mesh.matrix);
            if (vec1.equals(vec2)) {
                continue;
            }
            var screen1 = layout.WorldToScreen(vec1);
            var screen2 = layout.WorldToScreen(vec2);
            var box = new THREE.Box2();
            box.expandByPoint(screen1);
            box.expandByPoint(screen2);
            if (rect.isIntersectionBox(box)) {
                tags.add(tag);
            }
        }
        // Get all selected edges by tag
        for (var iEdg = 0; iEdg < edges.length; iEdg++) {
            var edge = edges[iEdg];
            var tag = edge.MathTag;
            if (tag == -1) {
                continue;
            }
            if (!tags.contains(tag)) {
                continue;
            }
            var selItem = new SelectionItemEdge(ent, edge.N1, edge.N2, tag);
            outItems.push(selItem);
        }
    };
    Selector.prototype.GetNodesByRect = function (rect, ent, outItems, anyTags) {
        var layout = App.Layout;
        if (!(ent instanceof THREE.Mesh)) {
            return;
        }
        var geom = (ent).geometry;
        if (geom.type == "Geometry") {
            if (!IsObjectData(ent.userData)) {
                return;
            }
            var objData = ent.userData;
            if (objData.IsSystem) {
                return;
            }
            var arr = geom.vertices;
            for (var idxVert = 0; idxVert < arr.length; idxVert++) {
                var vec = arr[idxVert];
                var tag = vec.tag;
                if (!anyTags) {
                    if (tag == -1) {
                        continue;
                    }
                }
                vec = vec.clone().applyMatrix4(ent.matrix);
                var screenPnt = layout.WorldToScreen(vec);
                if (rect.containsPoint(screenPnt)) {
                    outItems.push(new SelectionItemBufVert(ent, vec, idxVert, tag));
                }
            }
        }
    };
    return Selector;
}());
