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
var Camera = (function (_super) {
    __extends(Camera, _super);
    function Camera() {
        var _this = _super.call(this, 90, window.innerWidth / window.innerHeight, 0.1, 1000) || this;
        _this.cameraSpeedX = 0.6;
        _this.cameraSpeedY = 0.6;
        _this.angleX = 0.0;
        _this.angleY = 50.0;
        _this.radius = 20.0;
        _this.minAngleY = 20;
        _this.maxAngleY = 70.0;
        return _this;
    }
    Camera.prototype.update = function (ballPos, mouseX, mouseY) {
        this.angleX -= mouseX * this.cameraSpeedX;
        this.angleY += mouseY * this.cameraSpeedY;
        this.angleY = Math.min(this.maxAngleY, Math.max(this.minAngleY, this.angleY));
        camera.position.x = ballPos.x + this.radius * Math.sin(this.angleX * Math.PI / 180)
            * Math.cos(this.angleY * Math.PI / 180);
        camera.position.y = ballPos.y + this.radius * Math.sin(this.angleY * Math.PI / 180);
        camera.position.z = ballPos.z + this.radius * Math.cos(this.angleX * Math.PI / 180)
            * Math.cos(this.angleY * Math.PI / 180);
        camera.lookAt(ballPos);
        camera.updateMatrix();
    };
    Camera.prototype.getCuePosition = function (ballPos, r) {
        var cuePosition = new THREE.Vector3(0, 0, 0);
        cuePosition.x = ballPos.x + r * Math.sin(this.angleX * Math.PI / 180)
            * Math.cos(this.angleY * Math.PI / 180);
        cuePosition.y = ballPos.y + r * Math.sin((this.angleY - 15.0) * Math.PI / 180);
        cuePosition.z = ballPos.z + r * Math.cos(this.angleX * Math.PI / 180)
            * Math.cos(this.angleY * Math.PI / 180);
        return cuePosition;
    };
    return Camera;
}(THREE.PerspectiveCamera));
//# sourceMappingURL=Camera.js.map