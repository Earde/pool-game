///<reference path="../typings/index.d.ts" />

class Ball extends THREE.Mesh{
    public velocity: THREE.Vector2;

    private angle: number;
    private radius: number;

    private deceleration: number = 65;

    hit: boolean;

    constructor(r: number, material) {
        super(new THREE.SphereGeometry(r, 24, 18, 0, Math.PI * 2, 0, Math.PI), material);
        this.radius = r;
        this.velocity = new THREE.Vector2(0.0, 0.0);
        this.castShadow = true;
        this.receiveShadow = true;
        this.hit = false;
    }

    resetWhiteBall(width) {
        this.hit = false;
        this.position.set(-(width / 2) + width / 4, 0, 0);
        this.velocity = new THREE.Vector2(0, 0);
    }

    getAngle() {
        return this.angle;
    }

    setAngle(a: number, speed: number) {
        this.angle = a;
        this.velocity.x = speed * Math.cos( this.angle * Math.PI / 180 );
        this.velocity.y = speed * Math.sin( this.angle * Math.PI / 180 );
    }

    update(delta) {
        if (this.velocity.x != 0 && this.velocity.y != 0 && !this.hit) {
            var length = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (length > delta * this.deceleration) {
                var friction = new THREE.Vector2(this.velocity.x / length, this.velocity.y / length);
                this.velocity.x -= friction.x * delta;
                this.velocity.y -= friction.y * delta;
            } else {
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
    }

    getBox() {
        return new THREE.Box3(new THREE.Vector3(this.position.x - this.radius, this.position.y - this.radius, this.position.z - this.radius),
            new THREE.Vector3(this.position.x + this.radius, this.position.y + this.radius, this.position.z + this.radius))
    }

    getSphere() {
        return new THREE.Sphere(this.position, this.radius);
    }

    intersectsWithBall(ball: THREE.Sphere) {
        var xd = this.position.x - ball.center.x;
        var yd = this.position.y - ball.center.y;
        var distance2 = xd * xd + yd * yd;
        var r = this.radius + ball.radius;
        if (distance2 <= r * r) {
            return true;
        }
        return false;
    }

    intersectsWithBox(box: THREE.Box3) {
        var min = this.getBox().min;
        var max = this.getBox().max;
        if (min.x < box.max.x &&  max.x > box.min.x
        && min.z < box.max.z && max.z > box.min.z) {
            return true;
        }
        return false;
    }
}