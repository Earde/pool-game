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
        this.position.x = 0;
        this.position.y = 0;
        this.position.z = 0;
        this.castShadow = false;
        this.receiveShadow = true;
    }
}