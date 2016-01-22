Meteor.startup(function () {
    Games.insert({
        p1_move: null,
        p2_move: null,
        state: "waiting",
        created_at: new Date()
    });

    Meteor.publish("currentGame", function() {
        return Games.find({}, {sort: {created_at: -1}, limit: 1, fields: {state: 1}});
    });
});
