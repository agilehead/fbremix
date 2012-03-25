class RemixMode


    init: (@fbremix) ->
        @activeStream = []
        @cursor = 0
        
        
    run: () ->


    previousItem: () ->
        @fbremix.parser.previousItem()


    nextItem: () ->
        @fbremix.parser.nextItem()


    getItem: () ->
        @fbremix.stream.getItem()


    refresh: () ->
        @view.displayItem()


    switchBg: () ->
        @refresh()

    
    applyStyle: (item) ->
        @fbremix.stylist.apply item


    
this.FBRemixApp.Modes = {}
this.FBRemixApp.Modes.RemixMode = RemixMode
this.FBRemixApp.modes = []
