(function() {
  var Feed;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Feed = (function() {

    __extends(Feed, FBRemixApp.Streams.Stream);

    function Feed(FB) {
      this.load = __bind(this.load, this);
      var _this = this;
      Feed.__super__.constructor.call(this, FB);
      this.load(function() {
        if (_this.stream.length) return _this.cursor = 0;
      });
    }

    Feed.prototype.load = function(callback) {
      var _this = this;
      return this.FB.api('/me/home', function(response) {
        _this.stream = response.data;
        return callback();
      });
    };

    Feed.prototype.getItems = function(callback) {
      var item, results, _i, _len, _ref;
      results = [];
      _ref = this.stream;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        item.from.picture = "https://graph.facebook.com/" + item.from.id + "/picture";
        results.push(item);
      }
      return callback(null, results);
    };

    return Feed;

  })();

  this.FBRemixApp.Streams.Feed = Feed;

}).call(this);
