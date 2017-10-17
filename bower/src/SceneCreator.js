///<reference path="../typings/index.d.ts" />
var SceneCreator = (function () {
    function SceneCreator(sceneVar) {
        scene = sceneVar;
    }
    SceneCreator.prototype.load = function () {
        var tableWidth = 25.3;
        var tableDepth = 14.2;
        var holeSize = 4;
        //balls
        this.balls = [];
        this.balls[0] = new Ball(0.5, this.setTexture("BallCue.jpg", 1, 1, true));
        this.balls[0].resetWhiteBall(tableWidth);
        scene.add(this.balls[0]);
        for (var i = 1; i < 16; i++) {
            this.balls[i] = new Ball(0.5, this.setTexture("Ball" + i.toString() + ".jpg", 1, 1, true));
            scene.add(this.balls[i]);
        }
        var startPos = new THREE.Vector3(-(tableWidth / 2) + 25.3 / 5 * 3, 0, 0);
        var ballOffset = this.balls[0].radius / 4;
        this.balls[1].position.set(startPos.x, startPos.y, startPos.z);
        this.balls[11].position.set(this.balls[1].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[1].position.z - this.balls[1].radius - ballOffset);
        this.balls[10].position.set(this.balls[1].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[1].position.z + this.balls[1].radius + ballOffset);
        this.balls[9].position.set(this.balls[11].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[11].position.z - this.balls[1].radius - ballOffset);
        this.balls[8].position.set(this.balls[11].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[11].position.z + this.balls[1].radius);
        this.balls[6].position.set(this.balls[11].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[10].position.z + this.balls[1].radius + ballOffset);
        this.balls[5].position.set(this.balls[9].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[9].position.z - this.balls[1].radius - ballOffset);
        this.balls[12].position.set(this.balls[9].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[9].position.z + this.balls[1].radius + ballOffset);
        this.balls[7].position.set(this.balls[9].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[8].position.z + this.balls[1].radius + ballOffset);
        this.balls[13].position.set(this.balls[9].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[6].position.z + this.balls[1].radius + ballOffset);
        this.balls[15].position.set(this.balls[5].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[5].position.z - this.balls[1].radius - ballOffset);
        this.balls[2].position.set(this.balls[5].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[5].position.z + this.balls[1].radius + ballOffset);
        this.balls[14].position.set(this.balls[5].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[12].position.z + this.balls[1].radius + ballOffset);
        this.balls[3].position.set(this.balls[5].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[7].position.z + this.balls[1].radius + ballOffset);
        this.balls[4].position.set(this.balls[5].position.x + this.balls[1].radius * 2 + ballOffset, startPos.y, this.balls[13].position.z + this.balls[1].radius + ballOffset);
        //cue
        this.cue = new Cue(this.balls[0].radius, this.setTexture("cueWood.jpg", 1, 1, true), this.setTexture("cueWood1.jpg", 1, 1, true));
        scene.add(this.cue);
        //table
        this.table = new Wall(tableWidth, 0.1, tableDepth, this.setTexture("poolTable.jpg", 1, 1, true));
        scene.add(this.table);
        this.table.position.set(0, -this.table.height / 2 - this.balls[0].radius, 0);
        //table legs
        this.legs = new Wall(this.table.width, 8.9, this.table.depth, this.setTexture("roomCeiling.jpg", 1, 1, true));
        scene.add(this.legs);
        this.legs.position.set(0, -this.legs.height / 2 + this.table.position.y, 0);
        //floor
        var roomSize = 300;
        var roomHeight = roomSize / 4;
        var xSets = Math.round(roomSize / 100);
        var ySets = Math.round(roomHeight / 100);
        this.floor = new Room(roomSize, 0.1, roomSize, this.setTexture("roomFloor.jpg", xSets, xSets, true));
        scene.add(this.floor);
        this.floor.position.set(0, this.legs.position.y - this.legs.height / 2, 0);
        //room
        this.roomWalls = [];
        for (var i = 0; i < 2; i++) {
            this.roomWalls[i] = new Room(roomSize, roomHeight, 0.1, this.setTexture("roomWall3.jpg", xSets, ySets, false));
        }
        for (var i = 2; i < 4; i++) {
            this.roomWalls[i] = new Room(0.1, roomHeight, roomSize, this.setTexture("roomWall3.jpg", xSets, ySets, false));
        }
        for (var i = 0; i < 4; i++) {
            scene.add(this.roomWalls[i]);
        }
        this.roomWalls[0].position.set(0, this.floor.position.y + roomHeight / 2, -this.floor.depth / 2);
        this.roomWalls[1].position.set(0, this.floor.position.y + roomHeight / 2, this.floor.depth / 2);
        this.roomWalls[2].position.set(this.floor.width / 2, this.floor.position.y + roomHeight / 2, 0);
        this.roomWalls[3].position.set(-this.floor.width / 2, this.floor.position.y + roomHeight / 2, 0);
        //ceiling
        this.ceiling = new Room(roomSize, 0.1, roomSize, this.setTexture("roomCeiling3.jpg", xSets, xSets, false));
        scene.add(this.ceiling);
        this.ceiling.receiveShadow = false;
        this.ceiling.position.set(0, roomHeight / 2 + this.roomWalls[0].position.y, 0);
        //table walls
        this.walls = [];
        var wallThickness = 1;
        for (var i = 0; i < 4; i++) {
            this.walls[i] = new Wall(this.table.width / 2 - holeSize / 2, this.balls[0].radius * 2.25, wallThickness, this.setTexture("tableWood.jpg", 2, 1, true));
            scene.add(this.walls[i]);
            this.walls[i].position.y = 0;
        }
        for (var i = 4; i < 6; i++) {
            this.walls[i] = new Wall(wallThickness, this.balls[0].radius * 2.25, this.table.depth - holeSize / 2, this.setTexture("tableWood.jpg", 2, 1, true));
            scene.add(this.walls[i]);
            this.walls[i].position.y = 0;
        }
        //pool table format for walls
        this.walls[0].position.set(-this.table.width / 4, this.table.position.y, -this.table.depth / 2 - this.walls[0].depth / 2);
        this.walls[1].position.set(this.table.width / 4, this.table.position.y, -this.table.depth / 2 - this.walls[1].depth / 2);
        this.walls[2].position.set(-this.table.width / 4, this.table.position.y, this.table.depth / 2 + this.walls[2].depth / 2);
        this.walls[3].position.set(this.table.width / 4, this.table.position.y, this.table.depth / 2 + this.walls[3].depth / 2);
        this.walls[4].position.set(-this.table.width / 2 - this.walls[4].width / 2, this.table.position.y, this.table.position.z);
        this.walls[5].position.set(this.table.width / 2 + this.walls[4].width / 2, this.table.position.y, this.table.position.z);
        //holes
        this.holes = [];
        for (var i = 0; i < 6; i++) {
            this.holes[i] = new Wall(holeSize / 2, this.walls[0].height, holeSize / 4, new THREE.MeshBasicMaterial({ color: 0x000000 }));
            scene.add(this.holes[i]);
        }
        for (var i = 6; i < 10; i++) {
            this.holes[i] = new Wall(holeSize / 4, this.walls[0].height, holeSize / 2, new THREE.MeshBasicMaterial({ color: 0x000000 }));
            scene.add(this.holes[i]);
        }
        this.holes[0].position.set(this.walls[0].position.x + this.walls[0].width / 2 + this.holes[0].width / 2, this.table.position.y, this.walls[0].position.z + this.walls[0].depth / 2 - this.holes[0].depth / 2);
        this.holes[1].position.set(this.walls[0].position.x - this.walls[0].width / 2 - this.holes[1].width / 2, this.table.position.y, this.walls[0].position.z + this.walls[0].depth / 2 - this.holes[1].depth / 2);
        this.holes[2].position.set(this.walls[1].position.x + this.walls[1].width / 2 + this.holes[2].width / 2, this.table.position.y, this.walls[1].position.z + this.walls[1].depth / 2 - this.holes[2].depth / 2);
        this.holes[3].position.set(this.walls[2].position.x + this.walls[2].width / 2 + this.holes[3].width / 2, this.table.position.y, this.walls[2].position.z - this.walls[2].depth / 2 + this.holes[3].depth / 2);
        this.holes[4].position.set(this.walls[2].position.x - this.walls[2].width / 2 - this.holes[4].width / 2, this.table.position.y, this.walls[2].position.z - this.walls[2].depth / 2 + this.holes[4].depth / 2);
        this.holes[5].position.set(this.walls[3].position.x + this.walls[3].width / 2 + this.holes[5].width / 2, this.table.position.y, this.walls[3].position.z - this.walls[3].depth / 2 + this.holes[5].depth / 2);
        this.holes[6].position.set(this.walls[4].position.x + this.walls[4].width / 2 - this.holes[6].width / 2, this.table.position.y, this.walls[4].position.z - this.walls[4].depth / 2 - this.holes[6].depth / 2);
        this.holes[7].position.set(this.walls[4].position.x + this.walls[4].width / 2 - this.holes[7].width / 2, this.table.position.y, this.walls[4].position.z + this.walls[4].depth / 2 + this.holes[7].depth / 2);
        this.holes[8].position.set(this.walls[5].position.x - this.walls[5].width / 2 + this.holes[8].width / 2, this.table.position.y, this.walls[5].position.z - this.walls[5].depth / 2 - this.holes[8].depth / 2);
        this.holes[9].position.set(this.walls[5].position.x - this.walls[5].width / 2 + this.holes[9].width / 2, this.table.position.y, this.walls[5].position.z + this.walls[5].depth / 2 + this.holes[9].depth / 2);
        //light
        var lightOffset = 0.8; //lightHeightPosition 0.0 = floor 1.0 = ceiling
        var lightHeight = this.ceiling.position.y * lightOffset;
        var lightColor = 0xfff1e0;
        this.ambLight = new THREE.AmbientLight(lightColor, 0.3);
        scene.add(this.ambLight);
        this.lights = [];
        for (var i = 0; i < 5; i++) {
            this.lights[i] = new Light(0xfff1e0, 0.15);
            scene.add(this.lights[i]);
        }
        this.lights[0].position.set(0, lightHeight, 0);
        this.lights[0].intensity = 0.30;
        this.lights[1].position.set(-this.floor.depth * lightOffset, lightHeight, -this.floor.depth * lightOffset);
        this.lights[2].position.set(-this.floor.depth * lightOffset, lightHeight, this.floor.depth * lightOffset);
        this.lights[3].position.set(this.floor.depth * lightOffset, lightHeight, this.floor.depth * lightOffset);
        this.lights[4].position.set(this.floor.depth * lightOffset, lightHeight, -this.floor.depth * lightOffset);
        //players
        this.players = [];
        this.players[0] = new Player();
        this.players[1] = new Player();
        if (new Date().getTime() % 2 == 0) {
            this.players[0].turn = true;
        }
        else {
            this.players[1].turn = true;
        }
    };
    SceneCreator.prototype.setTexture = function (name, setX, setY, phong) {
        var texture = new THREE.TextureLoader().load("textures/" + name);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(setX, setY);
        texture.generateMipmaps = true;
        var material;
        if (phong) {
            material = new THREE.MeshPhongMaterial();
        }
        else {
            material = new THREE.MeshBasicMaterial();
        }
        material.map = texture;
        material.side = THREE.DoubleSide;
        material.needsUpdate = true;
        return material;
    };
    return SceneCreator;
}());
//# sourceMappingURL=SceneCreator.js.map