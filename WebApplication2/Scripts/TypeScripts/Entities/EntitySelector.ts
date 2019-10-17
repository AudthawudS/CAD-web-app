/// <reference path="../_reference.d.ts" />

class EntitySelectorClass
{
    public GetEntities(skipSystems: boolean): Array<THREE.Object3D>
    {
        var outItems = new Array<THREE.Object3D>();
        var scene = App.Layout.Scene;

        for (var i = 0; i < scene.children.length; i++)
        {
            var obj3d = scene.children[i];
            var ent = (<any>obj3d);
            if (ent.geometry == undefined)
            {
                continue;
            }
            if (skipSystems)
            {
                if (IsObjectData(obj3d.userData))
                {
                    var objData = (<ObjectData>obj3d.userData);
                    if (objData.IsSystem)
                    {
                        continue;
                    }
                }
            }

            outItems.push(obj3d);
        }

        return outItems;
    }

    public GetEntitiesByType(entType: EntityType)
    {
        var outItems = new Array<THREE.Object3D>();
        var scene = App.Layout.Scene;

        for (var i = 0; i < scene.children.length; i++)
        {
            var obj3d = scene.children[i];
            var ent = (<any>obj3d);
            var objData = GetObjectData(obj3d);
            if (objData == null)
            {
                continue;
            }
            if (objData.EntityType != entType)
            {
                continue;
            }
            outItems.push(obj3d);
        }

        return outItems;
    }

    public GetEntityById(id: string): THREE.Object3D
    {
        var scene = App.Layout.Scene;

        for (var i = 0; i < scene.children.length; i++)
        {
            var obj3d = scene.children[i];
            if(obj3d.uuid == id)
            {
                return obj3d;
            }
        }

        return null;
    }
}

var EntitySelector = new EntitySelectorClass();