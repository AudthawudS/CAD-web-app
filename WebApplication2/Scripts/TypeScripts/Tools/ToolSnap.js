/// <reference path="../_reference.d.ts" />
var ToolSnap = /** @class */ (function () {
    function ToolSnap() {
    }
    ToolSnap.prototype.Start = function () {
        this._selItems = App.Layout.Selector.SelectionItems;
        if (this._selItems.length == 0) {
            MessageBox.ShowError("First select vertices/edge/face");
            return;
        }
        App.Layout.Controls.enabled = false;
        App.Layout.SetCursor("default");
        UIInteractive.Instance.SetMessage("Pick BC tool");
    };
    ToolSnap.prototype.End = function () {
        App.Layout.Controls.enabled = true;
        UIInteractive.Instance.SetMessage(null);
    };
    ToolSnap.prototype.MouseDown = function (evt) {
    };
    ToolSnap.prototype.MouseUp = function (evt) {
        if (this._selItems.length == 0) {
            return;
        }
        var layout = App.Layout;
        var mousePos = new THREE.Vector2(evt.clientX, evt.clientY);
        var offset = new THREE.Vector2(5, 5);
        var rect = new THREE.Box2(mousePos.clone().sub(offset), mousePos.clone().add(offset));
        var pickEnt = layout.Selector.GetEntityByScreenRect(rect);
        if (pickEnt == null) {
            return;
        }
        this.Snap(pickEnt);
        // After snap - set default tool
        App.Layout.SetDefaultTool();
    };
    ToolSnap.prototype.Snap = function (ent) {
        if (!(ent instanceof THREE.Mesh)) {
            return;
        }
        var mesh = ent;
        if (this._selItems.length == 0) {
            return;
        }
        var selType = this._selItems[0].SelectionType;
        if (selType == SelectionType.Node) {
            this.SnapToNodes(mesh);
        }
        else if (selType == SelectionType.Face) {
            this.SnapToFace(mesh);
        }
        else {
            MessageBox.ShowError("Selection type not supported");
        }
    };
    ToolSnap.prototype.SnapToFace = function (mesh) {
        var tags = new HashSet();
        _.each(this._selItems, function (p) { tags.add(p.MatchTag); });
        if (tags.size() > 1) {
            MessageBox.ShowError("Select one face");
            return;
        }
        var faceItem = (this._selItems[0]);
        var verts = mesh.geometry.vertices;
        var p0 = verts[faceItem.N1].clone();
        p0.applyMatrix4(mesh.matrix);
        var p1 = verts[faceItem.N2].clone();
        p1.applyMatrix4(mesh.matrix);
        var p2 = verts[faceItem.N3].clone();
        p2.applyMatrix4(mesh.matrix);
        //var face = mesh.geometry.faces[faceItem.FaceIndex];
        //var normal = face.normal;
        var normal = GetNormal(p0, p1, p2);
        // Rotate to axis
        var angleVec = GetHorizontalAngle(normal);
        // Make ident
        mesh.matrix.identity();
        // Rotate
        var matRot = new THREE.Matrix4();
        matRot.makeRotationFromEuler(new THREE.Euler(angleVec.x, angleVec.y, angleVec.z));
        mesh.applyMatrix(matRot);
        // Move to center point
        var center = p0.clone().add(p1).add(p2).divideScalar(3);
        var translate = center.clone().sub(mesh.position);
        var mat = new THREE.Matrix4();
        mat.makeTranslation(translate.x, translate.y, translate.z);
        mesh.applyMatrix(mat);
    };
    ToolSnap.prototype.SnapToNodes = function (mesh) {
        var pnts = new Array();
        for (var idx in this._selItems) {
            var selItem = this._selItems[idx];
            if (!(selItem instanceof SelectionItemBufVert)) {
                continue;
            }
            var vertItem = selItem;
            pnts.push(vertItem.Vertex.clone());
        }
        if (pnts.length == 1) {
            var p = pnts[0];
            // Move to point
            var translate = p.clone().sub(mesh.position);
            var mat = new THREE.Matrix4();
            mat.makeTranslation(translate.x, translate.y, translate.z);
            mesh.applyMatrix(mat);
        }
        else if (this._selItems.length == 2) {
            // In pairs – Using the tools in pairs provides a method of defining a reference axis between two known points.
            // By varying the dimensions of the tool as it is created the user can actually define points inside the component, 
            // and this feature is useful for creating axes at oblique or complex angles about which loads,
            // moments and supports can be applied.
            var p0 = pnts[0];
            var p1 = pnts[1];
            // Rotate to axis
            var axisVec = p1.clone().sub(p1);
            var angleVec = GetHorizontalAngle(axisVec);
            // Make ident
            mesh.matrix.identity();
            // Rotate
            var matRot = new THREE.Matrix4();
            matRot.makeRotationFromEuler(new THREE.Euler(angleVec.x, angleVec.y, angleVec.z));
            mesh.applyMatrix(matRot);
            // Move to center point
            var center = p0.clone().add(p1).divideScalar(2);
            var translate = center.clone().sub(mesh.position);
            var mat = new THREE.Matrix4();
            mat.makeTranslation(translate.x, translate.y, translate.z);
            mesh.applyMatrix(mat);
        }
        else if (this._selItems.length == 3) {
            var p0 = pnts[0];
            var p1 = pnts[1];
            var p2 = pnts[2];
            var normal = GetNormal(p0, p1, p2);
            // Rotate to axis
            var angleVec = GetHorizontalAngle(normal);
            // Make ident
            mesh.matrix.identity();
            // Rotate
            var matRot = new THREE.Matrix4();
            matRot.makeRotationFromEuler(new THREE.Euler(angleVec.x, angleVec.y, angleVec.z));
            mesh.applyMatrix(matRot);
            // Move to center point
            var center = p0.clone().add(p1).add(p2).divideScalar(3);
            var translate = center.clone().sub(mesh.position);
            var mat = new THREE.Matrix4();
            mat.makeTranslation(translate.x, translate.y, translate.z);
            mesh.applyMatrix(mat);
        }
        else {
            MessageBox.ShowError("Select 3 or 2 or 1 points");
        }
    };
    ToolSnap.prototype.MouseMove = function (evt) {
    };
    ToolSnap.prototype.KeyDown = function (evt) {
    };
    return ToolSnap;
}());
