/// <reference path="../_reference.d.ts" />

interface SelectionItem
{
    EntityId: string;

    MatchTag: number;

    SelectionType : SelectionType;

    GetId(): string;

    GetCenter(geometry: THREE.Geometry): THREE.Vector3;
}