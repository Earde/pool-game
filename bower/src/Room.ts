///<reference path="../typings/index.d.ts" />

class Room extends THREE.Mesh{
    width: number;
    height: number;
    depth: number;

    constructor(w: number, h: number, d: number, material: THREE.Material) {
        super(new THREE.BoxGeometry(w, h, d), material);
        this.width = w;
        this.height = h;
        this.depth = d;
        this.castShadow = false;
        if (material.type == new THREE.MeshPhongMaterial().type) {
            this.receiveShadow = true;
        } else {
            this.receiveShadow = false;
        }
    }
}