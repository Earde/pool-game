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
        _this.cameraSpeedX = 1.0;
        _this.cameraSpeedY = 1.0;
        _this.angleX = 0.0;
        _this.angleY = 90.0;
        _this.radius = 20.0;
        _this.minAngleY = 15;
        _this.maxAngleY = 150.0;
        _this.position.z = 5;
        return _this;
    }
    Camera.prototype.update = function (mouseX, mouseY, ball, keyMap, delta) {
        this.angleX -= mouseX * this.cameraSpeedX;
        this.angleY += mouseY * this.cameraSpeedY;
        this.angleY = Math.min(this.maxAngleY, Math.max(this.minAngleY, this.angleY));
        camera.position.x = this.radius * Math.sin(this.angleX * Math.PI / 360)
            * Math.cos(this.angleY * Math.PI / 360);
        camera.position.y = this.radius * Math.sin(this.angleY * Math.PI / 360);
        camera.position.z = this.radius * Math.cos(this.angleX * Math.PI / 360)
            * Math.cos(this.angleY * Math.PI / 360);
        camera.lookAt(ball.position);
        camera.updateMatrix();
    };
    return Camera;
}(THREE.PerspectiveCamera));
//# sourceMappingURL=Camera.js.map