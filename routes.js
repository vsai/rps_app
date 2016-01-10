FlowRouter.route("/", {
    name: "gameViewer",
    action: function(params) {
        console.log("Watching the game");
    }
});

FlowRouter.route("/player1", {
    name: "p1",
    action: function(params) {
        console.log("Player 1 entered the game");
        Session.set("player", "p1");
        BlazeLayout.render('game', { view: "p1_main"});
    }
});

FlowRouter.route("/player2", {
    name: "p2",
    action: function(params) {
        console.log("Player 2 entered the game");
        Session.set("player", "p2");
        BlazeLayout.render('game', { view: "p2_main"});
    }
});
