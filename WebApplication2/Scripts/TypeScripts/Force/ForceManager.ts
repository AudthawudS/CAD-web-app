/// <reference path="../_reference.d.ts" />
/// <reference path="./ForceEntity.ts" />
/// <reference path="./FixedSymbEntity.ts" />
/// <reference path="../Groups/EntityGroup.ts" />


class ForceManager
{
    public static Update()
    {
        if (!App || !App.Layout)
        {
            return;
        }

        App.Layout.GetEntitiesByType(EntityType.ForceArrow).forEach((ent) =>
        {
            if (!(ent instanceof ForceEntity))
            {
                return;
            }
            (<ForceEntity>ent).Update();
        });

        App.Layout.GetEntitiesByType(EntityType.FixedSymb).forEach((ent) =>
        {
            if (!(ent instanceof FixedSymbEntity))
            {
                return;
            }
            (<FixedSymbEntity>ent).Update();
        });

        App.Layout.GetEntitiesByType(EntityType.MomentSymb).forEach((ent) =>
        {
            if (!(ent instanceof MomentEntity))
            {
                return;
            }
            (<MomentEntity>ent).Update();
        });
    }

    public static Recreate()
    {
        $.getJSON("/Groups/GetGroups",
            function (data, textStatus, jq)
            {
                if (!ErrorHandler.CheckJsonRes(data))
                {
                    return;
                }

                var groups = <Array<EntityGroup>>(data);

                ForceManager.RecreateByGroups(groups);
            });
    }

    public static RecreateByGroups(groups: Array<EntityGroup>)
    {
        // Remove old entities
        //
        ForceManager.RemoveVisualEntities();

        if (groups)
        {
            // Add new forces
            //
            for (var idxGroup in groups)
            {
                var group = groups[idxGroup];

                group.Conditions.forEach((cond) =>
                {
                    if (cond.ConditionType == "BoundConditionNodalLoad")
                    {
                        var loadCond = <BoundConditionNodalLoad>cond;
                        var direction = new THREE.Vector3(loadCond.XDirection, loadCond.YDirection, loadCond.ZDirection);
                        ForceManager.CreateForceArrow(group, direction);
                    }
                    else if (cond.ConditionType == "BoundConditionDisplacement")
                    {
                        var dispCond = <BoundConditionDisplacement>cond;
                        var direction = new THREE.Vector3(dispCond.XDirection, dispCond.YDirection, dispCond.ZDirection);
                        ForceManager.CreateForceArrow(group, direction);
                    }
                    else if (cond.ConditionType == "BoundConditionMoment")
                    {
                        var momentCond = <BoundConditionMoment>cond;
                        ForceManager.CreateMomentSymbol(group, momentCond);
                    }
                    else if (cond.ConditionType == "BoundConditionFixed")
                    {
                        var fixedCond = <BoundConditionFixed>cond;
                        ForceManager.CreateFixedSymbol(group, fixedCond);
                    }
                });
            }
        }
    }

    private static RemoveVisualEntities()
    {
        var forceArrows = App.Layout.GetEntitiesByType(EntityType.ForceArrow);
        forceArrows.forEach((ent) => {
            App.Layout.Scene.remove(ent);
        });

        var fixedSymbs = App.Layout.GetEntitiesByType(EntityType.FixedSymb);
        fixedSymbs.forEach((ent) => {
            App.Layout.Scene.remove(ent);
        });

        var momentSymbs = App.Layout.GetEntitiesByType(EntityType.MomentSymb);
        momentSymbs.forEach((ent) => {
            App.Layout.Scene.remove(ent);
        });
    }

