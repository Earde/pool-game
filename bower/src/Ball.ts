///<reference path="../typings/index.d.ts" />

class Ball extends THREE.Mesh{
    public velocity: THREE.Vector2;

    private angle: number = 1;
    private radius: number = 0.5;

    constructor(r: number, color: number) {
        super(new THREE.SphereGeometry(r), new THREE.MeshBasicMaterial( { color: color } ));
        this.radius = r;
        this.velocity = new THREE.Vector2(0.0, 0.0);
        this.position.x = 0;
        this.position.y = 0;
        this.position.z = 0;
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
        this.position.x += this.velocity.x * delta;
        this.position.z += this.velocity.y * delta;
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
        var distance = Math.sqrt(xd * xd + yd * yd);
        if (distance < this.radius + ball.radius) {
            return true;
        }
        return false;
    }

    intersectsWithBox(box: THREE.Box3) {
        var min = this.getBox().min;
        var max = this.getBox().max;
        if ( box.max.x <= min.x || box.min.x >= max.x ||
            box.max.y <= min.y || box.min.y >= max.y ||
            box.max.z <= min.z || box.min.z >= max.z ) {
            return false;
        }
        return true;
    }
}