///<reference path="../typings/index.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Cue = (function (_super) {
    __extends(Cue, _super);
    function Cue(ballRadius, materialHalf, materialFull) {
        var _this = _super.call(this, new THREE.CylinderGeometry(0.1, 0.35, (10 - ballRadius), 8, 1, false, 0, Math.PI * 2), materialFull) || this;
        _this.cueStartDistance = 10;
        _this.cueMoveDistance = 0;
        _this.cueMoveDistanceMax = 5;
        _this.cueAwayFromBall = 2;
        _this.triggering = false;
        _this.shot = false;
        _this.cuePower = 0;
        _this.cuePowerMax = 40;
        _this.cueTriggeringSpeed = 3;
        _this.cueShotSpeed = 15;
        _this.halfMaterial = materialHalf;
        _this.fullMaterial = materialFull;
        _this.castShadow = true;
        _this.receiveShadow = true;
        _this.isHalf = false;
        _this.oldMaterial = false;
        return _this;
    }
    Cue.prototype.update = function (spacePressed, cuePos, cueBall, cameraPos) {
        if (this.isHalf && !this.oldMaterial) {
            this.oldMaterial = this.isHalf;
            this.material = this.halfMaterial;
            this.material.needsUpdate = true;
        }
        else if (!this.isHalf && this.oldMaterial) {
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
        }
        else if (this.cueMoveDistance > 0 && this.triggering && !spacePressed) {
            this.triggering = false;
            this.shot = true;
            this.cuePower = this.cueMoveDistance / this.cueMoveDistanceMax * this.cuePowerMax;
        }
        else if (this.cueMoveDistance + this.cueAwayFromBall > 0 && this.shot) {
            this.cueMoveDistance -= this.cueShotSpeed * delta;
        }
        else if (this.shot) {
            var collisionAngle = Math.atan2(cueBall.position.z - cameraPos.z, cueBall.position.x - cameraPos.x) * 180 / Math.PI;
            cueBall.setAngle(collisionAngle, this.cuePower);
            this.cuePower = 0;
            this.cueMoveDistance = 0;
            this.triggering = false;
            this.shot = false;
        }
    };
    return Cue;
}(THREE.Mesh));
//# sourceMappingURL=Cue.js.map