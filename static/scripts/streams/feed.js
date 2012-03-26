(function() {
  var Feed;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Feed = (function() {

    __extends(Feed, FBRemixApp.Streams.Stream);

    function Feed(FB) {
      this.fetchLinkDetails = __bind(this.fetchLinkDetails, this);
      this.loadPictureAsync = __bind(this.loadPictureAsync, this);
      this.fetchRelatedDetails = __bind(this.fetchRelatedDetails, this);
      this.loadRelatedAsync = __bind(this.loadRelatedAsync, this);
      this.fetchItemDetails = __bind(this.fetchItemDetails, this);
      this.load = __bind(this.load, this);      Feed.__super__.constructor.call(this, FB);
    }

    Feed.prototype.load = function(callback, currentItem) {
      var _this = this;
      return this.FB.api('/me/home', function(response) {
        var i, item, _i, _len, _ref, _ref2;
        if ((_ref = response.data) != null ? _ref.length : void 0) {
          _this.stream = response.data;
          if (!(currentItem != null)) _this.cursor = 0;
          i = 0;
          _ref2 = _this.stream;
          for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
            item = _ref2[_i];
            _this.fetchItemDetails(item);
            if (currentItem != null) {
              if (item.id === currentItem.id) _this.cursor = i;
            }
            i++;
          }
          return callback();
        } else {
          return console.log('stream.data has no items.');
        }
      });
    };

    Feed.prototype.fetchItemDetails = function(item) {
      var ids, src;
      item.from._data = {};
      item.from._data.picture = "https://graph.facebook.com/" + item.from.id + "/picture";
      item._data = {};
      if (item.type === 'photo') {
        if (item.picture != null) {
          src = item.picture;
          item._data.picture = src.replace('_s.', '_n.');
          item._data.loadPictureAsync = this.loadPictureAsync(item);
        } else {
          item._data.loadPictureAsync = this.loadPictureAsync(item);
        }
      }
      ids = item.id.split('_');
      if (ids.length === 2) {
        return item.loadRelatedAsync = this.loadRelatedAsync(ids[1], item);
      }
    };

    Feed.prototype.loadRelatedAsync = function(id, item) {
      var _this = this;
      return function(callback) {
        if (item._related != null) {
          return callback();
        } else {
          return _this.fetchRelatedDetails(id, item, callback);
        }
      };
    };

    Feed.prototype.fetchRelatedDetails = function(id, item, callback) {
      var _this = this;
      return this.FB.api("/" + id, function(response) {
        item._related = response;
        return callback();
      });
    };

    Feed.prototype.loadPictureAsync = function(item) {
      var _this = this;
      return function(callback) {
        if (item._data.picture != null) {
          return callback();
        } else {
          return _this.fetchLinkDetails(item, callback);
        }
      };
    };

    Feed.prototype.fetchLinkDetails = function(item, callback) {
      var _this = this;
      return this.FB.api("/" + item.object_id, function(response) {
        item._data.picture = response.images[0].source;
        return callback();
      });
    };

    return Feed;

  })();

  this.FBRemixApp.Streams.Feed = Feed;

}).call(this);
