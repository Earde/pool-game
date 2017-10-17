///<reference path="../typings/index.d.ts" />

class Cue extends THREE.Mesh {
    cueStartDistance = 10;
    cueMoveDistance = 0;
    cueMoveDistanceMax = 5;
    cueAwayFromBall = 2;
    triggering = false;
    shot = false;
    cuePower = 0;
    cuePowerMax = 40;
    cueTriggeringSpeed = 3;
    cueShotSpeed = 15;
    isHalf: boolean;
    oldMaterial: boolean;
    halfMaterial: THREE.Material;
    fullMaterial: THREE.Material;

    constructor(ballRadius: number, materialHalf: THREE.Material, materialFull: THREE.Material) {
        super(new THREE.CylinderGeometry(0.1, 0.35, (10 - ballRadius), 8, 1, false, 0, Math.PI * 2), materialFull);
        this.halfMaterial = materialHalf;
        this.fullMaterial = materialFull;
        this.castShadow = true;
        this.receiveShadow = true;
        this.isHalf = false;
        this.oldMaterial = false;
    }

    update(spacePressed: boolean, cuePos: THREE.Vector3, cueBall, cameraPos: THREE.Vector3) {
        if (this.isHalf && !this.oldMaterial) {
            this.oldMaterial = this.isHalf;
            this.material = this.halfMaterial;
            this.material.needsUpdate = true;
        } else if (!this.isHalf && this.oldMaterial) {
            this.oldMaterial = this.isHalf;
            this.material = this.fullMaterial;
            this.material.needsUpdate = true;
        }
        this.visible = true;
        this.position.set(cuePos.x, cuePos.y, cuePos.z);
        this.lookAt(new THREE.Vector3(cueBall.position.x, cueBall.position.y - cueBall.radius / 3, cueBall.position.z));
        this.rotateX(Math.PI / 2);
        this.updateMatrix();
        if (!this.shot && spacePressed) {
            this.triggering = true;
            this.cueMoveDistance += this.cueTriggeringSpeed * delta;
            if (this.cueMoveDistance > this.cueMoveDistanceMax) {
                this.cueMoveDistance = this.cueMoveDistanceMax;
            }
        } else if (this.cueMoveDistance > 0 && this.triggering && !spacePressed) {
            this.triggering = false;
            this.shot = true;
            this.cuePower = this.cueMoveDistance / this.cueMoveDistanceMax * this.cuePowerMax;
        } else if (this.cueMoveDistance + this.cueAwayFromBall > 0 && this.shot) {
            this.cueMoveDistance -= this.cueShotSpeed * delta;
        } else if (this.shot) {
            var collisionAngle = Math.atan2(cueBall.position.z - cameraPos.z, cueBall.position.x - cameraPos.x) * 180 / Math.PI;
            cueBall.setAngle(collisionAngle, this.cuePower);
            this.cuePower = 0;
            this.cueMoveDistance = 0;
            this.triggering = false;
            this.shot = false;
        }
    }
}