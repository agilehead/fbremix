class Stream

    constructor: (@FB) ->
    
    
    nextItem: () ->
        if @cursor < @stream.length
            @cursor++

        
    previousItem: () ->
        if @cursor > 0
            @cursor--

    
    setCursor: (i) ->
        if i >= 0 and i < @stream.length
            @cursor = i


    getItems: (callback) =>
        callback null, @stream


    getItem: (callback) ->
        if @stream.length
            callback @stream[@cursor]


    getItemDetails: (callback) =>
        if @stream.length
            item = @stream[@cursor]
            callback null, item

this.FBRemixApp.Streams = {}
this.FBRemixApp.Streams.Stream = Stream

this.FBRemixApp.Streams.load = (location, fbremix) ->
    switch location
        when 'home'
            new FBRemixApp.Streams.Feed(fbremix)
