///<reference path="../typings/index.d.ts" />
///<reference path="Camera.ts" />
///<reference path="Camera.ts" />
///<reference path="Ball.ts" />
///<reference path="Wall.ts" />
var Vector2 = THREE.Vector2;
//Three.js init
var scene = new THREE.Scene();
var camera = new Camera();
var renderer = new THREE.WebGLRenderer({ antialias: true });
var clock = new THREE.Clock();
var delta = clock.getDelta();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//balls
var balls = [];
balls[0] = new Ball(0.5, 0xffffff);
scene.add(balls[0]);
for (var i = 1; i < 5; i++) {
    balls[i] = new Ball(0.5, 0x0000ff);
    scene.add(balls[i]);
    balls[i].position.x = i * 2.10;
    balls[i].setAngle(i * 30, 12.5);
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
function onDocumentKeyUp(event) {
    var keyCode = event.keyCode;
    keyMap[keyCode] = false;
}
//mouse
var mouseX = 0.0, mouseY = 0.0;
var isMouseDown = false;
document.addEventListener('mousedown', onDocumentMouseDown, false);
document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('mouseup', onDocumentMouseUp, false);
function onDocumentMouseMove(event) {
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
//game functions
function checkForWallsAndBalls() {
    for (var b = 0; b < balls.length; b++) {
        //check for other balls
        for (var b1 = b + 1; b1 < balls.length; b1++) {
            if (balls[b].intersectsWithBox(balls[b1].getBox())) {
                if (balls[b].intersectsWithBall(balls[b1].getSphere())) {
                    //http://jsfiddle.net/inkfood/juzsR/
                    //https://blogs.msdn.microsoft.com/faber/2013/01/09/elastic-collisions-of-balls/
                    //calculate collision angle + speed of ball
                    var collisionAngle = Math.atan2(balls[b1].position.y - balls[b].position.y, balls[b1].position.x - balls[b].position.x);
                    var speed1 = Math.sqrt(balls[b].x * balls[b].x + balls[b].y * balls[b].y);
                    var speed2 = Math.sqrt(balls[b1].x * balls[b1].x + balls[b1].y * balls[b1].y);
                    var direction1 = Math.atan2(balls[b].velocity.y, balls[b].velocity.x);
                    var direction2 = Math.atan2(balls[b1].velocity.y, balls[b1].velocity.x);
                    var newSpeedX1 = speed1 * Math.cos(direction1 - collisionAngle);
                    var newSpeedY1 = speed1 * Math.sin(direction1 - collisionAngle);
                    var newSpeedX2 = speed2 * Math.cos(direction2 - collisionAngle);
                    var newSpeedY2 = speed2 * Math.sin(direction2 - collisionAngle);
                    //possible to include mass of ball here
                    var finalSpeedX1 = newSpeedX2;
                    var finalSpeedX2 = newSpeedX1;
                    var finalSpeedY1 = newSpeedY1;
                    var finalSpeedY2 = newSpeedY2;
                    //calculate new velocities
                    var cosAngle = Math.cos(collisionAngle);
                    var sinAngle = Math.sin(collisionAngle);
                    balls[b].velocity.x = cosAngle * finalSpeedX1 - sinAngle * finalSpeedY1;
                    balls[b].velocity.y = sinAngle * finalSpeedX1 + cosAngle * finalSpeedY1;
                    balls[b1].velocity.x = cosAngle * finalSpeedX2 - sinAngle * finalSpeedY2;
                    balls[b1].velocity.y = sinAngle * finalSpeedX2 + cosAngle * finalSpeedY2;
                    //push ball away from each other so they don't collide immediately again
                    var difference = new THREE.Vector2(balls[b].position.x - balls[b1].position.x, balls[b].position.y - balls[b1].position.y);
                    var length = Math.sqrt(difference.x * difference.x + difference.y * difference.y);
                    var translation = ((balls[b].radius + balls[b1].radius) - length) / length;
                    var mtd = new THREE.Vector2(difference.x * translation * 0.5, difference.y * translation * 0.5);
                    balls[b].position.x += mtd.x;
                    balls[b].position.y += mtd.y;
                    balls[b1].position.x -= mtd.x;
                    balls[b1].position.y -= mtd.y;
                }
            }
        }
        //check for walls and bounce back if colliding
        for (var i = 0; i < walls.length; i++) {
            if (balls[b].intersectsWithBox(walls[i].getBox())) {
                if (i >= 4) {
                    balls[b].velocity.x = -balls[b].velocity.x;
                }
                else {
                    balls[b].velocity.y = -balls[b].velocity.y;
                }
                balls[b].update(delta);
            }
        }
    }
}
//game handler
function ProcessGame() {
    delta = clock.getDelta();
    //move balls based on time between frames
    for (var i = 0; i < balls.length; i++) {
        balls[i].update(delta);
    }
    checkForWallsAndBalls();
    //hold mouse button to move camera
    camera.update(mouseX, mouseY, balls[0], keyMap, delta);
    //reset mouse movement
    mouseX = 0.0;
    mouseY = 0.0;
}
//loop function for drawing + game process
var render = function () {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    ProcessGame();
};
render();
//# sourceMappingURL=game.js.map