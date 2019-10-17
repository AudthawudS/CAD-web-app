/// <reference path="./three.d.ts" />

declare module THREE
{
    class STLLoader
    {
        load(type: string, listener: (geometry: THREE.Geometry) => void ): void;
    }
}