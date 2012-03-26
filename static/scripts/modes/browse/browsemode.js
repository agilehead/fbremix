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
      return this.view.init();
    };

    BrowseMode.prototype.getView = function(location) {
      return new FBRemixApp.Modes.Browse.WallView(this);
    };

    BrowseMode.prototype.getName = function() {
      return 'Browse';
    };

    return BrowseMode;

  })();

  this.FBRemixApp.Modes.Browse = {};

  this.FBRemixApp.modes.push({
    mode: new BrowseMode(),
    "default": true
  });

}).call(this);
