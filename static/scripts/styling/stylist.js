(function() {
  var Stylist;

  Stylist = (function() {

    function Stylist(options) {
      this.options = options;
    }

    Stylist.prototype.applyProperty = function(element, className, func) {
      var c, classes, elem, matchedType, selector, toBeStyled, _i, _len, _results;
      selector = "[class^=\"" + className + "-\"], [class*=\" " + className + "-\"]";
      toBeStyled = element.find(selector).andSelf().filter(selector);
      _results = [];
      for (_i = 0, _len = toBeStyled.length; _i < _len; _i++) {
        elem = toBeStyled[_i];
        elem = jQuery(elem);
        if (!elem.hasClass("" + className + "-applied")) {
          classes = elem.attr('class').split(/\s+/);
          matchedType = ((function() {
            var _j, _len2, _results2;
            _results2 = [];
            for (_j = 0, _len2 = classes.length; _j < _len2; _j++) {
              c = classes[_j];
              if (c.startsWith("" + className + "-")) {
                _results2.push(c.split('-')[c.split('-').length - 1]);
              }
            }
            return _results2;
          })())[0];
          elem.addClass("" + className + "-applied");
          _results.push(func(elem, matchedType));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Stylist.prototype.getResponsiveFontSize = function(size) {
      return size + 'px';
    };

    Stylist.prototype.getDominantColor = function(imgEl) {
      var blockSize, canvas, context, count, data, defaultRGB, height, i, length, rgb, width;
      blockSize = 5;
      defaultRGB = {
        r: 0,
        g: 0,
        b: 0
      };
      canvas = document.createElement('canvas');
      context = canvas.getContext && canvas.getContext('2d');
      i = -4;
      rgb = {
        r: 0,
        g: 0,
        b: 0
      };
      count = 0;
      if (!context) return defaultRGB;
      height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
      width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
      context.drawImage(imgEl, 0, 0);
      try {
        data = context.getImageData(0, 0, width, height);
      } catch (e) {
        return defaultRGB;
      }
      length = data.data.length;
      while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
      }
      rgb.r = ~~(rgb.r / count);
      rgb.g = ~~(rgb.g / count);
      rgb.b = ~~(rgb.b / count);
      return rgb;
    };

    return Stylist;

  })();

  this.FBRemixApp.Styling = {};

  this.FBRemixApp.Styling.Stylist = Stylist;

}).call(this);
