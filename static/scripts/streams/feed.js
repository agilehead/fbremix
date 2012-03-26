(function() {
  var Feed;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Feed = (function() {

    __extends(Feed, FBRemixApp.Streams.Stream);

    function Feed(FB) {
      this.fetchLinkDetails = __bind(this.fetchLinkDetails, this);
      this.loadLinkDetailsAsync = __bind(this.loadLinkDetailsAsync, this);
      this.fetchRelatedDetails = __bind(this.fetchRelatedDetails, this);
      this.loadRelatedDetailsAsync = __bind(this.loadRelatedDetailsAsync, this);
      this.fetchFullItem = __bind(this.fetchFullItem, this);
      this.loadFullItemAsync = __bind(this.loadFullItemAsync, this);
      this.setItemDetails = __bind(this.setItemDetails, this);
      this.onLoadMore = __bind(this.onLoadMore, this);
      this.loadMore = __bind(this.loadMore, this);      Feed.__super__.constructor.call(this, FB);
      this.events.loadMore = [];
    }

    Feed.prototype.nextItem = function() {
      Feed.__super__.nextItem.call(this);
      if ((this.stream.length - this.cursor) < 10) return this.loadMore();
    };

    Feed.prototype.loadMore = function(callback) {
      var url, _ref;
      var _this = this;
      url = (_ref = this.nextPage) != null ? _ref : '/me/home';
      return this.FB.api(url, {
        limit: 200
      }, function(response) {
        var func, i, item, _i, _j, _len, _len2, _ref2, _ref3, _ref4;
        if ((_ref2 = response.data) != null ? _ref2.length : void 0) {
          _this.stream.push.apply(_this.stream, response.data);
          i = 0;
          _ref3 = response.data;
          for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
            item = _ref3[_i];
            _this.setItemDetails(item);
            i++;
          }
          _ref4 = _this.events.loadMore;
          for (_j = 0, _len2 = _ref4.length; _j < _len2; _j++) {
            func = _ref4[_j];
            func();
          }
          callback();
          if (response.paging != null) {
            return _this.nextPage = response.paging.next;
          }
        } else {
          return console.log('stream.data has no items.');
        }
      });
    };

    Feed.prototype.onLoadMore = function(func) {
      return this.events.loadMore.push(func);
    };

    Feed.prototype.setItemDetails = function(item) {
      var ids, src;
      item.loadFullItemAsync = this.loadFullItemAsync(item);
      item.from._data = {};
      item.from._data.picture = "https://graph.facebook.com/" + item.from.id + "/picture";
      item._data = {};
      if (item.type === 'photo') {
        if (item.picture != null) {
          item._data.link = {};
          src = item.picture;
          item._data.link.picture = src.replace('_s.', '_n.');
          item._data.loadLinkDetailsAsync = this.loadLinkDetailsAsync(item);
        } else {
          item._data.loadLinkDetailsAsync = this.loadLinkDetailsAsync(item);
        }
      }
      ids = item.id.split('_');
      if (ids.length === 2) {
        return item.loadRelatedDetailsAsync = this.loadRelatedDetailsAsync(ids[1], item);
      }
    };

    Feed.prototype.loadFullItemAsync = function(item) {
      var _this = this;
      return function(callback) {
        if (item._full != null) {
          return callback();
        } else {
          return _this.fetchFullItem(item, callback);
        }
      };
    };

    Feed.prototype.fetchFullItem = function(item, callback) {
      var _this = this;
      return this.FB.api("/" + item.id, function(response) {
        if ((!response) || (!response.id)) {
          item._full = void 0;
          return callback();
        } else {
          item._full = response;
          return callback();
        }
      });
    };

    Feed.prototype.loadRelatedDetailsAsync = function(id, item) {
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

    Feed.prototype.loadLinkDetailsAsync = function(item) {
      var _this = this;
      return function(callback) {
        if (item._data.link != null) {
          return callback();
        } else {
          return _this.fetchLinkDetails(item, callback);
        }
      };
    };

    Feed.prototype.fetchLinkDetails = function(item, callback) {
      var _this = this;
      return this.FB.api("/" + item.object_id, function(response) {
        if ((response.images != null) && response.images.length) {
          item._data.link = {};
          item._data.link.picture = response.images[0].source;
          return callback();
        }
      });
    };

    return Feed;

  })();

  this.FBRemixApp.Streams.Feed = Feed;

}).call(this);
