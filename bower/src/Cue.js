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
var Cue = /** @class */ (function (_super) {
    __extends(Cue, _super);
    function Cue(ballRadius, material) {
        var _this = _super.call(this, new THREE.CylinderGeometry(0.1, 0.35, (10 - ballRadius), 8, 1, false, 0, Math.PI * 2), material) || this;
        _this.cueStartDistance = 10;
        _this.cueMoveDistance = 0;
        _this.cueMoveDistanceMax = 5;
        _this.cueAwayFromBall = 2;
        _this.triggering = false;
        _this.shot = false;
        _this.cuePower = 0;
        _this.cuePowerMax = 15;
        _this.cueTriggeringSpeed = 3;
        _this.cueShotSpeed = 20;
        _this.player = 0;
        _this.playerMax = 2;
        _this.position.x = 0;
        _this.position.y = 0;
        _this.position.z = 0;
        _this.castShadow = true;
        _this.receiveShadow = true;
        return _this;
    }
    Cue.prototype.update = function (spacePressed, cuePos, cueBallPos, cameraPos) {
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
            var collisionAngle = Math.atan2(cueBallPos.z - cameraPos.z, cueBallPos.x - cameraPos.x) * 180 / Math.PI;
            balls[0].setAngle(collisionAngle, this.cuePower);
            this.cuePower = 0;
            this.cueMoveDistance = 0;
            this.triggering = false;
            this.shot = false;
            if (this.player >= this.playerMax) {
                this.player++;
            }
            else {
                this.player = 0;
            }
        }
    };
    return Cue;
}(THREE.Mesh));
//# sourceMappingURL=Cue.js.map