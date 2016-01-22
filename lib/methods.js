Meteor.methods({
    updateGame: function(player, move) {
        var g = Games.findOne({}, {sort: {created_at: -1}});
        var currentGameState = g.state;
        if (player != "p1" && player != "p2")
            return;
        var p = (player === "p1") ? "p1_move" : "p2_move";
        var change = {};
        change[p] = move;
        Games.update(g._id, {$set: change});
        change = {}
        g = Games.findOne({}, {sort: {created_at: -1}});
        var message = "";
        if (g.p1_move === null && g.p2_move === null) {
            message = "waiting";
        } else if (g.p1_move === null) {
            message = "p2 submitted. waiting on p1";
        } else if (g.p2_move === null) {
            message = "p1 submitted. waiting on p2";
        } else {
            message = change["state"] = "game over. ";
            message += "p1 chose: " + g.p1_move + ". p2 chose: " + g.p2_move + " ";
            if (g.p1_move === g.p2_move) {
                message += "it is a tie.";
            } else if (winMap[g.p1_move] === g.p2_move) {
                message += "p1 wins.";
            } else {
                message += "p2 wins.";
            }
        }
        change["state"] = message
        Games.update(g._id, {$set: change});
    },
    newGame: function() {
        Games.insert({
            p1_move: null,
            p2_move: null,
            state: "waiting",
            created_at: new Date()
        });
    }
});
