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
    function Ball(r, material) {
        var _this = _super.call(this, new THREE.SphereGeometry(r, 24, 18, 0, Math.PI * 2, 0, Math.PI), material) || this;
        _this.deceleration = 65;
        _this.radius = r;
        _this.velocity = new THREE.Vector2(0.0, 0.0);
        _this.castShadow = true;
        _this.receiveShadow = true;
        _this.hit = false;
        return _this;
    }
    Ball.prototype.resetWhiteBall = function (width) {
        this.hit = false;
        this.position.set(-(width / 2) + width / 4, 0, 0);
        this.velocity = new THREE.Vector2(0, 0);
    };
    Ball.prototype.getAngle = function () {
        return this.angle;
    };
    Ball.prototype.setAngle = function (a, speed) {
        this.angle = a;
        this.velocity.x = speed * Math.cos(this.angle * Math.PI / 180);
        this.velocity.y = speed * Math.sin(this.angle * Math.PI / 180);
    };
    Ball.prototype.update = function (delta) {
        if (this.velocity.x != 0 && this.velocity.y != 0 && !this.hit) {
            var length = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (length > delta * this.deceleration) {
                var friction = new THREE.Vector2(this.velocity.x / length, this.velocity.y / length);
                this.velocity.x -= friction.x * delta;
                this.velocity.y -= friction.y * delta;
            }
            else {
                this.velocity = new THREE.Vector2(0, 0);
            }
            this.position.x += this.velocity.x * delta;
            this.position.z += this.velocity.y * delta;
            //dit klopt niet inderdaad maarja
            this.rotation.x += this.velocity.y * delta;
            this.rotation.z -= this.velocity.x * delta;
        }
        else {
            this.velocity = new THREE.Vector2(0, 0);
        }
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
        var distance2 = xd * xd + yd * yd;
        var r = this.radius + ball.radius;
        if (distance2 <= r * r) {
            return true;
        }
        return false;
    };
    Ball.prototype.intersectsWithBox = function (box) {
        var min = this.getBox().min;
        var max = this.getBox().max;
        if (min.x < box.max.x && max.x > box.min.x
            && min.z < box.max.z && max.z > box.min.z) {
            return true;
        }
        return false;
    };
    return Ball;
}(THREE.Mesh));
//# sourceMappingURL=Ball.js.map