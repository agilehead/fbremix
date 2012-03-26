(function() {
  var Stream;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Stream = (function() {

    function Stream(FB) {
      this.FB = FB;
      this.getItemDetails = __bind(this.getItemDetails, this);
      this.events = {};
      this.stream = [];
      this.cursor = 0;
    }

    Stream.prototype.nextItem = function() {
      if (this.cursor < this.stream.length) return this.cursor++;
    };

    Stream.prototype.previousItem = function() {
      if (this.cursor > 0) return this.cursor--;
    };

    Stream.prototype.setCursor = function(i) {
      if (i >= 0 && i < this.stream.length) return this.cursor = i;
    };

    Stream.prototype.getItem = function(callback) {
      if (this.stream.length) return callback(this.stream[this.cursor]);
    };

    Stream.prototype.getItemDetails = function(callback) {
      var item;
      if (this.stream.length) {
        item = this.stream[this.cursor];
        return callback(null, item);
      }
    };

    return Stream;

  })();

  this.FBRemixApp.Streams = {};

  this.FBRemixApp.Streams.Stream = Stream;

  this.FBRemixApp.Streams.load = function(location, fbremix) {
    switch (location) {
      case 'home':
        return new FBRemixApp.Streams.Feed(fbremix);
    }
  };

}).call(this);
