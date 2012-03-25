(function() {
  var RemixMode;

  RemixMode = (function() {

    function RemixMode() {}

    RemixMode.prototype.init = function(fbremix) {
      this.fbremix = fbremix;
    };

    RemixMode.prototype.run = function() {};

    RemixMode.prototype.previousItem = function() {
      return this.view.previousItem();
    };

    RemixMode.prototype.nextItem = function() {
      return this.view.nextItem();
    };

    RemixMode.prototype.refresh = function() {
      return this.view.displayItem();
    };

    RemixMode.prototype.switchBg = function() {
      return this.refresh();
    };

    RemixMode.prototype.applyStyle = function(item) {
      return this.fbremix.stylist.apply(item);
    };

    return RemixMode;

  })();

  this.FBRemixApp.Modes = {};

  this.FBRemixApp.Modes.RemixMode = RemixMode;

  this.FBRemixApp.modes = [];

}).call(this);
