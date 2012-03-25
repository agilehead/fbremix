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
      this.container.append('<div class="left-pane span3"><ul id="actors-list"></ul></div>');
      this.actorsList = this.container.find('#actors-list');
      this.container.append('<div class="right-pane span9 row-fluid" id="post-container"></div>');
      this.postContainer = this.container.find('#post-container');
      this.stream = new FBRemixApp.Streams.Feed(this.mode.fbremix.FB);
      return this.stream.load(function() {
        return _this.stream.getItems(function(err, results) {
          _this.loadActors(results);
          return _this.refreshActors();
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
      var i, image, item, j, li, name, _i, _len, _results;
      var _this = this;
      i = 0;
      _results = [];
      for (_i = 0, _len = results.length; _i < _len; _i++) {
        item = results[_i];
        j = i;
        this.actorsList.append("                <li style=\"display:none\">                    <div class=\"profile-pic span1\"><img /></div>                    <h2 class=\"actor\"></h2>                </li>");
        li = this.actorsList.children('li').last();
        li.data('position', i);
        this.mode.applyStyle(li);
        image = li.find('img').last();
        name = li.find('h2.actor').last();
        image.attr('src', item.from.picture);
        image.attr('alt', item.from.name);
        name.html("" + item.from.name);
        li.click((function(i) {
          return function() {
            _this.stream.cursor = i;
            return _this.refreshActors();
          };
        })(i));
        _results.push(i = i + 1);
      }
      return _results;
    };

    WallView.prototype.refreshActors = function() {
      var lesser, shown;
      var _this = this;
      this.actorsList.children('li').removeClass('selected');
      lesser = this.actorsList.children('li').filter(function(index) {
        console.log("" + index + " - " + _this.stream.cursor);
        return index < _this.stream.cursor;
      });
      lesser.hide();
      shown = this.actorsList.children('li').not(lesser);
      shown.show();
      return shown.first().addClass('selected');
    };

    WallView.prototype.displayItem = function() {
      var _this = this;
      return;
      return this.stream.getItemDetails(function(err, item) {
        var post, postHeader, processedMedia, profilePic, textHeader;
        processedMedia = [];
        _this.postContainer.html('<div class="post"></div>');
        post = _this.postContainer.children('.post').last();
        post.append("                <div class=\"post-header row-fluid\">                    <div class=\"profile-pic span4\">                        <img />                    </div>                    <div class=\"text span8\"></div>                </div>");
        postHeader = post.children('.post-header').last();
        profilePic = postHeader.find('img');
        item.getActor(function(actor) {
          profilePic.attr('src', actor.getImage());
          return profilePic.attr('alt', actor.name);
        });
        textHeader = postHeader.find('.text');
        return _this.displayHeading(item, textHeader, {
          processedMedia: processedMedia
        });
      });
    };

    WallView.prototype.displayHeading = function(item, renderTo, context) {
      var _this = this;
      return item.getHeading(function(heading) {
        return item.getActor(function(actor) {
          var actorElem, message;
          renderTo.append("<h2 class=\"font-size-largest\"></h2>");
          actorElem = renderTo.children('h2').last();
          actorElem.html(actor.name);
          _this.mode.applyStyle(actorElem);
          message = $j.trim(heading.replace(actor.name, ''));
          if (message) {
            renderTo.append("<div class=\"message font-size-larger color-random\">" + message + "</div>");
            return _this.mode.applyStyle(renderTo.find('.message').last());
          }
        });
      });
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
