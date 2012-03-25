(function() {
  var Cache;

  Cache = (function() {

    function Cache() {
      this.items = [];
    }

    Cache.prototype.add = function(keys, value) {
      return items.add({
        keys: keys,
        value: value,
        timestamp: new Date().getTime()
      });
    };

    Cache.prototype.get = function(keys) {
      var found, item, k, v, _i, _len, _ref;
      _ref = this.items;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        found = true;
        for (k in keys) {
          v = keys[k];
          if (item[k] !== v) {
            found = false;
            break;
          }
        }
        if (found) return item.value;
      }
    };

    return Cache;

  })();

  this.FBRemixApp.Cache = Cache;

}).call(this);
