/// <reference path="../_reference.d.ts" />
/// <reference path="../FEA/FRDNode.ts" />
/// <reference path="../FEA/FRDDataset.ts" />
/// <reference path="../FEA/Legend.ts" />

class FEAAnimationClass
{
    private _isAnimated: boolean;

    private _datasetDisp: FRDDataset;

    private _entIds: Array<string>;

    private _btnStart: JQueryRibbonButton;

    private _btnStop: JQueryRibbonButton;

    private _geometryOrig: IHashtable<THREE.Mesh, THREE.Geometry>;

    private _ampFactor: number;

    private _ampCoeff: number;

    private _ampStep: number;

    private _isRealDisplacement : boolean;

    constructor()
    {
        this._datasetDisp = null;
        this._geometryOrig = new Hashtable<THREE.Mesh, THREE.Geometry>();
        this._btnStart = (<JQueryRibbonButton>$('#btn-animation-disp-start'));
        this._btnStop = (<JQueryRibbonButton>$('#btn-animation-disp-stop'));
        this._ampFactor = 0;
        this._ampCoeff = 0;
        this._ampStep = 0.2;
        this._isRealDisplacement = false;

        var self = this;

        $("#btn-animation-disp-real-disp").click(function ()
        {
            self._isRealDisplacement = !self._isRealDisplacement;
        });
    }

    public StartAnimation()
    {
        var self = this;
        var layout = App.Layout;
        var scene = App.Layout.Scene;

        if (self._isAnimated)
        {
            // Already animated
            return;
        }

        self._btnStart.disableRbButton();
        self._btnStop.disableRbButton();

        this._ampFactor = 0;
        this._ampCoeff = 0;
        this._ampStep = 0.2;

        if (this._datasetDisp != null)
        {
            self._isAnimated = true;
            self.AnimateMesh();
            self._btnStop.enableRbButton();
            App.Ribbon.GotoEditor();
        }
        else
        {
            $.getJSON('/Simulation/GetAnimation?tmp=' + Number(new Date()),
                function (data, textStatus, jq)
                {
                    if (!ErrorHandler.CheckJsonRes(data))
                    {
                        return;
                    }

                    self._datasetDisp = <FRDDataset>data.dataset;
                    self._entIds = <Array<string>>data.entsIds;
                    self._isAnimated = true;
                    self.AnimateMesh();
                    self._btnStop.enableRbButton();
                    App.Ribbon.GotoEditor();
                });
        }
    }

    public Reset()
    {
        this._datasetDisp = null;
        this._geometryOrig = new Hashtable<THREE.Mesh, THREE.Geometry>();
        this._ampFactor = 0;
        this._ampCoeff = 0;
        this._ampStep = 0.2;
    }

    private AnimateMesh()
    {
        var self = this;
        if (!self._isAnimated)
        {
            return;
        }

        var layout = App.Layout;

        if (self._geometryOrig == null || self._geometryOrig.size() == 0)// First iteration
        {
            self._geometryOrig = new Hashtable<THREE.Mesh, THREE.Geometry>();
            self._ampCoeff = 0;
            var offsetEnt = 0;
            for (var idxEnt in self._entIds)
            {
                var entId = self._entIds[idxEnt];
                var mesh = layout.GetMeshById(entId);
                if (mesh == null)
                {
                    MessageBox.ShowError("Mesh not found");
                    return;
                }
                self._geometryOrig.put(mesh, mesh.geometry);

                mesh.geometry = mesh.geometry.clone();

                // Calculate coeff
                var maxValX = 0;
                var maxValY = 0;
                var maxValZ = 0;
                
                var len = mesh.geometry.vertices.length;
                for (var idxNode = 0; idxNode < len; idxNode++)
                {   
                    var nodalRes = self._datasetDisp.NodalResult[idxNode + offsetEnt];
                    var Ux = nodalRes.Values[0];
                    var Uy = nodalRes.Values[1];
                    var Uz = nodalRes.Values[2];
                    maxValX = Math.max(maxValX, Math.abs(Ux));
                    maxValY = Math.max(maxValX, Math.abs(Uy));
                    maxValZ = Math.max(maxValX, Math.abs(Uz));
                }
                mesh.geometry.computeBoundingBox();
                var sizeMesh = mesh.geometry.boundingBox.size();
                // TODO: need made correct coeff
                var ampCoeffCalc: number;
                if (maxValX == 0 && maxValY == 0 && maxValZ == 0)
                {
                    ampCoeffCalc = 0;
                }
                else
                {
                    var minSize = Math.min(sizeMesh.x, sizeMesh.y, sizeMesh.z);
                    ampCoeffCalc = (minSize * 0.05) / Math.max(maxValX, maxValY, maxValZ);// 5% animation - dummy
                }
                self._ampCoeff = Math.max(self._ampCoeff, ampCoeffCalc);

                offsetEnt += mesh.geometry.vertices.length;
            }
        }

        var ampCoeff : number;
        if (self._isRealDisplacement)
        {
            ampCoeff = 1;
        }
        else
        {
            ampCoeff = self._ampCoeff;
        }

        var offsetEnt = 0;
        for (var idxEnt in this._entIds)
        {
            var entId = this._entIds[idxEnt];
            var mesh = layout.GetMeshById(entId);

            var ampFactor = self._ampFactor;

            var destGeom = mesh.geometry;
            var geometryOrig = this._geometryOrig.get(mesh);

            var destVerts = destGeom.vertices;
            var len = mesh.geometry.vertices.length;
            for (var idxNode = 0; idxNode < len; idxNode++)
            {
                var nodalRes = self._datasetDisp.NodalResult[idxNode + offsetEnt];
                var Ux = nodalRes.Values[0];
                var Uy = nodalRes.Values[1];
                var Uz = nodalRes.Values[2];

                var origVert = geometryOrig.vertices[idxNode];
                var destVert = destVerts[idxNode];
                destVert.set(
                    origVert.x + (Ux * ampFactor * ampCoeff),
                    origVert.y + (Uy * ampFactor * ampCoeff),
                    origVert.z + (Uz * ampFactor * ampCoeff)
                    );
            }

            offsetEnt += mesh.geometry.vertices.length;

            mesh.geometry.dynamic = true;
            mesh.geometry.verticesNeedUpdate = true;

            self._ampFactor += self._ampStep;
            if (self._ampFactor > 1)
            {
                // Change direction
                self._ampStep = - self._ampStep;
                self._ampFactor = 1;
            }
            else if (self._ampFactor < 0)
            {
                // Change direction
                self._ampStep = - self._ampStep;
                self._ampFactor = 0;
            }
        }

        setTimeout(function () { self.AnimateMesh() }, 100);
    }

    public StopAnimation()
    {
        var self = this;
        var layout = App.Layout;
        var scene = App.Layout.Scene;

        if (!self._isAnimated)
        {
            // Not animated
            return;
        }

        self._isAnimated = false;

        if (self._geometryOrig != null && self._geometryOrig.size() > 0)
        {
            for (var idxEnt in this._entIds)
            {
                var mesh = layout.GetMeshById(this._entIds[idxEnt]);
                App.Layout.Scene.remove(mesh);
                mesh.geometry = self._geometryOrig.get(mesh);
                App.Layout.Scene.add(mesh);
            }
        }

        self._geometryOrig = null;

        self._btnStart.enableRbButton();
        self._btnStop.disableRbButton();
    }
}


var FEAAnimation: FEAAnimationClass;

$(document).ready(() =>
{
    FEAAnimation = new FEAAnimationClass();
});