Meteor.subscribe("currentGame");
Template.body.helpers({
    state: function() {
        return Games.findOne({}).state;
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
    },
    "click .new_game": function() {
        Meteor.call("newGame");
    }
});
Template.main_game.helpers({
    myMove: function() { return Session.get("myMove");},
    player: function() { return Session.get("player");}
});
