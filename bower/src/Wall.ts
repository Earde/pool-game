///<reference path="../typings/index.d.ts" />

class Wall extends THREE.Mesh{
    width: number;
    height: number;
    depth: number;

    constructor(w: number, h: number, d: number, material: THREE.Material) {
        super(new THREE.BoxGeometry(w, h, d), material);
        this.width = w;
        this.height = h;
        this.depth = d;
        this.castShadow = true;
        this.receiveShadow = true;
    }

    getBox() {
        return new THREE.Box3(new THREE.Vector3(this.position.x - this.width / 2, this.position.y - this.height / 2, this.position.z - this.depth / 2),
            new THREE.Vector3(this.position.x + this.width / 2, this.position.y + this.height / 2, this.position.z + this.depth / 2))
    }
}