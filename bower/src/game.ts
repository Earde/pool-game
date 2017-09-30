///<reference path="../typings/index.d.ts" />
///<reference path="Camera.ts" />
var scene = new THREE.Scene();
var camera = new Camera();
var renderer = new THREE.WebGLRenderer();
var clock = new THREE.Clock();
var delta = clock.getDelta();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//ball
var geometry = new THREE.SphereGeometry(1.23);
var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
var ball = new THREE.Mesh( geometry, material );
scene.add( ball );
ball.position.x = 0;
ball.position.y = 0;
ball.position.z = 0;
var ballSpeed = 2.0;
var ballDirection = new THREE.Vector2(0.75, 0.35);
ball.geometry.computeBoundingBox();

//table
var tableGeometry = new THREE.BoxGeometry(25.3, 8, 14.2);
var tableMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var table = new THREE.Mesh( tableGeometry, tableMaterial );
scene.add(table);
table.position.x = 0;
table.position.y = -(tableGeometry.parameters.height / 2 + geometry.parameters.radius);
table.position.z = 0;

var wallGeometry = new THREE.BoxGeometry(tableGeometry.parameters.width / 2, geometry.parameters.radius * 2.25, 0.5);
var wallGeometry2 = new THREE.BoxGeometry(wallGeometry.parameters.depth, geometry.parameters.radius * 2.25, tableGeometry.parameters.depth);
var wallMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var walls = [];
for (var i = 0; i < 4; i++) {
    walls[i] = new THREE.Mesh( wallGeometry, wallMaterial );
    scene.add(walls[i]);
    walls[i].position.y = 0;
}
for (var i = 4; i < 6; i++) {
    walls[i] = new THREE.Mesh( wallGeometry2, wallMaterial );
    scene.add(walls[i]);
    walls[i].position.y = 0;
}
walls[0].position.x = -tableGeometry.parameters.width / 4;
walls[0].position.z = -tableGeometry.parameters.depth / 2;
walls[1].position.x = tableGeometry.parameters.width / 4;
walls[1].position.z = -tableGeometry.parameters.depth / 2;
walls[2].position.x = -tableGeometry.parameters.width / 4;
walls[2].position.z = tableGeometry.parameters.depth / 2;
walls[3].position.x = tableGeometry.parameters.width / 4;
walls[3].position.z = tableGeometry.parameters.depth / 2;

walls[4].position.x = -tableGeometry.parameters.width / 2;
walls[4].position.z = 0;
walls[5].position.x = tableGeometry.parameters.width / 2;
walls[5].position.z = 0;
for (var i = 0; i < 6; i++) {
    walls[i].geometry.computeBoundingBox();
}

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

function intersects(sphere: THREE.Box3, box: THREE.Box3) {
    if ( box.max.x <= sphere.min.x || box.min.x >= sphere.max.x ||
        box.max.y <= sphere.min.y || box.min.y >= sphere.max.y ||
        box.max.z <= sphere.min.z || box.min.z >= sphere.max.z ) {
        return false;
    }
    return true;
}

//game
function ProcessGame() {
    delta = clock.getDelta();
    ball.geometry.computeBoundingBox();
    console.log(ball.geometry.boundingBox.max.x);
    for (var i = 0; i < walls.length; i++) {
        walls[i].geometry.computeBoundingBox();
        if (intersects(ball.geometry.boundingBox, walls[i].geometry.boundingBox)) {
            if (i >= 4) {
                ballDirection.x = -ballDirection.x;
                ballDirection.y = -ballDirection.y;
            } else {
                ballDirection.x = -ballDirection.x;
                ballDirection.y = -ballDirection.y;
            }
        }
    }
    ball.position.x += ballSpeed * Math.cos( ballDirection.x * Math.PI / 360 ) * delta;
    ball.position.z += ballSpeed * Math.sin( ballDirection.y * Math.PI / 360 ) * delta;
    ball.updateMatrix();
    camera.update(mouseX, mouseY, ball, keyMap , delta);
    mouseX = 0.0;
    mouseY = 0.0;
}

var render = function() {
    requestAnimationFrame( render );
    renderer.render( scene, camera );
    ProcessGame();
}

render();