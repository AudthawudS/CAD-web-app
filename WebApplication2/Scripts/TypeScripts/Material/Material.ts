/// <reference path="../_reference.d.ts" />

class Material
{
    public Name: string;

    public Density: number;

    public UTS: number;

    public YieldStrength: number;

    public ElasticityModulus: number;

    public RigidityModulus: number;

    public PoissonRatio: number;

    constructor()
    {
        this.Name = "";
        this.Density = 0;
        this.UTS = 0;
        this.YieldStrength = 0;
        this.ElasticityModulus = 0;
        this.RigidityModulus = 0;
        this.PoissonRatio = 0.3;
    }
}