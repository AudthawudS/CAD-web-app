/// <reference path="../_reference.d.ts" />
var MeshingHelp = /** @class */ (function () {
    function MeshingHelp() {
    }
    MeshingHelp.Help = function (content) {
        var text = null;
        if (content == "MeshingSize") {
            text = "Sets the mesh size on the given model entity (1-50%)";
        }
        else if (content == "Refinement") {
            text = "Allows to refine the mesh below the specified mesh size to satisfy the specified mesh shape metrics.";
        }
        else if (content == "MetricAspectRatio") {
            text = "Triangle or tetrahedral aspect ratio is a non-dimensional parameter with a normalized range 1.0 (equilateral best case) — ∞ (degenerate)<br/>" +
                "The default values are 12.0 for tetrahedra<br/>" +
                "<img src='/Images/HelpMetricAspectRatio.png' />";
        }
        else if (content == "ProximityMeshSize") {
            text = "Performs isotropic refinement of the surface mesh in volume thin-section areas.<br/>" +
                "This feature is used to automatically refine the surface mesh in areas determined to be thin through the volume. It is part of the Surface Meshing process and is not a post-refinement step. <br/>" +
                "<img src='/Images/HelpMeshingProximitySize.png' />";
        }
        else if (content == "SmoothType") {
            text = "Sets the smoothing algorithm type for surface mesh improvement.<br/>" +
                "There are two different algorithms that can be used for vertex motion during smoothing.<br/>" +
                "The first algorithm, Laplacian-based, will move vertices to the centroid of the adjacent vertices.<br/>" +
                "The second algorithm, Gradient - based, will move vertices in the direction that most improves the shape metric.This algorithm will generally produce better results, but at some performance cost.";
        }
        else if (content == "Optimization") {
            text = "Turns on/off topological optimization during surface mesh improvement. ";
        }
        else if (content == "ModifyBL") {
            text = "Enable/disable modification of 2D boundary layers.<br/>" +
                "If enabled, the surface mesh improver can perform stack splits and collapses on 2D boundary layers when improving the mesh or refining mesh size for shape.<br/>" +
                "Poorly shaped elements just above the boundary layer mesh may not be optimized or refined to meet a shape metric criteria unless the entire boundary layer stack is locally affected.";
        }
        else if (content == "MinRefinementSize") {
            text = "Allows the mesh improver to refine the mesh to meet the specified criteria.<br/>" +
                "If this function is called, the mesh improver will be permitted to refine the mesh in areas where required to meet the specified criteria.<br/>" +
                "The size passed in is the minimum size to which the mesh will be refined.<br/>" +
                "Range: 0 < size < 1.0";
        }
        else if (content == "GradationRate") {
            text = "Sets the mesh size gradation rate for improvement refinement.<br/>" +
                "In order to meet the shape metric criteria, the surface mesh improver may locally refine the mesh. This control sets the gradation rate from the refined entities.<br/>" +
                "Range: 0 < rate < 1.0 <br/>" +
                "<img src='/Images/HelpGradationRate.png' />";
        }
        if (!text) {
            return;
        }
        HelpBox.ShowHelp(text);
    };
    return MeshingHelp;
}());
