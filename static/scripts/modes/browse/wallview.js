(function() {
  var WallView;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  WallView = (function() {

    function WallView(mode) {
      this.mode = mode;
      this.loadActors = __bind(this.loadActors, this);
      this.nextItem = __bind(this.nextItem, this);
      this.previousItem = __bind(this.previousItem, this);
    }

    WallView.prototype.init = function() {
      var _this = this;
      $j('body').addClass('view-wall');
      this.container = this.mode.fbremix.container;
      this.container.html('');
      this.container.append('<div class="left-pane span3"><div class="options"></div><div id="actors-off-list"><ul></ul><div class="clear"></div></div><ul id="actors-list"></ul></div>');
      this.options = this.container.find('.left-pane > .options');
      this.actorsOffList = this.container.find('#actors-off-list ul');
      this.actorsList = this.container.find('#actors-list');
      this.container.append('<div class="span9"><div class="right-pane row-fluid" id="post-container"></div></div>');
      this.postContainer = this.container.find('#post-container');
      this.stream = new FBRemixApp.Streams.Feed(this.mode.fbremix.FB);
      this.stream.onLoadMore(function() {
        return _this.loadActors();
      });
      return this.stream.loadMore(function() {
        _this.refreshActors();
        return _this.displayItem();
      });
    };

    WallView.prototype.previousItem = function() {
      this.stream.previousItem();
      this.refreshActors();
      return this.displayItem();
    };

    WallView.prototype.nextItem = function() {
      this.stream.nextItem();
      this.refreshActors();
      return this.displayItem();
    };

    WallView.prototype.loadActors = function() {
      var i, image, item, li, name, _i, _len, _ref, _results;
      var _this = this;
      i = 0;
      _ref = this.stream.stream;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        this.actorsList.append("                <li style=\"display:none\">                    <div class=\"profile-pic\"><img /></div>                    <h2 class=\"actor\"></h2>                </li>");
        li = this.actorsList.children('li').last();
        li.data('position', i);
        li.data('feedItem', item);
        this.mode.applyStyle(li);
        image = li.find('img').last();
        name = li.find('h2.actor').last();
        image.attr('src', item.from._data.picture);
        image.attr('alt', item.from.name);
        name.html("" + item.from.name);
        li.click((function(i) {
          return function() {
            return _this.repositionStream(i);
          };
        })(i));
        _results.push(i = i + 1);
      }
      return _results;
    };

    WallView.prototype.refreshActors = function() {
      var i, item, lesser, li, offList, offListFrom, shown, _i, _len;
      var _this = this;
      this.actorsList.children('li').removeClass('selected');
      lesser = this.actorsList.children('li').filter(function(index) {
        return index < _this.stream.cursor;
      });
      lesser.hide();
      this.actorsOffList.html('');
      offListFrom = lesser.length < 20 ? 0 : lesser.length - 20;
      offList = lesser.slice(offListFrom, lesser.length + 1 || 9e9);
      if (offList.length) {
        i = 0;
        for (_i = 0, _len = offList.length; _i < _len; _i++) {
          item = offList[_i];
          item = $j(item);
          this.actorsOffList.append("<li><img src=\"" + (item.data('feedItem').from._data.picture) + "\" /></li>");
          li = this.actorsOffList.children('li').last();
          li.click((function(i) {
            return function() {
              return _this.repositionStream(i);
            };
          })(i));
          i++;
        }
      }
      shown = this.actorsList.children('li').not(lesser);
      shown.show();
      return shown.first().addClass('selected');
    };

    WallView.prototype.repositionStream = function(i) {
      this.stream.setCursor(i);
      this.refreshActors();
      return this.displayItem();
    };

    WallView.prototype.displayItem = function() {
      var _this = this;
      this.mode.fbremix.newStylist();
      return this.stream.getItemDetails(function(err, item) {
        if (item.loadFullItemAsync != null) {
          return item.loadFullItemAsync(function() {
            var post, postContent, postFeedback, postHeader, profilePic, textHeader;
            _this.postContainer.html('<div class="post"></div>');
            post = _this.postContainer.children('.post').last();
            post.append("                        <div class=\"post-header row-fluid\">                            <div class=\"profile-pic\">                                <img />                            </div>                            <div class=\"text span8\"></div>                        </div>                        <div class=\"post-content\"></div>                        <div class=\"post-feedback\"></div>");
            postHeader = post.children('.post-header').last();
            profilePic = postHeader.find('img');
            profilePic.attr('src', item.from._data.picture + "?type=large");
            textHeader = postHeader.find('.text');
            _this.displayHeading(item, textHeader, {
              processedMedia: []
            });
            postContent = post.children('.post-content').last();
            _this.displayContent(item, postContent, {
              processedMedia: []
            });
            postFeedback = post.children('.post-feedback').last();
            return _this.displayFeedback(item, postFeedback, {
              processedMedia: []
            });
          });
        }
      });
    };

    WallView.prototype.displayHeading = function(item, renderTo, context) {
      var actorElem, story, _ref, _ref2;
      renderTo.append("<h2 class=\"font-size-largest\"></h2>");
      actorElem = renderTo.children('h2').last();
      actorElem.html(item.from.name);
      this.mode.applyStyle(actorElem);
      if (item.story != null) {
        story = $j.trim(item.story.replace(item.from.name, ''));
        if (story) {
          renderTo.append("<div class=\"story font-size-larger color-random\">" + story + "</div>");
          this.mode.applyStyle(renderTo.find('.story').last());
        }
      }
      if (((_ref = item.to) != null ? (_ref2 = _ref.data) != null ? _ref2.length : void 0 : void 0) && item.to.data[0].name) {
        renderTo.append("<div class=\"story font-size-larger color-random\">to " + item.to.data[0].name + "</div>");
        return this.mode.applyStyle(renderTo.find('.story').last());
      }
    };

    WallView.prototype.displayContent = function(item, renderTo, context) {
      var contentText, embed, fontSize, messageElem, regex, res, videoId, _i, _len, _ref;
      var _this = this;
      contentText = item.message;
      if (contentText != null) {
        if (this.isLink(contentText)) {
          renderTo.append("<blockquote class=\"message font-family-quote font-size-larger\">" + contentText + "</blockquote>");
          messageElem = renderTo.children('.message').last();
          if (this.getLinkType(contentText) === 'image') {
            if (!this.isProcessed(context.processedMedia, {
              type: 'image',
              url: contentText
            })) {
              renderTo.append("<div class=\"picture span11\"><img src=\"" + contentText + "\" /></div>");
              renderTo.append("<div class=\"clear\"></div>");
              context.processedMedia.push({
                type: 'image',
                url: contentText
              });
            }
          }
        } else {
          renderTo.append("<blockquote class=\"message font-family-quote\">" + contentText + "</blockquote>");
          messageElem = renderTo.children('.message').last();
          fontSize = this.getFontSize(contentText);
          messageElem.addClass(fontSize);
        }
        if (FBRemixApp.Utils.random(2) === 1) messageElem.addClass('color-random');
        this.mode.applyStyle(messageElem);
      }
      if (item._data.loadLinkDetailsAsync != null) {
        item._data.loadLinkDetailsAsync(function() {
          if (!_this.isProcessed(context.processedMedia, {
            type: 'image',
            url: contentText
          })) {
            renderTo.append("<div class=\"picture span11\"><img src=\"" + item._data.link.picture + "\" /></div>");
            renderTo.append("<div class=\"clear\"></div>");
            return context.processedMedia.push({
              type: 'image',
              url: contentText
            });
          }
        });
      }
      if (item.loadRelatedDetailsAsync != null) {
        item.loadRelatedDetailsAsync(function() {
          var _ref;
          if ((_ref = item._related.images) != null ? _ref.length : void 0) {
            if (!_this.isProcessed(context.processedMedia, {
              type: 'image',
              url: contentText
            })) {
              renderTo.append("<div class=\"picture span11\"><img src=\"" + item._related.images[0].source + "\" /></div>");
              renderTo.append("<div class=\"clear\"></div>");
              return context.processedMedia.push({
                type: 'image',
                url: contentText
              });
            }
          }
        });
      }
      if (item.type === 'video') {
        _ref = [/https?:\/\/www\.youtube\.com\/watch\?v\=(\w+)/, /https?:\/\/www\.youtube\.com\/v\/(\w+)/];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          regex = _ref[_i];
          res = item.source.match(regex);
          if (res) break;
        }
        videoId = res[1];
        embed = "<div class=\"media\"><iframe width=\"480\" height=\"360\" src=\"https://www.youtube.com/embed/" + videoId + "\" frameborder=\"0\" allowfullscreen></iframe></div>";
        return renderTo.append(embed);
      }
    };

    WallView.prototype.displayFeedback = function(item, renderTo, context) {
      var comment, commentList, rowDiv, _i, _len, _ref, _ref2, _ref3, _ref4, _results;
      item = (_ref = item._full) != null ? _ref : item;
      if ((_ref2 = item.comments) != null ? (_ref3 = _ref2.data) != null ? _ref3.length : void 0 : void 0) {
        renderTo.append("<div class=\"comments-container\"><ul></ul></div>");
        commentList = renderTo.find('.comments-container ul').last();
        _ref4 = item.comments.data;
        _results = [];
        for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
          comment = _ref4[_i];
          commentList.append("<li><div class=\"row\"></div></li>");
          rowDiv = commentList.find('li .row').last();
          rowDiv.append("<div class=\"commenter-image span1 align-right\"><img src=\"https://graph.facebook.com/" + comment.from.id + "/picture\" /></div>");
          rowDiv.append("<div class=\"span4\"><h6>" + comment.from.name + "</h6><div class=\"message\">" + comment.message + "</div>");
          _results.push(rowDiv.append('<div class="clear"></div>'));
        }
        return _results;
      }
    };

    WallView.prototype.isLink = function(text) {
      return text.split(' ').length === 1 && /^http/.test(text);
    };

    WallView.prototype.getLinkType = function(url) {
      var ext, r, res;
      r = /https?:\/\/.*(.jpg$)/;
      res = url.match(r);
      if (res) {
        ext = res[1].toLowerCase();
        if (ext === '.jpg' || '.png' || '.gif' || '.bmp') return 'image';
      }
    };

    WallView.prototype.isProcessed = function(list, media) {
      var item, matches;
      matches = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = list.length; _i < _len; _i++) {
          item = list[_i];
          if (item.type === media.type && item.url === media.url) {
            _results.push(item);
          }
        }
        return _results;
      })();
      if (matches.length) {
        return true;
      } else {
        return false;
      }
    };

    WallView.prototype.getMedia = function(url) {
      var embed, ext, r, res, videoId;
      r = /https?:\/\/www\.youtube\.com\/watch\?v\=(\w+)/;
      res = url.match(r);
      if (res) {
        videoId = res[1];
        embed = "<div class=\"media\"><iframe width=\"480\" height=\"360\" src=\"https://www.youtube.com/embed/" + videoId + "\" frameborder=\"0\" allowfullscreen></iframe></div>";
        return {
          content: embed,
          type: 'youtube',
          url: url,
          key: videoId
        };
      }
      r = /https?:\/\/.*(.jpg$)/;
      res = url.match(r);
      if (res) {
        ext = res[1].toLowerCase();
        if (ext === '.jpg' || '.png' || '.gif' || '.bmp') {
          return {
            content: "<div class=\"media\"><img src=\"" + url + "\" /></div>",
            type: 'image',
            url: url,
            key: url
          };
        }
      }
      return {
        content: "<a href=\"" + url + "\">" + url + "</a>",
        type: 'link',
        url: url,
        key: url
      };
    };

    WallView.prototype.getFontSize = function(text) {
      var fontSizeClass;
      if (text.length < 6) {
        fontSizeClass = 'font-size-ludicrous';
      } else if (text.length < 60) {
        fontSizeClass = 'font-size-huge';
      } else if (text.length < 200) {
        fontSizeClass = 'font-size-largest';
      } else if (text.length < 500) {
        fontSizeClass = 'font-size-larger';
      } else {
        fontSizeClass = 'font-size-medium';
      }
      return fontSizeClass;
    };

    WallView.prototype.getFontFamily = function(text, type) {
      if (type === 'quote') if (text.length < 300) return 'font-family-quote';
    };

    return WallView;

  })();

  this.FBRemixApp.Modes.Browse.WallView = WallView;

}).call(this);
