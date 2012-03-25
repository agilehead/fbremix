class Feed extends FBRemixApp.Streams.Stream
    
    constructor: (FB) ->        
        super(FB)
        @load () =>
            if @stream.length
                @cursor = 0
        


    load: (callback) =>
        @FB.api '/me/home', (response) =>
            @stream = response.data
            callback()


    getItems: (callback) ->
        results = []
        for item in @stream
            item.from.picture = "https://graph.facebook.com/#{item.from.id}/picture"
            results.push item
        callback null, results
    
    
this.FBRemixApp.Streams.Feed = Feed

