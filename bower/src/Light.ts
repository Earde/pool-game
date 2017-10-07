///<reference path="../typings/index.d.ts" />

class Light extends THREE.PointLight{
    constructor(x: number, y: number, z: number, color: number) {
        super(color, 0.25, 0, 2);
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
        this.shadow.mapSize = new THREE.Vector2(2048, 2048);
        this.castShadow = true;
        this.receiveShadow = false;
        this.shadow.bias = -0.0001;
    }
}