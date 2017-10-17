///<reference path="../typings/index.d.ts" />
///<reference path="Cue.ts" />
///<reference path="Camera.ts" />
///<reference path="Ball.ts" />
///<reference path="Room.ts" />
///<reference path="Wall.ts" />
///<reference path="Light.ts" />
///<reference path="Player.ts" />
///<reference path="SceneCreator.ts" />
///<reference path="GameFunctions.ts" />
//Three.js init
var scene = new THREE.Scene();
var camera = new Camera();
var renderer = new THREE.WebGLRenderer();
var clock = new THREE.Clock();
var delta = clock.getDelta();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
//create meshes + light
var creator = new SceneCreator(scene);
creator.load();
//game handler
var gameFunctions = new GameFunctions();
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
//game handler
function ProcessGame() {
    delta = clock.getDelta();
    //move balls and cue based on time between frames + check for collision
    gameFunctions.update(creator, delta, keyMap[32], camera, mouseX, mouseY);
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