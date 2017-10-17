///<reference path="../typings/index.d.ts" />

class Player {
    score: number;
    isHalfOrFull: number;
    turn: boolean;
    fault: boolean;
    bigFault: boolean;
    winner: boolean;
    loser: boolean;

    constructor() {
        this.score = 0;
        this.isHalfOrFull = 0;
        this.turn = false;
        this.fault = false;
        this.bigFault = false;
        this.winner = false;
        this.loser = false;
    }

    hasWon() {
        if (this.score >= 7 && this.bigFault) {
            this.winner = true;
        } else if (this.bigFault) {
            this.loser = true;
        }
    }
}