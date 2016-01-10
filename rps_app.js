Games = new Mongo.Collection("games");
if (Meteor.isClient) {
    Meteor.subscribe("currentGame");
    Template.body.helpers({
        games: function() {
            return Games.find({});
        }
    });
    Template.p1_main.events({
        'click .rock': function() {
            Session.set('p1_move', 'rock');
            console.log(Games.find().fetch()[0]);
            Meteor.call("updateGame", "p1", "rock");
        },
        'click .paper': function() {
            Session.set('p1_move', 'paper');
            Meteor.call("updateGame", "p1", "paper");
        },
        'click .scissors': function() {
            Session.set('p1_move', 'scissors');
            Meteor.call("updateGame", "p1", "scissors");
        }
    });
    Template.p1_main.helpers({
        p1_move: function() { return Session.get('p1_move');}
    });

    Template.p2_main.events({
        'click .rock': function() {
            Session.set('p2_move', 'rock');
            console.log(Games.find().fetch()[0]);
            Meteor.call("updateGame", "p2", "rock");
        },
        'click .paper': function() {
            Session.set('p2_move', 'paper');
            Meteor.call("updateGame", "p2", "paper");
        },
        'click .scissors': function() {
            Session.set('p2_move', 'scissors');
            Meteor.call("updateGame", "p2", "scissors");
        }
    });
    Template.p2_main.helpers({
        p2_move: function() { return Session.get('p2_move');},
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
          'rock': 'scissors',
          'paper': 'rock',
          'scissors': 'paper
      };
      Meteor.methods({
          updateGame: function(player, move) {
              var g = Games.findOne({}, {sort: {created_at: -1}});
              var currentGameState = g.state;
              var p = (player === "p1") ? "p1_move" : "p2_move";
              var change = {};
              change[p] = move;
              if (g.p1_move === null && g.p2_move === null) {
                  change["state"] = player + " submitted. waiting";
              } else if (g.p1_move === null && player==="p1") {
                  change["state"] = "game over. p1 chose: " + move + ". p2 chose: " + g.p2_move;
              } else if (g.p2_move === null && player==="p2") {
                  change["state"] = "game over. p1 chose: " + g.p1_move + ". p2 chose: " + move;
              } else {
                  // don't change the game state
              }
              Games.update(g._id, {$set: change});
          }
      });
      Meteor.publish("currentGame", function() {
          return Games.find({}, {sort: {created_at: -1}, limit: 1, fields: {state: 1}});
      });
  });
}
