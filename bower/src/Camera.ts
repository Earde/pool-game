///<reference path="../typings/index.d.ts" />

class Camera extends THREE.PerspectiveCamera{
    cameraSpeedX: number = 0.6;
    cameraSpeedY: number = 0.6;
    angleX: number = 0.0;
    angleY: number = 50.0;
    radius: number = 20.0;
    minAngleY = 20;
    maxAngleY = 70.0;

    constructor() {
        super(90, window.innerWidth / window.innerHeight, 0.1, 1000);
    }

    update(ballPos: THREE.Vector3, mouseX, mouseY) {
        this.angleX -= mouseX * this.cameraSpeedX;
        this.angleY += mouseY * this.cameraSpeedY;
        this.angleY = Math.min( this.maxAngleY, Math.max( this.minAngleY, this.angleY ) );
        camera.position.x = ballPos.x + this.radius * Math.sin( this.angleX * Math.PI / 180 )
            * Math.cos( this.angleY * Math.PI / 180 );
        camera.position.y = ballPos.y + this.radius * Math.sin( this.angleY * Math.PI / 180 );
        camera.position.z = ballPos.z + this.radius * Math.cos( this.angleX * Math.PI / 180 )
            * Math.cos( this.angleY * Math.PI / 180 );
        camera.lookAt(ballPos);
        camera.updateMatrix();
    }

    getCuePosition(ballPos: THREE.Vector3, r: number) {
        var cuePosition = new THREE.Vector3(0, 0, 0);
        cuePosition.x = ballPos.x + r * Math.sin( this.angleX * Math.PI / 180 )
            * Math.cos( this.angleY * Math.PI / 180 );
        cuePosition.y = ballPos.y + r * Math.sin( (this.angleY - 15.0) * Math.PI / 180 );
        cuePosition.z = ballPos.z + r * Math.cos( this.angleX * Math.PI / 180 )
            * Math.cos( this.angleY * Math.PI / 180 );
        return cuePosition;
    }
}