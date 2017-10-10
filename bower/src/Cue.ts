///<reference path="../typings/index.d.ts" />

class Cue extends THREE.Mesh {
    cueStartDistance = 12;
    cueMoveDistance = 0;
    cueMoveDistanceMax = 5;
    cueAwayFromBall = 2;
    triggering = false;
    shot = false;
    cuePower = 0;
    cuePowerMax = 15;
    cueTriggeringSpeed = 3;
    cueShotSpeed = 20;

    constructor(ballRadius: number, material: THREE.Material) {
        super(new THREE.CylinderGeometry(0.1, 0.35, (12 - ballRadius), 8, 1, false, 0, Math.PI * 2), material);
        this.position.x = 0;
        this.position.y = 0;
        this.position.z = 0;
        this.castShadow = true;
        this.receiveShadow = true;
    }

    update(spacePressed: boolean, cuePos: THREE.Vector3, cueBallPos: THREE.Vector3, cameraPos: THREE.Vector3) {
        cue.visible = true;
        cue.position.set(cuePos.x, cuePos.y, cuePos.z);
        cue.lookAt(new THREE.Vector3(cueBallPos.x, cueBallPos.y - balls[0].radius / 3, balls[0].position.z));
        cue.rotateX(Math.PI / 2);
        cue.updateMatrix();
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
            var collisionAngle = Math.atan2(cueBallPos.z - cameraPos.z, cueBallPos.x - cameraPos.x) * 180 / Math.PI;
            balls[0].setAngle(collisionAngle, this.cuePower);
            this.cuePower = 0;
            this.cueMoveDistance = 0;
            this.triggering = false;
            this.shot = false;
        }
    }
}