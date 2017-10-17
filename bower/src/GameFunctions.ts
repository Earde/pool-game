///<reference path="../typings/index.d.ts" />

class GameFunctions{
    turn: boolean;

    constructor() {
    }

    checkForHoles(balls, holes) {
        for (var b = 0; b < balls.length; b++) {
            if (!balls[b].hit) {
                //check for walls and bounce back if colliding
                for (var i = 0; i < holes.length; i++) {
                    if (balls[b].intersectsWithBox(holes[i].getBox(), i)) {
                        balls[b].hit = true;
                    }
                }
            }
        }
    }

    checkForWalls(balls, walls, delta) {
        for (var b = 0; b < balls.length; b++) {
            if (!balls[b].hit) {
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
            }
        }
    }

    checkForWallsAndBalls(balls, walls, delta) {
        this.checkForWalls(balls, walls, delta);
        //check for other balls
        for (var b = 0; b < balls.length; b++) {
            for (var b1 = b + 1; b1 < balls.length; b1++) {
                if (!balls[b].hit && !balls[b].hit) {
                    if (balls[b].intersectsWithBox(balls[b1].getBox())) {
                        if (balls[b].intersectsWithBall(balls[b1].getSphere())) {
                            var difference = new THREE.Vector2(balls[b].position.x - balls[b1].position.x, balls[b].position.z - balls[b1].position.z);
                            var length = Math.sqrt(difference.x * difference.x + difference.y * difference.y);
                            var r = balls[b].radius + balls[b1].radius;
                            var translation;
                            var mtd;
                            //if balls are colliding perfectly
                            if (length == 0.0) {
                                length = r - 1.0;
                                difference = new THREE.Vector2(r, 0.0);
                                translation = (difference.x - length) / length;
                                mtd = new THREE.Vector2(difference.x * translation, difference.y * translation);
                            } else {
                                translation = (r - length) / length;
                                mtd = new THREE.Vector2(difference.x * translation, difference.y * translation);
                            }
                            balls[b].position.x += mtd.x * 0.5;
                            balls[b].position.z += mtd.y * 0.5;
                            balls[b1].position.x -= mtd.x * 0.5;
                            balls[b1].position.z -= mtd.y * 0.5;
                            var v = new THREE.Vector2(balls[b].velocity.x - balls[b1].velocity.x, balls[b].velocity.y - balls[b1].velocity.y);
                            var mtdLength = Math.sqrt(mtd.x * mtd.x + mtd.y * mtd.y);
                            var mtdNormal = new THREE.Vector2(mtd.x / mtdLength, mtd.y / mtdLength);
                            var vn = v.x * mtdNormal.x + v.y * mtdNormal.y;
                            //moving away already
                            if (vn > 0.0) {
                                continue;
                            }
                            var constantRestitution = 0.85;
                            var i = (-(1.0 + constantRestitution) * vn) / 2;
                            var impulse = new THREE.Vector2(i * mtdNormal.x, i * mtdNormal.y);
                            balls[b].velocity = new THREE.Vector2(balls[b].velocity.x + impulse.x, balls[b].velocity.y + impulse.y);
                            balls[b1].velocity = new THREE.Vector2(balls[b1].velocity.x - impulse.x, balls[b1].velocity.y - impulse.y);
                            //prevent ball from getting stuck in wall
                            this.checkForWalls(balls, walls, delta);
                        }
                    }
                }
            }
        }
    }

