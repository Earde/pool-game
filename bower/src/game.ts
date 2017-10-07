///<reference path="../typings/index.d.ts" />
///<reference path="Camera.ts" />
///<reference path="Camera.ts" />
///<reference path="Ball.ts" />
///<reference path="Wall.ts" />
///<reference path="Light.ts" />

//Three.js init
var scene = new THREE.Scene();
var camera = new Camera();
var renderer = new THREE.WebGLRenderer({ antialias: true });
var clock = new THREE.Clock();
var delta = clock.getDelta();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );
//balls
var balls = [];
balls[0] = new Ball( 0.5, 0xffffff);
balls[0].position.x = -2;
balls[0].position.z = -0.5;
//balls[0].setAngle(0, 10);
scene.add( balls[0] );
for (var i = 1; i < 5; i++) {
    balls[i] = new Ball( 0.5, 0x0000ff);
    scene.add( balls[i] );
    balls[i].position.x = i * 2.10;
    balls[i].position.z = i * 0.5;
    //balls[i].setAngle(i * 60, 5);
}

//table
var table = new Wall(25.3, 8.0, 14.2, 0x00ff00);
scene.add(table);
table.position.x = 0;
table.position.y = -(table.height / 2 + balls[0].radius);
table.position.z = 0;

//wall
var walls = [];
var wallThickness = 1;
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

//light
var ambLight = new THREE.AmbientLight(0xffffff, 0.65);
scene.add(ambLight);
var lightHeight = 10;
var lights = [];
for (var i = 0; i < 4; i++) {
    lights[i] = new Light(0, 0, 0, 0xfff1e0);
    scene.add(lights[i]);
}
var lightFromTable = 1.25;
lights[0].position.set(-table.depth * lightFromTable, lightHeight, -table.depth * lightFromTable);
lights[1].position.set(-table.depth * lightFromTable, lightHeight, table.depth * lightFromTable);
lights[2].position.set(table.depth * lightFromTable, lightHeight, table.depth * lightFromTable );
lights[3].position.set(table.depth * lightFromTable, lightHeight, -table.depth * lightFromTable);

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

//game functions
function checkForWallsAndBalls() {
    for (var b = 0; b < balls.length; b++) {
        //check for walls and bounce back if colliding
        for (var i = 0; i < walls.length; i++) {
            if (balls[b].intersectsWithBox(walls[i].getBox(), i)) {
                if (i >= 4) {
                    balls[b].velocity.x *= -1;
                } else {
                    balls[b].velocity.y *= -1;
                }
                balls[b].update(delta);
            }
        }
        //check for other balls
        for (var b1 = b + 1; b1 < balls.length; b1++) {
            if (balls[b].intersectsWithBox(balls[b1].getBox())) {
                if (balls[b].intersectsWithBall(balls[b1].getSphere())) {
                    var difference = new THREE.Vector2(balls[b].position.x - balls[b1].position.x, balls[b].position.z - balls[b1].position.z);
                    var length = Math.sqrt(difference.x * difference.x + difference.y * difference.y);
                    var translation = ((balls[b].radius + balls[b1].radius) - length) / length;
                    var mtd = new THREE.Vector2(difference.x * translation, difference.y * translation);
                    balls[b].position.x += mtd.x;
                    balls[b].position.z += mtd.y;
                    balls[b1].position.x -= mtd.x;
                    balls[b1].position.z -= mtd.y;
                    var v = new THREE.Vector2(balls[b].velocity.x - balls[b1].velocity.x, balls[b].velocity.y - balls[b1].velocity.y);
                    var mtdLength = Math.sqrt(mtd.x * mtd.x + mtd.y * mtd.y);
                    var mtdNormal = new THREE.Vector2(mtd.x / mtdLength, mtd.y / mtdLength);
                    var vn = v.x * mtdNormal.x + v.y * mtdNormal.y;
                    //moving away already
                    if (vn > 0.0) {
                        continue;
                    }
                    var constantRestitution = 0.85;
                    var impulse = new THREE.Vector2(-(1.0 + constantRestitution) * vn / 2 * mtdNormal.x, -(1.0 + constantRestitution) * vn / 2 * mtdNormal.y);
                    balls[b].velocity = new THREE.Vector2(balls[b].velocity.x + impulse.x, balls[b].velocity.y + impulse.y);
                    balls[b1].velocity = new THREE.Vector2(balls[b1].velocity.x - impulse.x, balls[b1].velocity.y - impulse.y);

                    //prevent ball from getting stuck in wall
                    for (var i = 0; i < walls.length; i++) {
                        if (balls[b].intersectsWithBox(walls[i].getBox(), i)) {
                            if (i >= 4) {
                                balls[b].velocity.x *= -1;
                            } else {
                                balls[b].velocity.y *= -1;
                            }
                        }
                    }
                }
            }
        }
    }
}

//game handler
function ProcessGame() {
    delta = clock.getDelta();
    if (keyMap[32]) {
        if (balls[0].velocity.x == 0 && balls[0].velocity.y == 0) {
            var collisionAngle = Math.atan2(balls[0].position.z - camera.position.z, balls[0].position.x - camera.position.x) * 180 / Math.PI;
            balls[0].setAngle(collisionAngle, 10);
        }
    }
    checkForWallsAndBalls();
    //move balls based on time between frames
    for (var i = 0; i < balls.length; i++) {
        balls[i].update(delta);
    }
    //hold mouse button to move camera
    camera.update(mouseX, mouseY, balls[0], keyMap , delta);
    //reset mouse movement
    mouseX = 0.0;
    mouseY = 0.0;
}

//loop function for drawing + game process
var render = function() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
    ProcessGame();
}

render();