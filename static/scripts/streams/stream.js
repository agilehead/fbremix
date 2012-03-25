(function() {
  var Stream;

  Stream = (function() {

    function Stream(FB) {
      this.FB = FB;
    }

    Stream.prototype.nextItem = function() {
      if (this.cursor < this.stream.length) return this.cursor++;
    };

    Stream.prototype.previousItem = function() {
      if (this.cursor > 0) return this.cursor--;
    };

    Stream.prototype.setCursor = function(i) {
      return this.cursor = i;
    };

    Stream.prototype.getItem = function() {
      if (this.stream.length) return this.stream[this.cursor];
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
