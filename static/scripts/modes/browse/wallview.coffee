class WallView

    constructor: (@mode) ->
    
    init: () ->
        $j('body').addClass 'view-wall'

        @container = @mode.fbremix.container
        
        @container.html ''
        
        @container.append '<div class="left-pane span3"><div class="options"></div><div id="actors-off-list"><ul></ul><div class="clear"></div></div><ul id="actors-list"></ul></div>'
        @options = @container.find '.left-pane > .options'
        @actorsOffList = @container.find '#actors-off-list ul'
        @actorsList = @container.find '#actors-list'
        
        @container.append '<div class="right-pane span9 row-fluid" id="post-container"></div>'
        @postContainer = @container.find '#post-container'

        @stream = new FBRemixApp.Streams.Feed(@mode.fbremix.FB)
        @stream.load () =>        
            @stream.getItems (err, results) =>
                @loadActors results
                @refreshActors()
                @displayItem()
                
    previousItem: () =>
        @stream.previousItem()
        @refreshActors()
        @displayItem()


    nextItem: () =>
        @stream.nextItem()
        @refreshActors()
        @displayItem()

    
    loadActors: (results) =>
        i = 0        
        for item in results
            @actorsList.append "
                <li style=\"display:none\">
                    <div class=\"profile-pic\"><img /></div>
                    <h2 class=\"actor\"></h2>
                </li>"
            
            li = @actorsList.children('li').last()
            li.data 'position', i
            li.data 'feedItem', item
            @mode.applyStyle li
            image = li.find('img').last()
            name = li.find('h2.actor').last()
            image.attr 'src', item.from._data.picture
            image.attr 'alt', item.from.name
            name.html "#{item.from.name}"
            li.click do (i) =>
                =>
                    @repositionStream i
                    
            i = i + 1
        

    refreshActors: () ->
        @actorsList.children('li').removeClass 'selected'

        lesser = @actorsList.children('li').filter (index) => 
            index < @stream.cursor        
        lesser.hide()
        
        #show the last 20 of lesser in actors off list
        @actorsOffList.html ''
        offListFrom = if lesser.length < 20 then 0 else lesser.length - 20
        offList = lesser[offListFrom..lesser.length]
        
        if offList.length
            i = 0

            for item in offList
                item = $j item
                @actorsOffList.append "<li><img src=\"#{item.data('feedItem').from._data.picture}\" /></li>"
                li = @actorsOffList.children('li').last()
                li.click do (i) =>
                    =>
                        @repositionStream i
                
                i++

        
        shown = @actorsList.children('li').not(lesser)
        shown.show()
        shown.first().addClass 'selected'

    
    repositionStream: (i) ->
        @stream.setCursor i
        @refreshActors()
        @displayItem()

        
    displayItem: () ->
        @mode.fbremix.newStylist()
        
        @stream.getItemDetails (err, item) =>

            processedMedia = []
    
            @postContainer.html '<div class="post"></div>'
            post = @postContainer.children('.post').last()
        
            #Heading container
            post.append "
                <div class=\"post-header row-fluid\">
                    <div class=\"profile-pic\">
                        <img />
                    </div>
                    <div class=\"text span8\"></div>
                </div>
                <div class=\"post-content\"></div>
                <div class=\"post-feedback\"></div>"

            #Heading profile picture
            postHeader = post.children('.post-header').last()
            
            profilePic = postHeader.find 'img'            
            profilePic.attr 'src', item.from._data.picture + "?type=large"
                
            textHeader = postHeader.find '.text'
            @displayHeading item, textHeader, { processedMedia: processedMedia }
            
            postContent = post.children('.post-content').last()
            @displayContent item, postContent, { processedMedia: processedMedia }
            
            postFeedback = post.children('.post-feedback').last()
            @displayFeedback item, postFeedback, { processedMedia: processedMedia }
            
            

    displayHeading: (item, renderTo, context) ->
        renderTo.append "<h2 class=\"font-size-largest\"></h2>"

        actorElem = renderTo.children('h2').last()
        actorElem.html item.from.name
        @mode.applyStyle actorElem

        if item.story?
            story = $j.trim(item.story.replace item.from.name, '')
            if story
                renderTo.append "<div class=\"story font-size-larger color-random\">#{story}</div>"
                @mode.applyStyle renderTo.find('.story').last()
                
        if item.to?.data?.length and item.to.data[0].name
            renderTo.append "<div class=\"story font-size-larger color-random\">to #{item.to.data[0].name}</div>"
            @mode.applyStyle renderTo.find('.story').last()
            
        

    displayContent: (item, renderTo, context) ->
        contentText = item.message
        
        if contentText?            
            if @isLink contentText
                renderTo.append "<blockquote class=\"message font-family-quote font-size-larger\">#{contentText}</blockquote>"
                messageElem = renderTo.children('.message').last()

                if @getLinkType(contentText) == 'image'
                    renderTo.append "<div class=\"picture\"><img src=\"#{contentText}\" /></div>"
                    
            else
                renderTo.append "<blockquote class=\"message font-family-quote\">#{contentText}</blockquote>"
                messageElem = renderTo.children('.message').last()
                
                fontSize = @getFontSize contentText
                messageElem.addClass fontSize
                
            #apply a random color 1/2 the time
            if FBRemixApp.Utils.random(2) == 1
                messageElem.addClass 'color-random'
                
            @mode.applyStyle messageElem

        if item._data.loadPictureAsync?
            item._data.loadPictureAsync () =>
                renderTo.append "<div class=\"picture\"><img src=\"#{item._data.picture}\" /></div>"
    
        if item.loadRelatedAsync?
            item.loadRelatedAsync () =>
                if item._related.images?.length
                    renderTo.append "<div class=\"picture\"><img src=\"#{item._related.images[0].source}\" /></div>"
        
    isLink: (text) ->
        text.split(' ').length == 1 and /^http/.test text
    
    
    getLinkType: (url) ->
        r = /https?:\/\/.*(.jpg$)/
        res = url.match(r)
        if res
            ext = res[1].toLowerCase()
            if ext == '.jpg' or '.png' or '.gif' or '.bmp' 
                return 'image'
                
    

    getMedia: (url) ->
        #youtube
        r = /https?:\/\/www\.youtube\.com\/watch\?v\=(\w+)/
        res = url.match(r)
        if res 
            videoId = res[1]
            embed = "<div class=\"media\"><iframe width=\"480\" height=\"360\" src=\"https://www.youtube.com/embed/#{videoId}\" frameborder=\"0\" allowfullscreen></iframe></div>"
            return { content: embed, type: 'youtube', url: url, key: videoId }
        
        r = /https?:\/\/.*(.jpg$)/
        res = url.match(r)
        if res
            ext = res[1].toLowerCase()
            if ext == '.jpg' or '.png' or '.gif' or '.bmp'
                return { content: "<div class=\"media\"><img src=\"#{url}\" /></div>", type: 'image', url: url, key: url }

        return { content: "<a href=\"#{url}\">#{url}</a>", type: 'link', url: url, key: url }
        

    getFontSize: (text) ->
        if text.length < 6
            fontSizeClass = 'font-size-ludicrous'
        else if text.length < 60
            fontSizeClass = 'font-size-huge'
        else if text.length < 200
            fontSizeClass = 'font-size-largest'
        else if text.length < 500
            fontSizeClass = 'font-size-larger'
        else 
            fontSizeClass = 'font-size-medium'
        return fontSizeClass    

    getFontFamily: (text, type) ->
        if type is 'quote'
            if text.length < 300
                return 'font-family-quote'
        
        
        ###
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
###

this.FBRemixApp.Modes.Browse.WallView = WallView

