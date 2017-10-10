///<reference path="../typings/index.d.ts" />
///<reference path="Cue.ts" />
///<reference path="Camera.ts" />
///<reference path="Ball.ts" />
///<reference path="Room.ts" />
///<reference path="Wall.ts" />
///<reference path="Light.ts" />

//Three.js init
var scene = new THREE.Scene();
var camera = new Camera();
var renderer = new THREE.WebGLRenderer();
var clock = new THREE.Clock();
var delta = clock.getDelta();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild( renderer.domElement );

function setTexture(name, setX, setY) {
    var texture = new THREE.TextureLoader().load("textures/" + name);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(setX, setY);
    var material = new THREE.MeshPhongMaterial();
    material.map = texture;
    material.side = THREE.DoubleSide;
    //material.depthWrite = false;
    material.needsUpdate = true;
    return material;
}

//balls
var balls = [];
balls[0] = new Ball(0.5, setTexture("BallCue.jpg", 1, 1));
balls[0].position.x = 3;
balls[0].position.y = 0;
balls[0].position.z = 0;
//balls[0].setAngle(0, 10);
scene.add( balls[0] );
for (var i = 1; i < 12; i++) {
    balls[i] = new Ball(0.5, setTexture("Ball" + i.toString() + ".jpg", 1, 1));
    scene.add( balls[i] );
    balls[i].position.x = (i - 6) * 1.0;
    balls[i].position.z = (i - 6) * 1.0;
    //balls[i].setAngle(i * 60, 5);
}

//cue
var cue = new Cue(balls[0].radius, setTexture("roomCeiling.jpg", 1, 1));
scene.add(cue);

//table
var table = new Wall(25.3, 8.0, 14.2, setTexture("poolTable.jpg", 2, 1));
scene.add(table);
table.position.set(0, -(table.height / 2 + balls[0].radius), 0);

//floor
var roomSize = 200;
var roomHeight = roomSize / 2;
var xSets = Math.round(roomSize / 100) * 2;
var ySets = Math.round(roomHeight / 100) * 2;
var floor = new Room(roomSize, 0.1, roomSize, setTexture("roomFloor.jpg", xSets, xSets));
scene.add(floor);
floor.position.set(0, table.position.y - table.height / 2, 0);

//room
var roomWalls = [];
for (var i = 0; i < 2; i++) {
    roomWalls[i] = new Room(roomSize, roomHeight, 0.1, setTexture("roomWall.jpg", xSets, ySets));
}
for (var i = 2; i < 4; i++) {
    roomWalls[i] = new Room(0.1, roomHeight, roomSize, setTexture("roomWall.jpg", xSets, ySets));
}
for (var i = 0; i < 4; i++) {
    scene.add(roomWalls[i]);
}
roomWalls[0].position.set(0, floor.position.y + roomHeight / 2, -floor.depth / 2);
roomWalls[1].position.set(0, floor.position.y + roomHeight / 2, floor.depth / 2);
roomWalls[2].position.set(floor.width / 2, floor.position.y + roomHeight / 2, 0);
roomWalls[3].position.set(-floor.width / 2, floor.position.y + roomHeight / 2, 0);

//ceiling
var ceiling = new Room(roomSize, 0.1, roomSize, setTexture("roomCeiling.jpg", xSets, xSets));
scene.add(ceiling);
ceiling.position.set(0, roomHeight / 2 - table.height / 2, 0);

//wall
var walls = [];
var wallThickness = 1;
for (var i = 0; i < 4; i++) {
    walls[i] = new Wall(table.width / 2, balls[0].radius * 2.25, wallThickness, setTexture("roomFloor.jpg", 1, 1));
    scene.add(walls[i]);
    walls[i].position.y = 0;
}
for (var i = 4; i < 6; i++) {
    walls[i] = new Wall(wallThickness, balls[0].radius * 2.25, table.depth, setTexture("roomFloor.jpg", 1, 1));
    scene.add(walls[i]);
    walls[i].position.y = 0;
}

//pool table format for walls
walls[0].position.set(-table.width / 4, 0, -table.depth / 2);
walls[1].position.set(table.width / 4, 0, -table.depth / 2);
walls[2].position.set(-table.width / 4, 0, table.depth / 2);
walls[3].position.set(table.width / 4, 0, table.depth / 2);
walls[4].position.set(-table.width / 2, 0, 0);
walls[5].position.set(table.width / 2, 0, 0);

//light
var lightOffset = 0.8;
var lightHeight = (roomWalls[0].height - roomWalls[0].position.y) * lightOffset;
var lightColor = 0xfff1e0;

var ambLight = new THREE.AmbientLight(lightColor, 0.3);
scene.add(ambLight);

var lights = [];
for (var i = 0; i < 5; i++) {
    lights[i] = new Light(0xfff1e0, 0.15);
    scene.add(lights[i]);
}

lights[0].position.set(0, lightHeight, 0);
lights[0].intensity = 0.3;
lights[1].position.set(-floor.depth * lightOffset, lightHeight, -floor.depth * lightOffset);
lights[2].position.set(-floor.depth * lightOffset, lightHeight, floor.depth * lightOffset);
lights[3].position.set(floor.depth * lightOffset, lightHeight, floor.depth * lightOffset );
lights[4].position.set(floor.depth * lightOffset, lightHeight, -floor.depth * lightOffset);

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
    //move balls based on time between frames
    for (var i = 0; i < balls.length; i++) {
        balls[i].update(delta);
    }
    checkForWallsAndBalls();

    //hold mouse button to move camera
    camera.update(balls[0].position, mouseX, mouseY, balls[0], keyMap, delta);
    //reset mouse movement
    mouseX = 0.0;
    mouseY = 0.0;

    var allBallsNotMoving = true;
    for (var i = 0; i < balls.length; i++) {
        if (balls[i].velocity.x == 0 && balls[0].velocity.y == 0) {
            continue;
        } else {
            allBallsNotMoving = false;
            break;
        }
    }
    if (allBallsNotMoving) {
        cue.update(keyMap[32], camera.getCuePosition(balls[0].position, (cue.cueStartDistance + cue.cueAwayFromBall - balls[0].radius) / 2 + cue.cueMoveDistance), balls[0].position, camera.position);
    } else {
        cue.visible = false;
    }
}

//loop function for drawing + game process
var render = function() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
    ProcessGame();
}

render();