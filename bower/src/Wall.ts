///<reference path="../typings/index.d.ts" />

class Wall extends THREE.Mesh{
    width: number = 0.5;
    height: number = 0.5;
    depth: number = 0.5;

    constructor(w: number, h: number, d: number, color: number) {
        super(new THREE.BoxGeometry(w, h, d), new THREE.MeshBasicMaterial( { color: color } ));
        this.width = w;
        this.height = h;
        this.depth = d;
        this.position.x = 0;
        this.position.y = 0;
        this.position.z = 0;
    }

    getBox() {
        return new THREE.Box3(new THREE.Vector3(this.position.x - this.width / 2, this.position.y - this.height / 2, this.position.z - this.depth / 2),
            new THREE.Vector3(this.position.x + this.width / 2, this.position.y + this.height / 2, this.position.z + this.depth / 2))
    }

    intersectsWithBox(box: THREE.Box3) {
        var min = this.getBox().min;
        var max = this.getBox().max;
        if ( box.max.x <= min.x || box.min.x >= max.x ||
            box.max.y <= min.y || box.min.y >= max.y ||
            box.max.z <= min.z || box.min.z >= max.z ) {
            return false;
        }
        return true;
    }
}