    private static CreateFixedSymbol(group: EntityGroup, fixedCond: BoundConditionFixed)
    {
        // Collect points
        var pointsIdxs = new Array<number>();

        group.Nodes.forEach(function (node)
        {
            pointsIdxs.push(node.Number);
        });

        if (pointsIdxs.length == 0)
        {
            return;
        }

        var baseEnt = App.Layout.GetEntityById(group.FemMeshId);
        if (!baseEnt)
        {
            console.warn("[CreateFixedSymbol] Mesh not found. Mesh Id: " + group.FemMeshId);
            return;
        }
        if (!(baseEnt instanceof THREE.Mesh))
        {
            console.warn("[CreateFixedSymbol] Entity should be have Mesh type. Mesh Id: " + group.FemMeshId);
            return;
        }

        // Calculate arrow size
        //
        var baseMesh = <THREE.Mesh>baseEnt;
        baseMesh.geometry.computeBoundingBox();
        var maxMeshSize = baseMesh.geometry.boundingSphere.radius;
        var arrowSize = Math.min(10, maxMeshSize * 0.03);

        // Create force ent
        //
        var fixedEnt = new FixedSymbEntity(baseMesh, pointsIdxs, arrowSize);
        App.Layout.Scene.add(fixedEnt);

        // Apply settings
        fixedEnt.visible = Settings.IsFixedSymbolEnabled;
    }

    private static CreateForceArrow(group: EntityGroup, direction: THREE.Vector3)
    {
        if (direction.length() == 0)
        {
            // empty direction
            return;
        }

        // Collect points
        var pointsIdxs = new Array<number>();

        group.Nodes.forEach(function (node)
        {
            pointsIdxs.push(node.Number);
        });

        if (pointsIdxs.length == 0)
        {
            return;
        }

        var baseEnt = App.Layout.GetEntityById(group.FemMeshId);
        if (!baseEnt)
        {
            console.warn("[CreateForceArrow] Mesh not found. Mesh Id: " + group.FemMeshId);
            return;
        }
        if (!(baseEnt instanceof THREE.Mesh))
        {
            console.warn("[CreateForceArrow] Entity should be have Mesh type. Mesh Id: " + group.FemMeshId);
            return;
        }

        // Calculate arrow size
        //
        var baseMesh = <THREE.Mesh>baseEnt;
        baseMesh.geometry.computeBoundingBox();
        var maxMeshSize = baseMesh.geometry.boundingSphere.radius;
        var arrowSize = Math.min(10, maxMeshSize * 0.05);

        // Create force ent
        //
        var forceEnt = new ForceEntity(baseMesh, pointsIdxs, direction, arrowSize);
        App.Layout.Scene.add(forceEnt);

        // Apply settings
        forceEnt.visible = Settings.IsLoadArrowsEnabled;
    }

    private static CreateMomentSymbol(group: EntityGroup, loadCondition: BoundConditionMoment) {
        var direction = new THREE.Vector3(loadCondition.XMoment, loadCondition.YMoment, loadCondition.ZMoment);
        if (direction.length() == 0) {
            // empty direction
            return;
        }

        // Collect points
        var pointsIdxs = new Array<number>();

        group.Nodes.forEach(function (node) {
            pointsIdxs.push(node.Number);
        });

        if (pointsIdxs.length == 0) {
            return;
        }

        var baseEnt = App.Layout.GetEntityById(group.FemMeshId);
        if (!baseEnt) {
            console.warn("[CreateMomentSymbol] Mesh not found. Mesh Id: " + group.FemMeshId);
            return;
        }
        if (!(baseEnt instanceof THREE.Mesh)) {
            console.warn("[CreateMomentSymbol] Entity should be have Mesh type. Mesh Id: " + group.FemMeshId);
            return;
        }

        if (!group.ReferencePointId)
        {
            return;
        }
        var refEntObj = App.Layout.GetEntityById(group.ReferencePointId);
        if (!refEntObj)
        {
            console.warn("[CreateMomentSymbol] ReferencePoint not found. Id: " + group.ReferencePointId);
            return;
        }
        if (!(refEntObj instanceof RefPointEntity))
        {
            console.warn("[CreateMomentSymbol] Entity should be have ReferencePoint type. Id: " + group.ReferencePointId);
            return;
        }
        var refEnt = <RefPointEntity>refEntObj;

        // Calculate arrow size
        //
        var baseMesh = <THREE.Mesh>baseEnt;
        baseMesh.geometry.computeBoundingBox();
        var maxMeshSize = baseMesh.geometry.boundingSphere.radius;
        var arrowSize = Math.min(10, maxMeshSize * 0.05);

        // Create moment ent
        //
        var momentEnt = new MomentEntity(baseMesh, refEnt, pointsIdxs, direction, arrowSize);
        App.Layout.Scene.add(momentEnt);

        // Apply settings
        momentEnt.visible = Settings.IsMomentSymbolEnabled;
    }
}