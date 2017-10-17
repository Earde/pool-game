///<reference path="../typings/index.d.ts" />
var Player = (function () {
    function Player() {
        this.score = 0;
        this.isHalfOrFull = 0;
        this.turn = false;
        this.fault = false;
        this.bigFault = false;
        this.winner = false;
        this.loser = false;
    }
    Player.prototype.hasWon = function () {
        if (this.score >= 7 && this.bigFault) {
            this.winner = true;
        }
        else if (this.bigFault) {
            this.loser = true;
        }
    };
    return Player;
}());
//# sourceMappingURL=Player.js.map