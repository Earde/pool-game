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
var Ball = (function (_super) {
    __extends(Ball, _super);
    function Ball(r) {
        var _this = _super.call(this, new THREE.SphereGeometry(r), new THREE.MeshBasicMaterial({ color: 0xffffff })) || this;
        _this.speed = 5.0;
        _this.angle = 16;
        _this.radius = 0.5;
        _this.radius = r;
        _this.position.x = 0;
        _this.position.y = 0;
        _this.position.z = 0;
        return _this;
    }
    Ball.prototype.update = function (delta) {
        this.position.x += this.speed * Math.cos(this.angle * Math.PI / 180) * delta;
        this.position.z += this.speed * Math.sin(this.angle * Math.PI / 180) * delta;
    };
    Ball.prototype.getBox = function () {
        return new THREE.Box3(new THREE.Vector3(this.position.x - this.radius, this.position.y - this.radius, this.position.z - this.radius), new THREE.Vector3(this.position.x + this.radius, this.position.y + this.radius, this.position.z + this.radius));
    };
    Ball.prototype.getSphere = function () {
        return new THREE.Sphere(this.position, this.radius);
    };
    Ball.prototype.intersectsWithBall = function (ball) {
        var xd = this.position.x - ball.center.x;
        var yd = this.position.y - ball.center.y;
        var distance = Math.sqrt(xd * xd + yd * yd);
        if (distance < this.radius + ball.radius) {
            return true;
        }
        return false;
    };
    Ball.prototype.intersectsWithBox = function (box) {
        var min = this.getBox().min;
        var max = this.getBox().max;
        if (box.max.x <= min.x || box.min.x >= max.x ||
            box.max.y <= min.y || box.min.y >= max.y ||
            box.max.z <= min.z || box.min.z >= max.z) {
            return false;
        }
        return true;
    };
    return Ball;
}(THREE.Mesh));
//# sourceMappingURL=Ball.js.map