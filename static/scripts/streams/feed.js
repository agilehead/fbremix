(function() {
  var Feed;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Feed = (function() {

    __extends(Feed, FBRemixApp.Streams.Stream);

    function Feed() {
      Feed.__super__.constructor.apply(this, arguments);
    }

    Feed.prototype.load = function() {};

    return Feed;

  })();

  this.FBRemixApp.Streams.Feed = Feed;

}).call(this);
