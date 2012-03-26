class Feed extends FBRemixApp.Streams.Stream
    
    constructor: (FB) ->        
        super(FB)
        @events.loadMore = []
        
    
    nextItem: () ->
        super()
        if (@stream.length - @cursor) < 10
            @loadMore()
    
    
    loadMore: (callback) =>
        url = @nextPage ? '/me/home'

        @FB.api url, { limit: 60 }, (response) =>
            if response.data?.length
                @stream.push.apply @stream, response.data

                i = 0
                for item in response.data
                    @setItemDetails item                    
                    i++
                    
                for func in @events.loadMore
                    func()
                    
                callback()
                
                if response.paging?
                    @nextPage = response.paging.next

            else
                console.log 'stream.data has no items.'

    onLoadMore: (func) =>
        @events.loadMore.push func


    setItemDetails: (item) =>
        item.loadFullItemAsync = @loadFullItemAsync item
    
        item.from._data = {}
        item.from._data.picture = "https://graph.facebook.com/#{item.from.id}/picture"

        item._data = { }
        if item.type == 'photo'
            if item.picture?
                item._data.link = { }
                src = item.picture
                item._data.link.picture = src.replace '_s.', '_n.'
                item._data.loadLinkDetailsAsync = @loadLinkDetailsAsync item
            else
                item._data.loadLinkDetailsAsync = @loadLinkDetailsAsync item
         
         #if id has an underscore, there is a linked story. eg: 3490394850_394850345
         ids = item.id.split('_')
         if ids.length == 2            
            item.loadRelatedDetailsAsync = @loadRelatedDetailsAsync ids[1], item
           
           
    loadFullItemAsync: (item) =>
        return (callback) =>
            if item._full?
                callback()
            else
                @fetchFullItem item, callback
         
         
    fetchFullItem: (item, callback) =>
        @FB.api "/#{item.id}", (response) =>
            if (not response) or (not response.id)
                item._full = undefined
                callback()
            else
                item._full = response
                callback()
            
            
    loadRelatedDetailsAsync: (id, item) =>
        return (callback) =>
            if item._related?
                callback()
            else
                @fetchRelatedDetails id, item, callback
         

    fetchRelatedDetails: (id, item, callback) =>
        @FB.api "/#{id}", (response) =>
            item._related = response
            callback()


    loadLinkDetailsAsync: (item) =>
        return (callback) =>
            if item._data.link?
                callback()
            else
                @fetchLinkDetails item, callback


    fetchLinkDetails: (item, callback) =>
        @FB.api "/#{item.object_id}", (response) =>            
            if response.images? and response.images.length
                item._data.link = { }
                item._data.link.picture = response.images[0].source
                callback()
            
    

    
this.FBRemixApp.Streams.Feed = Feed

