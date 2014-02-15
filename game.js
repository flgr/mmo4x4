/**
 * Created by tom on 15/02/14.
 */
function Pattern(maskFun) {
    this.maskFun = maskFun;
}

Pattern.prototype.matches = function (game, x, y) {

    var claimers = [];

    for (var i = 0; i < game.requiredConnectionElements; i++) {
        for (var j = 0; j < game.requiredConnectionElements; j++) {
            claimer = game.getClaimer(x+i, y+j);

            if (this.maskFun(i, j)) {
                claimers.push(claimer);
            }
        }
    }

    //console.log(claimers, this.mask);

    if (claimers.length != game.requiredConnectionElements) {
        throw "Wrong length claimers";
    }

    return Pattern.claimerOfArray(claimers);
}

Pattern.functionToWipeOutPattern = function(f) {
    return function(x, y) {
        for (var xOff = -1; xoff < +1; xoff++) {
            for (var yOff = -1; yoff < +1; yoff++) {
                if (f(x+xOff, y+yOff)) { return true; }
            }
        }

        return false;
    };
}

Pattern.claimerOfArray = function (claimers) {
    var firstClaimer = claimers[0];
    if (firstClaimer == null) {
        return null;
    }

    for (var i = 0; i < claimers.length; i++) {
        var curClaimer = claimers[i];
        if (curClaimer != firstClaimer) {
            return null;
        }
    }

    return firstClaimer;
}

function Connect4Game(config) {
    this.width = config.w;
    this.height = config.h;
    this.requiredConnectionElements = config.n;
    this.board = {};

    this.patterns = [
        new Pattern(function(x,y) { return x == 0; }),
        new Pattern(function(x,y) { return y == 0; }),
        new Pattern(function(x,y) { return x == y; }),
        new Pattern(function(x,y) { return x == config.n - y - 1; })
    ];
};

Connect4Game.prototype.isClaimed = function (x, y) {
    return this.board[this.posToString(x, y)] != null;
}

Connect4Game.prototype.getClaimer = function (x, y) {
    return this.board[this.posToString(x, y)];
}

Connect4Game.prototype.isInBounds = function (x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
}

Connect4Game.prototype.posToString = function(x, y) {
    return x + "-" + y;
}

Connect4Game.prototype.claim = function (player, x, y) {

    if (!this.isInBounds(x, y)) {
        throw "Not in bounds: " + this.posToString(x, y);
    }

    if (!this.isClaimed(x, y)) {
        this.board[this.posToString(x, y)] = player;
    } else {
        throw "Field " + this.posToString(x, y) + " has already been claimed by " + this.getClaimer(x, y);
    }
}

Connect4Game.prototype.checkPatternsForFieldAndReturnClaimant = function (x, y) {

    var claimants = {};

    for (var i = 0; i < this.patterns.length; i++) {
        var pattern = this.patterns[i];

        var claimant = pattern.matches(this, x, y);

        if (claimant) {
            claimants[claimant.nick] = claimant;
        }
    }

    return claimants;
}

Connect4Game.prototype.findWinningPositions = function () {

    var winners = [];

    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {

            var claimants = this.checkPatternsForFieldAndReturnClaimant(x,y);

            for(var key in claimants){
                winners.push({ claimant: claimants[key], x: x, y: y });
            }
        }
    }

    return winners;
}

module.exports = Connect4Game;


function test(){
    var game = new Connect4Game({w:9,h:9,n:3});

    var flo = { nick: "Flo" };
    var tom = { nick: "Tom" };

    game.claim(flo,1,1);
    game.claim(flo,1,2);
    game.claim(flo,1,3);

    game.claim(flo,2,1);
    game.claim(flo,3,1);

    console.log(game.findWinningPositions());

    game.claim(tom,3,4);
    game.claim(tom,2,4);
    game.claim(tom,1,4);

    console.log(game.findWinningPositions());

}

if (require.main === module) {
    test();
}
