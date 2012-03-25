class Stream

    constructor: (@fbremix) ->
        @cursor = 0
        @stream = []
        
    
    nextItem: () ->
        @cursor++
        
        
    previousItem: () ->
        @cursor--


    getItem: () ->
        return @stream[@cursor]

this.FBRemixApp.Streams = {}
this.FBRemixApp.Streams.Stream = Stream

this.FBRemixApp.Streams.load = (location) ->
    switch location
        when 'home'
            new FBRemixApp.Streams.Feed()
