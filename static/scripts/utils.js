(function() {
  var Loader;

  this.FBRemixApp = {};

  Loader = (function() {

    function Loader() {
      this.loadFonts();
    }

    Loader.prototype.loadFonts = function() {
      var googleApiSrc;
      window.WebFontConfig = {
        google: {
          families: ['Droid+Sans::latin', 'Droid+Serif::latin', 'Open+Sans+Condensed:700:latin', 'Bevan::latin', 'Ubuntu::latin']
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

  this.FBRemixApp.Loader = Loader;

}).call(this);
