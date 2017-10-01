///<reference path="../typings/index.d.ts" />

class Ball extends THREE.Mesh{
    speed: number = 5.0;
    angle: number = 16;
    radius: number = 0.5;

    constructor(r: number) {
        super(new THREE.SphereGeometry(r), new THREE.MeshBasicMaterial( { color: 0xffffff } ));
        this.radius = r;
        this.position.x = 0;
        this.position.y = 0;
        this.position.z = 0;
    }

    update(delta) {
        this.position.x += this.speed * Math.cos( this.angle * Math.PI / 180 ) * delta;
        this.position.z += this.speed * Math.sin( this.angle * Math.PI / 180 ) * delta;
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