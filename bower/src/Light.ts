///<reference path="../typings/index.d.ts" />

class Light extends THREE.PointLight{
    constructor(color: number, intensity: number) {
        //super(color, 5, 0, Math.PI / 3, 0, 2); spotlight
        super(color, intensity, 0, 2);
        this.lookAt(new THREE.Vector3(0, 0, 0));
        this.shadow.mapSize = new THREE.Vector2(2048, 2048);
        this.castShadow = true;
        this.receiveShadow = false;
        this.shadow.bias = -0.0001;
    }
}