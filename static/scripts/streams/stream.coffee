class Stream

    constructor: (@FB) ->
    
    
    nextItem: () ->
        if @cursor < @stream.length
            @cursor++

        
    previousItem: () ->
        if @cursor > 0
            @cursor--

    
    setCursor: (i) ->
        @cursor = i


    getItem: () ->
        if @stream.length
            return @stream[@cursor]


this.FBRemixApp.Streams = {}
this.FBRemixApp.Streams.Stream = Stream

this.FBRemixApp.Streams.load = (location, fbremix) ->
    switch location
        when 'home'
            new FBRemixApp.Streams.Feed(fbremix)
