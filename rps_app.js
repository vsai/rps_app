Games = new Mongo.Collection("games");
if (Meteor.isClient) {
    Meteor.subscribe("currentGame");
    Template.body.helpers({
        games: function() {
            return Games.find({});
        }
    });
    Template.main_game.events({
        "click .rock": function() {
            Session.set("myMove", "rock");
            var player = Session.get("player");
            Meteor.call("updateGame", player, "rock");
        },
        "click .paper": function() {
            Session.set("myMove", "paper");
            var player = Session.get("player");
            Meteor.call("updateGame", player, "paper");
        },
        "click .scissors": function() {
            Session.set("myMove", "scissors");
            var player = Session.get("player");
            Meteor.call("updateGame", player, "scissors");
        }
    });
    Template.main_game.helpers({
        myMove: function() { return Session.get("myMove");},
        player: function() { return Session.get("player");}
    });
}

if (Meteor.isServer) {
    Meteor.startup(function () {
        Games.insert({
            p1_move: null,
            p2_move: null,
            state: "waiting",
            created_at: new Date()
        });
        var winMap = {
            "rock": "scissors",
            "paper": "rock",
            "scissors": "paper"
        };

        Meteor.methods({
            updateGame: function(player, move) {
                var g = Games.findOne({}, {sort: {created_at: -1}});
                var currentGameState = g.state;
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
        Meteor.publish("currentGame", function() {
            return Games.find({}, {sort: {created_at: -1}, limit: 1, fields: {state: 1}});
        });
    });
}
