Games = new Mongo.Collection("games");

if (Meteor.isClient) {
}

if (Meteor.isServer) {
  Meteor.startup(function () {
  });
}
