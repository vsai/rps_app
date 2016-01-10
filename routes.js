FlowRouter.route("/", {
    name: "gameViewer",
    action: function(params) {
    }
});

FlowRouter.route("/player1", {
    name: "p1",
    action: function(params) {
        Session.set("player", "p1");
    }
});

FlowRouter.route("/player2", {
    name: "p2",
    action: function(params) {
        Session.set("player", "p2");
    }
});
