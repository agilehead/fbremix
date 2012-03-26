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

        @stream.onLoadMore () =>
            @loadActors()
            
        @stream.loadMore () =>        
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


    

    
    loadActors: () =>        
        i = 0        
        for item in @stream.stream
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

            if item.loadFullItemAsync?
                item.loadFullItemAsync () =>
                            
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
                    @displayHeading item, textHeader, { processedMedia: [] }
                    
                    postContent = post.children('.post-content').last()
                    @displayContent item, postContent, { processedMedia: [] }
                    
                    postFeedback = post.children('.post-feedback').last()
                    @displayFeedback item, postFeedback, { processedMedia: [] }
            
            

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
                    if not @isProcessed(context.processedMedia, { type: 'image', url: contentText })
                        renderTo.append "<div class=\"picture\"><img src=\"#{contentText}\" /></div>"
                        context.processedMedia.push { type: 'image', url: contentText }
                    
            else
                renderTo.append "<blockquote class=\"message font-family-quote\">#{contentText}</blockquote>"
                messageElem = renderTo.children('.message').last()
                
                fontSize = @getFontSize contentText
                messageElem.addClass fontSize
                
            #apply a random color 1/2 the time
            if FBRemixApp.Utils.random(2) == 1
                messageElem.addClass 'color-random'
                
            @mode.applyStyle messageElem

        if item._data.loadLinkDetailsAsync?
            item._data.loadLinkDetailsAsync () =>
                if not @isProcessed(context.processedMedia, { type: 'image', url: contentText })
                    renderTo.append "<div class=\"picture\"><img src=\"#{item._data.link.picture}\" /></div>"
                    context.processedMedia.push { type: 'image', url: contentText }
                    
                    
        #do not do this if we have already loaded 
    
        if item.loadRelatedDetailsAsync?
            item.loadRelatedDetailsAsync () =>
                if item._related.images?.length
                    if not @isProcessed(context.processedMedia, { type: 'image', url: contentText })
                        renderTo.append "<div class=\"picture\"><img src=\"#{item._related.images[0].source}\" /></div>"
                        context.processedMedia.push { type: 'image', url: contentText }
        
        if item.type == 'video'
            #youtube
            for regex in [/https?:\/\/www\.youtube\.com\/watch\?v\=(\w+)/, /https?:\/\/www\.youtube\.com\/v\/(\w+)/]
                res = item.source.match(regex)
                if res
                    break

            videoId = res[1]
            embed = "<div class=\"media\"><iframe width=\"480\" height=\"360\" src=\"https://www.youtube.com/embed/#{videoId}\" frameborder=\"0\" allowfullscreen></iframe></div>"
            renderTo.append embed

    
    displayFeedback: (item, renderTo, context) ->
        item = item._full ? item
        if item.comments?.data?.length
            renderTo.append "<div class=\"comments-container\"><ul></ul></div>"
            commentList = renderTo.find('.comments-container ul').last()
            for comment in item.comments.data
                commentList.append "<li><div class=\"row\"></div></li>"
                rowDiv = commentList.find('li .row').last()
                rowDiv.append "<div class=\"commenter-image span1 align-right\"><img src=\"https://graph.facebook.com/#{comment.from.id}/picture\" /></div>"
                rowDiv.append "<div class=\"span4\"><h6>#{comment.from.name}</h6><div class=\"message\">#{comment.message}</div>"
                rowDiv.append '<div class="clear"></div>'
        
        
    isLink: (text) ->
        text.split(' ').length == 1 and /^http/.test text
    
    
    getLinkType: (url) ->
        r = /https?:\/\/.*(.jpg$)/
        res = url.match(r)
        if res
            ext = res[1].toLowerCase()
            if ext == '.jpg' or '.png' or '.gif' or '.bmp' 
                return 'image'
                
    
    isProcessed: (list, media) ->
        matches = (item for item in list when item.type == media.type and item.url == media.url)
        if matches.length then true else false
    

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
        
        
this.FBRemixApp.Modes.Browse.WallView = WallView

