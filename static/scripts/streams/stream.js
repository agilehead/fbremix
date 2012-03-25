(function() {
  var Stream;

  Stream = (function() {

    function Stream(FB) {
      this.FB = FB;
      this.cursor = 0;
      this.stream = [];
    }

    Stream.prototype.nextItem = function() {
      return this.cursor++;
    };

    Stream.prototype.previousItem = function() {
      return this.cursor--;
    };

    Stream.prototype.getItem = function() {
      return this.stream[this.cursor];
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
