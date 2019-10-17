/// <reference path="../_reference.d.ts" />
/// <reference path="../FEA/FRDNode.ts" />

class EntityGroup
{
    public Name: string;

    public FemMeshId: string;

    public Nodes: Array<FRDNode>;

    public ReferencePointId: string;

    public Conditions: Array<BoundCondition>;
}
