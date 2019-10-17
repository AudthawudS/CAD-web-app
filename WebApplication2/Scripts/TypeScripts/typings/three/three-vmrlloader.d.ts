/// <reference path="./three.d.ts" />

declare module THREE
{
    class VRMLLoader
    {
        load(type: string, listener: (sc: THREE.Scene) => void ): void;
    }
}