/// <reference path="../_reference.d.ts" />

 class EntityMatrix
 {
     elements: Array<number>;

     constructor()
     {
         // Create ident elements
         var mat = new THREE.Matrix4();
         mat.identity();
         var elementsArr = Array.prototype.slice.call(mat.elements);// Float32 to array
         this.elements = elementsArr; 
     }

     public static Create(mat: THREE.Matrix4): EntityMatrix
     {
         var elementsArr = Array.prototype.slice.call(mat.elements);// Float32 to array
         var outMat = new EntityMatrix();
         outMat.elements = elementsArr;
         return outMat;
     }

     public ToMatrix4() : THREE.Matrix4
     {
         var thMat = new THREE.Matrix4();
         thMat.elements = new Float32Array(this.elements);
         return thMat;
     }
 }