(function() {
  var BrowseMode;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  BrowseMode = (function() {

    __extends(BrowseMode, FBRemixApp.Modes.RemixMode);

    function BrowseMode() {
      BrowseMode.__super__.constructor.apply(this, arguments);
    }

    BrowseMode.prototype.run = function() {
      BrowseMode.__super__.run.call(this);
      $j('body').addClass('mode-browse');
      this.view = this.getView(this.fbremix.location);
      this.view.init();
      return this.refresh();
    };

    BrowseMode.prototype.getView = function(location) {
      return new FBRemixApp.Modes.Browse.WallView(this);
    };

    BrowseMode.prototype.getName = function() {
      return 'Browse';
    };

    BrowseMode.prototype.resizeByLength = function(text) {
      var fontSizeClass;
      if (text.length < 6) {
        fontSizeClass = 'font-size-largest';
      } else if (text.length < 20) {
        fontSizeClass = 'font-size-larger';
      } else if (text.length < 60) {
        fontSizeClass = 'font-size-large';
      } else if (text.length < 300) {
        fontSizeClass = 'font-size-medium';
      } else {
        fontSizeClass = 'font-size-small';
      }
      return fontSizeClass;
    };

    return BrowseMode;

  })();

  this.FBRemixApp.Modes.Browse = {};

  this.FBRemixApp.modes.push({
    mode: new BrowseMode(),
    "default": true
  });

}).call(this);
