(function() {
  var NormalStylist;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  NormalStylist = (function() {

    __extends(NormalStylist, FBRemixApp.Styling.Stylist);

    NormalStylist.fontStyles = {
      text: "'Droid Sans', sans-serif",
      heading: "'Droid Sans', sans-serif",
      quote: "'Abril Fatface', cursive"
    };

    NormalStylist.palettes = {
      heading: '#555',
      text: '#333',
      random: {
        white: {
          dark: [["#403634", "#735D49", "#593939"], ["#E83A25", "#004563", "#191B28"], ["#101A4D", "#0C426E", "#169896"]]
        }
      }
    };

    function NormalStylist(options) {
      var fontSizes, fonts, palette;
      NormalStylist.__super__.constructor.call(this, options);
      fonts = NormalStylist.fontStyles;
      fontSizes = {
        tiny: 10,
        smallest: 12,
        small: 14,
        medium: 18,
        large: 24,
        larger: 40,
        largest: 64,
        huge: 96,
        ludicrous: 128
      };
      palette = NormalStylist.palettes;
      this.theme = {
        fonts: fonts,
        fontSizes: fontSizes,
        palette: palette,
        randomPalette: FBRemixApp.Utils.pickRandom(palette.random.white.dark)
      };
    }

    NormalStylist.prototype.apply = function(element) {
      var _this = this;
      this.applyProperty(element, 'color', function(elem, matchedType) {
        var color, _ref;
        if (matchedType === 'random') {
          color = FBRemixApp.Utils.pickRandom(_this.theme.randomPalette);
        } else {
          color = (_ref = _this.theme.palette[matchedType]) != null ? _ref : '#999';
        }
        return elem.css('color', color);
      });
      this.applyProperty(element, 'font-size', function(elem, matchedType) {
        var fontSize, _ref;
        fontSize = (_ref = _this.theme.fontSizes[matchedType]) != null ? _ref : '12px';
        elem.css('font-size', _this.getResponsiveFontSize(fontSize));
        if (fontSize <= 16) {
          return elem.css('line-height', '1.4em');
        } else if (fontSize <= 24) {
          return elem.css('line-height', '1.2em');
        } else if (fontSize <= 40) {
          return elem.css('line-height', '1.1em');
        } else if (fontSize <= 60) {
          return elem.css('line-height', '1.1em');
        } else {
          return elem.css('line-height', '0.9em');
        }
      });
      return this.applyProperty(element, 'font-family', function(elem, matchedType) {
        return elem.css('font-family', _this.theme.fonts[matchedType]);
      });
    };

    return NormalStylist;

  })();

  this.FBRemixApp.Styling.NormalStylist = NormalStylist;

}).call(this);
