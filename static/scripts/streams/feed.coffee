class Feed extends FBRemixApp.Streams.Stream

    load: (callback) ->
        @FB.api '/me/home', (response) =>
            @stream = response.data
            callback()


    getSummary: (callback) ->
        results = []
        for item in @stream
            results.push { name: item.from.name, picture: "https://graph.facebook.com/#{item.from.id}/picture" }
        callback null, results
    
    
this.FBRemixApp.Streams.Feed = Feed

