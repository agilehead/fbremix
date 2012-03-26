class Feed extends FBRemixApp.Streams.Stream
    
    constructor: (FB) ->        
        super(FB)


    load: (callback, currentItem) =>
        @FB.api '/me/home', (response) =>
            if response.data?.length
                @stream = response.data

                if not currentItem?
                    @cursor = 0

                i = 0
                for item in @stream
                    @fetchItemDetails item
                    if currentItem?
                        if item.id == currentItem.id
                            @cursor = i
                    i++
                                            
                callback()

            else
                console.log 'stream.data has no items.'

    fetchItemDetails: (item) =>
        item.from._data = {}
        item.from._data.picture = "https://graph.facebook.com/#{item.from.id}/picture"

        item._data = {}
        if item.type == 'photo'
            if item.picture?
                src = item.picture
                item._data.picture = src.replace '_s.', '_n.'
                item._data.loadPictureAsync = @loadPictureAsync item
            else
                item._data.loadPictureAsync = @loadPictureAsync item
         
         #if id has an underscore, there is a linked story. eg: 3490394850_394850345
         ids = item.id.split('_')
         if ids.length == 2            
            item.loadRelatedAsync = @loadRelatedAsync ids[1], item
            
            
    loadRelatedAsync: (id, item) =>
        return (callback) =>
            if item._related?
                callback()
            else
                @fetchRelatedDetails id, item, callback
         

    fetchRelatedDetails: (id, item, callback) =>
        @FB.api "/#{id}", (response) =>
            item._related = response
            callback()


    loadPictureAsync: (item) =>
        return (callback) =>
            if item._data.picture?
                callback()
            else
                @fetchLinkDetails item, callback


    fetchLinkDetails: (item, callback) =>
        @FB.api "/#{item.object_id}", (response) =>
            item._data.picture = response.images[0].source
            callback()
            
    

    
this.FBRemixApp.Streams.Feed = Feed

