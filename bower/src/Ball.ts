///<reference path="../typings/index.d.ts" />

class Ball extends THREE.Mesh{
    public velocity: THREE.Vector2;
    public mass: number;

    private angle: number;
    private radius: number;

    private deceleration: number = 75;


    constructor(r: number, color: number) {
        super(new THREE.SphereGeometry(r), new THREE.MeshPhongMaterial( { color: color } ));
        this.radius = r;
        this.velocity = new THREE.Vector2(0.0, 0.0);
        this.position.x = 0;
        this.position.y = 0;
        this.position.z = 0;
        this.angle = 0.0;
        this.castShadow = true;
        this.receiveShadow = true;
    }

    getAngle() {
        return this.angle;
    }

    setAngle(a: number, speed: number) {
        this.angle = a;
        this.velocity.x = speed * Math.cos( this.angle * Math.PI / 180 );
        this.velocity.y = speed * Math.sin( this.angle * Math.PI / 180 );
    }

    update(delta){
        this.position.x += this.velocity.x * delta;
        this.position.z += this.velocity.y * delta;
        var length = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
        if (length > delta * this.deceleration) {
            var friction = new THREE.Vector2(this.velocity.x / length, this.velocity.y / length);
            this.velocity.x -= friction.x * delta;
            this.velocity.y -= friction.y * delta;
        } else {
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
        var distance = Math.sqrt(xd * xd + yd * yd);
        if (distance < this.radius + ball.radius) {
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