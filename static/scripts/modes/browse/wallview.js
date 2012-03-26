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
      this.container.append('<div class="right-pane span9 row-fluid" id="post-container"></div>');
      this.postContainer = this.container.find('#post-container');
      this.stream = new FBRemixApp.Streams.Feed(this.mode.fbremix.FB);
      return this.stream.load(function() {
        return _this.stream.getItems(function(err, results) {
          _this.loadActors(results);
          _this.refreshActors();
          return _this.displayItem();
        });
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

    WallView.prototype.loadActors = function(results) {
      var i, image, item, li, name, _i, _len, _results;
      var _this = this;
      i = 0;
      _results = [];
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        item = results[_i];
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
        var post, postContent, postHeader, processedMedia, profilePic, textHeader;
        processedMedia = [];
        _this.postContainer.html('<div class="post"></div>');
        post = _this.postContainer.children('.post').last();
        post.append("                <div class=\"post-header row-fluid\">                    <div class=\"profile-pic\">                        <img />                    </div>                    <div class=\"text span8\"></div>                </div>                <div class=\"post-content\"></div>");
        postHeader = post.children('.post-header').last();
        profilePic = postHeader.find('img');
        profilePic.attr('src', item.from._data.picture + "?type=large");
        textHeader = postHeader.find('.text');
        _this.displayHeading(item, textHeader, {
          processedMedia: processedMedia
        });
        postContent = post.children('.post-content').last();
        return _this.displayContent(item, postContent, {
          processedMedia: processedMedia
        });
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
      var contentText, fontSize, messageElem;
      var _this = this;
      contentText = item.message;
      if (contentText != null) {
        if (this.isLink(contentText)) {
          renderTo.append("<blockquote class=\"message font-family-quote font-size-larger\">" + contentText + "</blockquote>");
          messageElem = renderTo.children('.message').last();
          if (this.getLinkType(contentText) === 'image') {
            renderTo.append("<div class=\"picture\"><img src=\"" + contentText + "\" /></div>");
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
      if (item._data.loadPictureAsync != null) {
        item._data.loadPictureAsync(function() {
          return renderTo.append("<div class=\"picture\"><img src=\"" + item._data.picture + "\" /></div>");
        });
      }
      if (item.loadRelatedAsync != null) {
        return item.loadRelatedAsync(function() {
          var _ref;
          if ((_ref = item._related.images) != null ? _ref.length : void 0) {
            return renderTo.append("<div class=\"picture\"><img src=\"" + item._related.images[0].source + "\" /></div>");
          }
        });
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
      /*
              #Rest of everything
              post.append "<div class=\"post-content span12 row-fluid\"></div>"
              postContent = post.children('div').last()
              @displayMessageBody item, postContent, { processedMedia: processedMedia }        
              @displayAttachments item, postContent, { processedMedia, processedMedia }    
              @displayComments item, postContent, { processedMedia, processedMedia }
              
              if item.subStories?.length
                  postContent.append '<div class="sub-stories"></div>'
                  subStoriesDiv = postContent.find('.sub-stories')
                  
                  for story in item.subStories            
                      ##if story.attachments?.length and @imageBlockHasMedia story                        
                          @displayImageBlock_Item story, subStoriesDiv, { processedMedia: processedMedia }
                          @displayMessageBody story, subStoriesDiv, { processedMedia: processedMedia }
                          @displayHeading story, subStoriesDiv, { processedMedia: processedMedia }
                          @displayImageBlock_Block story, subStoriesDiv, { processedMedia: processedMedia }
                          @displayComments story, subStoriesDiv, { processedMedia: processedMedia }
                      else##
                      @displayHeading story, subStoriesDiv, { processedMedia: processedMedia }
                      @displayAttachments story, subStoriesDiv, { processedMedia, processedMedia }
                      @displayMessageBody story, subStoriesDiv, { processedMedia: processedMedia }
                      @displayComments story, subStoriesDiv, { processedMedia: processedMedia }
      
              
          displayMessageBody: (item, renderTo, context) ->
              if item.getMessageBody?
                  item.getMessageBody (messageBody) =>
                      if messageBody?
                          fontSizeClass = @mode.resizeByLength messageBody.text
                          if messageBody.type is 'html'
                              $j("<div class=\"message-body palette-light #{fontSizeClass} font-style-auto\">#{messageBody.html}</div>").insertAfter renderTo.children('h2.main-heading').first()
                          else if messageBody.type is 'text'
                              $j("<div class=\"message-body palette-light #{fontSizeClass} font-style-auto\">#{messageBody.text}</div>").insertAfter renderTo.children('h2.main-heading').first()
                              
                          @mode.applyStyle renderTo.children('div').last()
      
                          messageBody = renderTo.children('.message-body').first()
                          if messageBody.media?
                              for media in messageBody.media
                                  $j(media.content).insertAfter messageBody
      
      
          displayAttachments: (item, renderTo, context) ->
              if item.getAttachments?
                  item.getAttachments (attachments) =>
                      renderTo.append('<div class="attachments"></div>')
                      attachmentDiv = renderTo.children('.attachments').last()
              
                      if attachments?.length
                          attachment = attachments[0]
                          @displayImageBlock_Item attachment, attachmentDiv, context
                          @displayImageBlock_Block attachment, attachmentDiv, context
                          @displayImageAndText attachment, attachmentDiv, context
                          @displayTextual attachment, attachmentDiv, context                
      
          
          imageBlockHasMedia: (attachment) ->
              return attachment.imageBlock?.contentType == 'image' or attachment.imageBlock?.contentType == 'video'
          
          
          displayImageBlock_Item: (attachment, renderTo, context) ->
              if attachment.imageBlock?
                  if attachment.imageBlock?.contentType == 'image'
                      renderTo.append "<div class=\"attachment-media\"></div>"
                      imgDiv = renderTo.children('div').last()
                      attachment.imageBlock.getImage (image) ->
                          imgDiv.append "'<img src=\"#{image}\" />"
                          
      
          displayImageBlock_Block: (attachment, renderTo, context) ->
              if attachment.imageBlock?
                  renderTo.append "<div class=\"ui-image-block row\">
                      <div class=\"span1\"><img src=\"#{attachment.imageBlock.getImage()}\" /></div><div class=\"span6\">
                      <h6>#{attachment.imageBlock.title}</h6><p>#{attachment.imageBlock.media[0].content}</p><p>#{attachment.imageBlock.desc}</p></div></div>"    
      
      
          
          displayImageAndText: (attachment, renderTo, context) ->
              if attachment.imageAndText?
                  renderTo.append "<div class=\"attachment-media\"><img src=\"#{attachment.imageAndText.getImage()}\" /></div>"
      
                  renderTo.append '<div class=\"attachment-media-info\"></div>'
                  infoSectionDev = renderTo.children('div').last()
      
                  if attachment.imageAndText.title?
                      infoSectionDev.append "<h6>#{attachment.imageAndText.title}</h6>"
                      
                  if attachment.imageAndText.caption?
                      infoSectionDev.append "<h6>#{attachment.imageAndText.caption}</h6>"        
          
      
          displayTextual: (attachment, renderTo, context) ->
              if attachment.textual?
                  renderTo.append "<div class=\"font-size-medium\">#{attachment.textual.title}</div>"
                  renderTo.append "<div class=\"font-size-medium\">#{attachment.textual.desc}</div>"
          
          
          displayComments: (item, renderTo, context) ->
              if item.getComments?
                  item.getComments (comments) =>
                      if comments?.length
                          renderTo.append "<ul class=\"comment-list \"></ul>"
                          commentDiv = renderTo.find('.comment-list')
                          for comment in comments
                              commentDiv.append "<li><div class=\"row\"></div></li>"
                              rowDiv = commentDiv.find('li .row').last()
                              rowDiv.append "<div class=\"commenter-image span1 align-right\"><img src=\"#{comment.getImage()}\" /></div>"
                              rowDiv.append "<div class=\"span4\"><h6>#{comment.actor}</h6><div>#{comment.content}</div>"
                              rowDiv.append '<div style="clear:both"></div>'
      */
    };

    return WallView;

  })();

  this.FBRemixApp.Modes.Browse.WallView = WallView;

}).call(this);
