(function() {
  var Loader, PeriodicEval;

  this.FBRemixApp = {};

  this.FBRemixApp.Utils = {};

  Loader = (function() {

    function Loader() {
      this.loadFonts();
    }

    Loader.prototype.loadFonts = function() {
      var googleApiSrc;
      window.WebFontConfig = {
        google: {
          families: ['Droid+Sans::latin', 'Abril+Fatface::latin', 'Bevan::latin']
        }
      };
      googleApiSrc = 'https:' === window.document.location.protocol ? 'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js' : 'http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      return this.loadScript(googleApiSrc, {
        async: 'true'
      });
    };

    Loader.prototype.loadScript = function(src, attributes) {
      var name, script, val;
      console.log("loading " + src + ".");
      script = window.document.createElement('script');
      script.type = 'text/javascript';
      script.src = src;
      for (name in attributes) {
        val = attributes[name];
        script[name] = val;
      }
      return window.document.getElementsByTagName('head')[0].appendChild(script);
    };

    return Loader;

  })();

  PeriodicEval = (function() {

    function PeriodicEval(predicate, interval, callback, timeOut) {
      var f, startTime;
      var _this = this;
      timeOut = timeOut != null ? timeOut : 5000;
      startTime = new Date().getTime();
      f = function() {
        var timeNow;
        if (predicate()) {
          if (typeof callbackDelay !== "undefined" && callbackDelay !== null) {
            return setTimeout(callback, 0);
          } else {
            return callback();
          }
        } else {
          timeNow = new Date().getTime();
          if ((timeNow - startTime) < timeOut) {
            return setTimeout(f, interval);
          } else {
            return console.log("Timed out " + timeOut + "ms.");
          }
        }
      };
      f();
    }

    return PeriodicEval;

  })();

  this.FBRemixApp.Utils.Loader = Loader;

  this.FBRemixApp.Utils.PeriodicEval = PeriodicEval;

  this.FBRemixApp.Utils.random = function(n) {
    return Math.floor(Math.random() * n);
  };

  this.FBRemixApp.Utils.pickRandom = function(array) {
    var rand;
    rand = Math.floor(Math.random() * array.length);
    return array[rand];
  };

}).call(this);
