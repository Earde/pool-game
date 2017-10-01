///<reference path="../typings/index.d.ts" />
///<reference path="Camera.ts" />
///<reference path="Camera.ts" />
///<reference path="Ball.ts" />
///<reference path="Wall.ts" />
var scene = new THREE.Scene();
var camera = new Camera();
var renderer = new THREE.WebGLRenderer({ antialias: true });
var clock = new THREE.Clock();
var delta = clock.getDelta();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

//balls
var balls = [];
balls[0] = new Ball( 0.5 );
scene.add( balls[0] );
for (var i = 1; i < 5; i++) {
    balls[i] = new Ball( 0.5 );
    scene.add( balls[i] );
    balls[i].position.x = i * 1.10;
    balls[i].angle = i * 16;
}

//table
var table = new Wall(25.3, 8.0, 14.2, 0x00ff00);
scene.add(table);
table.position.x = 0;
table.position.y = -(table.height / 2 + balls[0].radius);
table.position.z = 0;

//wall
var walls = [];
var wallThickness = 0.5;
for (var i = 0; i < 4; i++) {
    walls[i] = new Wall(table.width / 2, balls[0].radius * 2.25, wallThickness, 0xff0000);
    scene.add(walls[i]);
    walls[i].position.y = 0;
}
for (var i = 4; i < 6; i++) {
    walls[i] = new Wall(wallThickness, balls[0].radius * 2.25, table.depth, 0xff0000);
    scene.add(walls[i]);
    walls[i].position.y = 0;
}
//pool table format for walls
walls[0].position.x = -table.width / 4;
walls[0].position.z = -table.depth / 2;
walls[1].position.x = table.width / 4;
walls[1].position.z = -table.depth / 2;
walls[2].position.x = -table.width / 4;
walls[2].position.z = table.depth / 2;
walls[3].position.x = table.width / 4;
walls[3].position.z = table.depth / 2;

walls[4].position.x = -table.width / 2;
walls[4].position.z = 0;
walls[5].position.x = table.width / 2;
walls[5].position.z = 0;

//keyboard
var keyMap = [];
document.addEventListener("keydown", onDocumentKeyDown, true);
document.addEventListener("keyup", onDocumentKeyUp, true);
function onDocumentKeyDown(event) {
    var keyCode = event.keyCode;
    keyMap[keyCode] = true;
}
function onDocumentKeyUp(event){
    var keyCode = event.keyCode;
    keyMap[keyCode] = false;
}

//mouse
var mouseX = 0.0, mouseY = 0.0;
var isMouseDown = false;
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);
function onDocumentMouseMove( event ) {
    if (isMouseDown) {
        mouseX += event.movementX;
        mouseY += event.movementY;
    }
}
function onDocumentMouseDown(event) {
    isMouseDown = true;
}
function onDocumentMouseUp(event) {
    isMouseDown = false;
}

//game
function checkForWallsAndBalls() {
    for (var b = 0; b < balls.length; b++) {
        //check for other balls
        for (var b1 = b + 1; b1 < balls.length; b1++) {
            if (balls[b].intersectsWithBox(balls[b1].getBox())) {
                if (balls[b].intersectsWithBall(balls[b1].getSphere())) {
                    var dx = balls[b].position.x - balls[b1].position.x;
                    var dy = balls[b].position.y - balls[b1].position.y;
                    var g = Math.atan2(dy, dx);
                    balls[b].angle = 180 - g;
                    balls[b1].angle = g + 90;
                    var tempSpeed = balls[b].speed;
                    balls[b].speed = balls[b1].speed;
                    balls[b1].speed = tempSpeed;
                    balls[b].update(delta);
                    balls[b1].update(delta);
                }
            }
        }
        //check for walls
        for (var i = 0; i < walls.length; i++) {
            if (balls[b].intersectsWithBox(walls[i].getBox())) {
                if (i >= 4) {
                    balls[b].angle = 180 - balls[b].angle;
                } else {
                    balls[b].angle = 360 - balls[b].angle;
                }
                balls[b].update(delta);
            }
        }
    }

}

function ProcessGame() {
    delta = clock.getDelta();
    for (var i = 0; i < balls.length; i++) {
        balls[i].update(delta);
    }
    checkForWallsAndBalls();
    camera.update(mouseX, mouseY, balls[0], keyMap , delta);
    //reset mouse movement
    mouseX = 0.0;
    mouseY = 0.0;
}

var render = function() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
    ProcessGame();
}

render();