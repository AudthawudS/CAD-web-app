/// <reference path="../_reference.d.ts" />

class MeshingImproveOptions
{
    public SmoothType: number;

    public Optimization: boolean;

    public AllowRefinement: boolean;

    // Enable/disable modification of boundary layers.
    // 
    public ModifyBL: boolean;

    // Relative size
    public MinRefinementSize: number;

    // Sets the mesh size gradation rate for improvement refinement.
    // Gradation rate, 0 < rate <= 1.0, default value is (2/3).
    // If enabled, the volume mesh improver can perform stack splits, swaps, 
    // and collapses on boundary layers when improving the mesh or refining mesh size for shape.
    public GradationRate: number;

    // Triangle or tetrahedral aspect ratio is a non-dimensional parameter with a normalized range 1.0 (equilateral best case) — ∞ (degenerate) 
    // The default values are 12.0 for tetrahedra, and 6.0 for triangles. 
    public MetricAspectRatio: number;

    constructor()
    {
        this.AllowRefinement = true;
        this.SmoothType = 0;
        this.Optimization = true;
        this.ModifyBL = false;
        this.MinRefinementSize = 0.1;
        this.GradationRate = 0.66;
        this.MetricAspectRatio = 12;
    }

}