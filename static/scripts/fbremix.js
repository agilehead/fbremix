(function() {
  var FBRemix;

  FBRemix = (function() {

    function FBRemix(FB) {
      this.FB = FB;
      this.window = window;
      this.window.$j = jQuery.noConflict();
      this.cache = new FBRemixApp.Cache();
      this.stream = FBRemixApp.Streams.load('home');
    }

    FBRemix.prototype.setupAuthLinks = function() {
      var _this = this;
      $j('#auth-loginlink').click(function() {
        return _this.FB.login();
      });
      return $j('#auth-logoutlink').click(function() {
        return _this.FB.logout();
      });
    };

    FBRemix.prototype.onAuthStatusChange = function(response) {
      if (response.authResponse) {
        this.FB.api('/me', function(me) {
          if (me.name) {
            $j('#auth-displayname').html(me.name);
            $j('#auth-loggedout').css('display', 'none');
            return $j('#auth-loggedin').css('display', 'block');
          }
        });
        return this.init();
      } else {
        $j('#auth-loggedout').css('display', 'block');
        return $j('#auth-loggedin').css('display', 'none');
      }
    };

    FBRemix.prototype.init = function() {
      return this.loadModes();
    };

    FBRemix.prototype.loadModes = function() {
      var defaultMode, modeInfo, _i, _len, _ref;
      _ref = FBRemixApp.modes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        modeInfo = _ref[_i];
        modeInfo.mode.init(this);
        if (modeInfo["default"]) defaultMode = modeInfo.mode;
        console.log("Loaded mode " + (modeInfo.mode.getName()) + ".");
      }
      return this.switchMode(defaultMode);
    };

    FBRemix.prototype.switchMode = function(mode) {
      this.mode = mode;
      this.mode.run();
      return console.log("Switched to mode " + (this.mode.getName()) + ".");
    };

    FBRemix.prototype.previousItem = function() {
      return this.mode.previousItem();
    };

    FBRemix.prototype.nextItem = function() {
      return this.mode.nextItem();
    };

    FBRemix.prototype.refresh = function() {
      return this.mode.refresh();
    };

    return FBRemix;

  })();

  this.FBRemixApp.FBRemix = FBRemix;

}).call(this);