    processHoles(balls, players, tableWidth) {
        var halfScore = 0;
        var fullScore = 0;
        var halfHit = 0;
        //process ball hits and fault
        for (var i = 0; i < balls.length; i++) {
            if (balls[i].hit) {
                if (i == 8 || i == 0) {
                    for (var j = 0; j < players.length; j++) {
                        if (players[j].turn) {
                            if (i == 8) {
                                players[j].bigFault = true;
                            } else if (i == 0) {
                                players[j].fault = true;
                                balls[0].resetWhiteBall(tableWidth);
                            }
                        }
                    }
                } else if (i < 8) {
                    fullScore++;
                    halfHit = 2;
                } else if (i > 8) {
                    halfScore++;
                    halfHit = 1;
                }
            }
        }
        if (this.turn) {
            //give player half or full balls
            if (players[0].isHalfOrFull == 0) {
                players[0].isHalfOrFull = halfHit;
                if (players[0].turn) {
                    players[1].turn = true;
                    players[0].turn = false;
                } else {
                    players[0].turn = true;
                    players[1].turn = false;
                }
            } else if (players[0].isHalfOrFull == 1) {
                if (halfScore > players[0].score && !players[0].fault && players[0].turn) {
                    players[1].turn = false;
                    players[0].turn = true;
                } else if (fullScore > players[1].score && !players[1].fault && players[1].turn) {
                    players[1].turn = true;
                    players[0].turn = false;
                } else if (players[0].turn) {
                    players[1].turn = true;
                    players[0].turn = false;
                } else {
                    players[1].turn = false;
                    players[0].turn = true;
                }
                players[0].score = halfScore;
                players[1].score = fullScore;
            } else {
                if (fullScore > players[0].score && !players[0].fault) {
                    players[1].turn = false;
                    players[0].turn = true;
                } else if (halfScore > players[1].score && !players[1].fault && players[1].turn) {
                    players[1].turn = true;
                    players[0].turn = false;
                } else if (players[0].turn) {
                    players[1].turn = true;
                    players[0].turn = false;
                } else {
                    players[1].turn = false;
                    players[0].turn = true;
                }
                players[0].score = fullScore;
                players[1].score = halfScore;
            }
            //reset fault and check for winner or loser
            for (var k = 0; k < players.length; k++) {
                players[k].fault = false;
                players[k].hasWon();
            }
            this.turn = false;
        }
    }

    update(creator, delta, spacePressed, camera, mouseX, mouseY) {
        for (var i = 0; i < creator.balls.length; i++) {
            creator.balls[i].update(delta);
        }
        //hold mouse button to move camera
        camera.update(creator.balls[0].position, mouseX, mouseY);
        var gameIsDone = false;
        for (var i = 0; i < creator.players.length; i++) {
            if (creator.players[i].winner || creator.players[i].loser) {
                gameIsDone = true;
                break;
            }
        }
        this.checkForWallsAndBalls(creator.balls, creator.walls, delta);
        if (!gameIsDone) {
            this.checkForHoles(creator.balls, creator.holes);
            this.processHoles(creator.balls, creator.players, creator.table.width);
            if (creator.players[0].firstBall != 0) {
                creator.cue.cuePowerMax = 20;
            }
            for (var i = 1; i < creator.balls.length; i++) {
                if (creator.balls[i].hit) {
                    if (i < 8) {
                        var num = i - 4;
                        creator.balls[i].position.set(creator.table.position.x + (creator.balls[i].radius * 2 * num), creator.walls[0].position.y + creator.walls[0].height * 0.9, creator.walls[0].position.z);
                    } else if (i > 8) {
                        var num = i - 12;
                        creator.balls[i].position.set(creator.table.position.x + (creator.balls[i].radius * 2 * num), creator.walls[4].position.y + creator.walls[3].height * 0.9, creator.walls[3].position.z);
                    }
                }
            }
            var allBallsNotMoving = true;
            for (var i = 0; i < creator.balls.length; i++) {
                if (creator.balls[i].velocity.x == 0 && creator.balls[0].velocity.y == 0) {
                    continue;
                } else {
                    allBallsNotMoving = false;
                    break;
                }
            }
            if (allBallsNotMoving) {
                if (creator.players[0].isHalfOrFull == 1) {
                    if (creator.players[0].turn) {
                        creator.cue.isHalf = true;
                    } else {
                        creator.cue.isHalf = false;
                    }
                } else {
                    if (creator.players[0].turn) {
                        creator.cue.isHalf = false;
                    } else {
                        creator.cue.isHalf = true;
                    }
                }
                var cuePos = camera.getCuePosition(creator.balls[0].position, (creator.cue.cueStartDistance + creator.cue.cueAwayFromBall - creator.balls[0].radius) / 2 + creator.cue.cueMoveDistance);
                creator.cue.update(spacePressed, cuePos, creator.balls[0], camera.position);
            } else {
                creator.cue.visible = false;
                this.turn = true;
            }
        } else {
            creator.cue.visible = false;
            for (var i = 0; i < creator.players.length; i++) {
                if (creator.players[i].loser || creator.players[i].winner) {
                    if (i == 0) {
                        creator.balls[8].position.set(creator.table.position.x + (creator.balls[i].radius * 2 * 5), creator.walls[0].position.y + creator.walls[0].height * 0.9, creator.walls[0].position.z);
                    } else {
                        creator.balls[8].position.set(creator.table.position.x + (creator.balls[i].radius * 2 * 5), creator.walls[0].position.y + creator.walls[3].height * 0.9, creator.walls[3].position.z);
                    }
                }
            }
            //leuk berichtje voor de winnaar
            //reset game zodat er opnieuw begonnen kan worden
        }
    }
}