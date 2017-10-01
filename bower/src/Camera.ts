///<reference path="../typings/index.d.ts" />

class Camera extends THREE.PerspectiveCamera{
    cameraSpeedX: number = 1.0;
    cameraSpeedY: number = 1.0;
    angleX: number = 0.0;
    angleY: number = 90.0;
    radius: number = 20.0;
    minAngleY = 0.0;
    maxAngleY = 180.0;

    constructor() {
        super(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.position.z = 5;
    }

    update(mouseX, mouseY, ball: THREE.Mesh, keyMap: Array<number>, delta) {
        this.angleX -= mouseX * this.cameraSpeedX;
        this.angleY += mouseY * this.cameraSpeedY;
        this.angleY = Math.min( this.maxAngleY, Math.max( this.minAngleY, this.angleY ) );
        camera.position.x = this.radius * Math.sin( this.angleX * Math.PI / 360 )
            * Math.cos( this.angleY * Math.PI / 360 );
        camera.position.y = this.radius * Math.sin( this.angleY * Math.PI / 360 );
        camera.position.z = this.radius * Math.cos( this.angleX * Math.PI / 360 )
            * Math.cos( this.angleY * Math.PI / 360 );
        camera.lookAt(ball.position);
        camera.updateMatrix();
    }
}